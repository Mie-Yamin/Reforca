import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  increment 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { INITIAL_REPORTS } from '../data/mockFirestore';

const REPORTS_COLLECTION = 'reports';
const LOCAL_STORAGE_REPORTS_KEY = 'reforca_live_reports';

/**
 * Mengambil data laporan lokal dari localStorage (dengan fallback INITIAL_REPORTS)
 */
export function getLocalReports() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Gagal membaca cache lokal laporan:", err);
  }
  // Simpan data inisial ke localStorage agar selalu ada data acuan
  try {
    localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(INITIAL_REPORTS));
  } catch (_e) {
    // Ignore storage quota
  }
  return INITIAL_REPORTS;
}

/**
 * Menyimpan data laporan ke localStorage dan memancarkan event pembaruan
 */
function saveLocalReports(reportsList) {
  try {
    localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(reportsList));
  } catch (err) {
    console.warn("Gagal menyimpan ke localStorage:", err);
  }

  // Notifikasi real-time di window saat ini & lintas komponen
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('reforca:reports_changed', { detail: reportsList }));
  }
}

/**
 * Berlangganan data laporan secara realtime (Hybrid: Firestore + Local Cache)
 * Memastikan web user dan web admin selalu tersambung secara instan & real-time.
 */
export function subscribeToReports(onData, onError) {
  // 1. Tampilkan data dari cache lokal terlebih dahulu agar UI instan tanpa loading
  const initialLocal = getLocalReports();
  onData(initialLocal);

  // 2. Berlangganan event lokal agar update dari tab/komponen langsung ter-render
  const handleLocalChange = (e) => {
    if (e.detail && Array.isArray(e.detail)) {
      onData(e.detail);
    }
  };

  const handleStorageEvent = (e) => {
    if (e.key === LOCAL_STORAGE_REPORTS_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed)) {
          onData(parsed);
        }
      } catch (_err) {
        // Ignore
      }
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('reforca:reports_changed', handleLocalChange);
    window.addEventListener('storage', handleStorageEvent);
  }

  // 3. Sinkronisasi dengan Google Cloud Firestore
  let unsubscribeFirestore = () => {};
  try {
    const reportsCol = collection(db, REPORTS_COLLECTION);
    unsubscribeFirestore = onSnapshot(
      reportsCol,
      async (snapshot) => {
        if (snapshot.empty) {
          console.log("Koleksi Firestore kosong, seeding data awal...");
          try {
            await seedInitialReports();
          } catch (err) {
            console.warn("Gagal seeding otomatis:", err);
          }
          return;
        }

        const firestoreList = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }));

        // Gabungkan dengan laporan lokal yang mungkin baru dibuat
        const currentLocal = getLocalReports();
        const mergedMap = new Map();

        // Masukkan data lokal terlebih dahulu
        currentLocal.forEach(r => mergedMap.set(r.id, r));

        // Timpa / tambahkan dengan data Firestore yang masuk
        firestoreList.forEach(r => mergedMap.set(r.id, r));

        const mergedList = Array.from(mergedMap.values());
        mergedList.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

        saveLocalReports(mergedList);
        onData(mergedList);
      },
      (err) => {
        console.warn("Firestore snapshot offline/fallback ke cache lokal:", err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn("Inisialisasi Firestore listener gagal, menggunakan storage lokal:", err);
  }

  // Cleanup subscription
  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('reforca:reports_changed', handleLocalChange);
      window.removeEventListener('storage', handleStorageEvent);
    }
    unsubscribeFirestore();
  };
}

/**
 * Seeding data awal ke Firestore jika database kosong
 */
export async function seedInitialReports() {
  for (const report of INITIAL_REPORTS) {
    try {
      const reportRef = doc(db, REPORTS_COLLECTION, report.id);
      await setDoc(reportRef, report, { merge: true });
    } catch (_err) {
      // Abaikan jika Firestore permissions terbatas
    }
  }
}

/**
 * Membuat laporan baru oleh warga.
 * Otomatis tersambung dan masuk ke Admin Dashboard serta database.
 */
export async function createReport(reportData) {
  const newId = reportData.id || `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  
  const newReport = {
    ...reportData,
    id: newId,
    status: reportData.status || 'Pending',
    assignedVendor: reportData.assignedVendor || 'Belum Ditugaskan',
    costDetails: reportData.costDetails || { totalCost: 0, breakdown: [] },
    votesCount: reportData.votesCount || 1,
    citizenConfirmed: reportData.citizenConfirmed || false,
    createdAt: reportData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // 1. Simpan segera ke cache lokal agar langsung muncul di web admin & web user
  const currentReports = getLocalReports();
  const updatedList = [newReport, ...currentReports.filter(r => r.id !== newId)];
  saveLocalReports(updatedList);

  // 2. Kirim ke Cloud Firestore
  try {
    const reportRef = doc(db, REPORTS_COLLECTION, newId);
    await setDoc(reportRef, newReport, { merge: true });
  } catch (err) {
    console.warn("Gagal sinkron ke Cloud Firestore (tetap tersimpan di cache lokal):", err);
  }

  return newReport;
}

/**
 * Update penanganan laporan oleh Instansi/Admin (Ruang Komando).
 * Mengubah status (Pending -> In Progress -> Completed), vendor, foto after, dan rincian biaya
 * yang langsung dikirim dan ditampilkan di web user.
 */
export async function updateReportStatus(reportId, updates) {
  if (!reportId) return null;

  const currentReports = getLocalReports();
  const targetIndex = currentReports.findIndex(r => r.id === reportId);

  let updatedReport = null;
  if (targetIndex !== -1) {
    updatedReport = {
      ...currentReports[targetIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    currentReports[targetIndex] = updatedReport;
    saveLocalReports([...currentReports]);
  }

  // Sinkronisasi ke Cloud Firestore
  try {
    const reportRef = doc(db, REPORTS_COLLECTION, reportId);
    await setDoc(reportRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn("Gagal update ke Firestore (tetap tersimpan di cache lokal):", err);
  }

  return updatedReport;
}

/**
 * Memberikan dukungan / upvote warga pada sebuah laporan
 */
export async function upvoteReport(reportId, newVotesCount) {
  if (!reportId) return;

  const currentReports = getLocalReports();
  const targetIndex = currentReports.findIndex(r => r.id === reportId);
  if (targetIndex !== -1) {
    const calculatedVotes = typeof newVotesCount === 'number' 
      ? newVotesCount 
      : (currentReports[targetIndex].votesCount || 0) + 1;

    currentReports[targetIndex] = {
      ...currentReports[targetIndex],
      votesCount: calculatedVotes,
      updatedAt: new Date().toISOString()
    };
    saveLocalReports([...currentReports]);
  }

  try {
    const reportRef = doc(db, REPORTS_COLLECTION, reportId);
    if (typeof newVotesCount === 'number') {
      await updateDoc(reportRef, {
        votesCount: newVotesCount,
        updatedAt: new Date().toISOString()
      });
    } else {
      await updateDoc(reportRef, {
        votesCount: increment(1),
        updatedAt: new Date().toISOString()
      });
    }
  } catch (err) {
    console.warn("Upvote Firestore sync fallback:", err);
  }
}

/**
 * Konfirmasi pembersihan oleh warga (Citizen Verification)
 */
export async function confirmCitizenCleanup(reportId) {
  if (!reportId) return;

  const currentReports = getLocalReports();
  const targetIndex = currentReports.findIndex(r => r.id === reportId);
  if (targetIndex !== -1) {
    currentReports[targetIndex] = {
      ...currentReports[targetIndex],
      citizenConfirmed: true,
      updatedAt: new Date().toISOString()
    };
    saveLocalReports([...currentReports]);
  }

  try {
    const reportRef = doc(db, REPORTS_COLLECTION, reportId);
    await updateDoc(reportRef, {
      citizenConfirmed: true,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.warn("Confirm cleanup sync fallback:", err);
  }
}

/**
 * Hapus laporan oleh Admin
 */
export async function deleteReport(reportId) {
  if (!reportId) return;

  const currentReports = getLocalReports();
  const filtered = currentReports.filter(r => r.id !== reportId);
  saveLocalReports(filtered);

  try {
    const reportRef = doc(db, REPORTS_COLLECTION, reportId);
    await deleteDoc(reportRef);
  } catch (err) {
    console.warn("Delete report sync fallback:", err);
  }
}
