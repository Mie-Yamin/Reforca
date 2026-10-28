import { 
  collection, 
  doc, 
  onSnapshot, 
  addDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  increment, 
  getDocs 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { INITIAL_REPORTS } from '../data/mockFirestore';

const REPORTS_COLLECTION = 'reports';

/**
 * Berlangganan data laporan secara realtime dari Firestore.
 * Jika koleksi di Firestore masih kosong (proyek baru),
 * otomatis melakukan seeding awal dengan INITIAL_REPORTS agar tampilan tidak kosong.
 */
export function subscribeToReports(onData, onError) {
  const reportsCol = collection(db, REPORTS_COLLECTION);

  return onSnapshot(
    reportsCol,
    async (snapshot) => {
      if (snapshot.empty) {
        console.log("Koleksi Firestore masih kosong. Melakukan seeding data awal...");
        try {
          await seedInitialReports();
          // Data akan ter-trigger kembali melalui snapshot berikutnya
        } catch (err) {
          console.warn("Gagal seeding otomatis, menampilkan data lokal:", err);
          onData(INITIAL_REPORTS);
        }
        return;
      }

      const list = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));

      // Urutkan berdasarkan tanggal terbaru (descending)
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

      onData(list);
    },
    (err) => {
      console.error("Firestore snapshot error:", err);
      if (onError) onError(err);
    }
  );
}

/**
 * Seeding data awal ke Firestore jika database kosong
 */
export async function seedInitialReports() {
  for (const report of INITIAL_REPORTS) {
    const reportRef = doc(db, REPORTS_COLLECTION, report.id);
    await setDoc(reportRef, report, { merge: true });
  }
}

/**
 * Membuat laporan baru oleh warga
 */
export async function createReport(reportData) {
  const newReport = {
    ...reportData,
    status: reportData.status || 'Pending',
    assignedVendor: reportData.assignedVendor || 'Belum Ditugaskan',
    costDetails: reportData.costDetails || { totalCost: 0, breakdown: [] },
    votesCount: reportData.votesCount || 0,
    citizenConfirmed: reportData.citizenConfirmed || false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (reportData.id) {
    const reportRef = doc(db, REPORTS_COLLECTION, reportData.id);
    await setDoc(reportRef, newReport);
    return reportData.id;
  } else {
    const docRef = await addDoc(collection(db, REPORTS_COLLECTION), newReport);
    return docRef.id;
  }
}

/**
 * Memberikan dukungan / upvote warga pada sebuah laporan
 */
export async function upvoteReport(reportId) {
  if (!reportId) return;
  const reportRef = doc(db, REPORTS_COLLECTION, reportId);
  await updateDoc(reportRef, {
    votesCount: increment(1),
    updatedAt: new Date().toISOString()
  });
}

/**
 * Update penanganan laporan oleh Instansi/Admin (Ruang Komando)
 */
export async function updateReportStatus(reportId, updates) {
  if (!reportId) return;
  const reportRef = doc(db, REPORTS_COLLECTION, reportId);
  await updateDoc(reportRef, {
    ...updates,
    updatedAt: new Date().toISOString()
  });
}

/**
 * Konfirmasi pembersihan oleh warga (Citizen Verification)
 */
export async function confirmCitizenCleanup(reportId) {
  if (!reportId) return;
  const reportRef = doc(db, REPORTS_COLLECTION, reportId);
  await updateDoc(reportRef, {
    citizenConfirmed: true,
    updatedAt: new Date().toISOString()
  });
}

/**
 * Hapus laporan (jika diperlukan oleh Admin)
 */
export async function deleteReport(reportId) {
  if (!reportId) return;
  const reportRef = doc(db, REPORTS_COLLECTION, reportId);
  await deleteDoc(reportRef);
}
