import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

/**
 * Mengambil daftar email yang diizinkan untuk login sebagai admin.
 * Dapat dikonfigurasi melalui environment variable VITE_ADMIN_EMAILS (dipisah koma).
 * Default: admin@reforca.id
 */
export const getAllowedAdminEmails = () => {
  const envEmails = import.meta.env.VITE_ADMIN_EMAILS;
  if (envEmails && typeof envEmails === 'string') {
    return envEmails
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.length > 0);
  }
  return ['admin@reforca.id'];
};

/**
 * Memeriksa apakah sebuah email termasuk dalam daftar admin yang diizinkan.
 */
export const isAllowedAdminEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const normalized = email.trim().toLowerCase();
  const allowed = getAllowedAdminEmails();
  return allowed.includes(normalized);
};

/**
 * Mengambil kata sandi default admin dari environment variable atau fallback.
 */
export const getAdminDefaultPassword = () => {
  return import.meta.env.VITE_ADMIN_PASSWORD || 'adminreforca2026';
};

/**
 * Melakukan proses login admin khusus email & password.
 * Memvalidasi apakah email terdaftar di whitelist dan kata sandi cocok.
 */
export const loginAdmin = async (email, password) => {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  if (!cleanEmail) {
    throw new Error('Silakan masukkan alamat email administrator.');
  }

  if (!cleanPassword) {
    throw new Error('Silakan masukkan kata sandi administrator.');
  }

  // 1. Validasi Whitelist Email Admin
  if (!isAllowedAdminEmail(cleanEmail)) {
    throw new Error(
      `Akses Ditolak: Email "${cleanEmail}" tidak terdaftar dalam otoritas staf Dinas Lingkungan Hidup / Administrator Reforca.`
    );
  }

  // 2. Validasi Kata Sandi (Firebase Auth jika ada, atau fallback env credentials)
  const expectedPassword = getAdminDefaultPassword();
  let firebaseSuccess = false;
  let adminUid = `admin_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
    if (userCredential?.user) {
      firebaseSuccess = true;
      adminUid = userCredential.user.uid;
    }
  } catch (_fbErr) {
    // Jika Firebase email/password belum diaktifkan di console Firebase,
    // kita gunakan verifikasi kredensial terkonfigurasi (VITE_ADMIN_PASSWORD).
    if (cleanPassword !== expectedPassword) {
      throw new Error('Kata sandi administrator salah. Silakan coba lagi.');
    }
  }

  if (!firebaseSuccess && cleanPassword !== expectedPassword) {
    throw new Error('Kata sandi administrator salah. Silakan coba lagi.');
  }

  // 3. Buat sesi admin
  const adminSession = {
    id: adminUid,
    name: 'Administrator DLH',
    email: cleanEmail,
    role: 'admin',
    department: 'Dinas Lingkungan Hidup',
    agency: 'Pemerintah Provinsi DKI Jakarta',
    loggedInAt: new Date().toISOString()
  };

  localStorage.setItem('reforca_admin_session', JSON.stringify(adminSession));
  return adminSession;
};

/**
 * Mengambil sesi admin aktif jika valid.
 */
export const getAdminSession = () => {
  try {
    const raw = localStorage.getItem('reforca_admin_session');
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (session?.role === 'admin' && isAllowedAdminEmail(session?.email)) {
      return session;
    }
    // Jika email di sesi tidak lagi ada di whitelist, bersihkan
    localStorage.removeItem('reforca_admin_session');
    return null;
  } catch {
    return null;
  }
};

/**
 * Keluar dari sesi admin.
 */
export const logoutAdmin = async () => {
  try {
    await signOut(auth);
  } catch {
    // Abaikan jika tidak menggunakan Firebase session
  }
  localStorage.removeItem('reforca_admin_session');
};
