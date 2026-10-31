import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  CheckCircle,
  X,
  Info
} from 'lucide-react';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import BeachMapSection from './components/BeachMapSection';
import CitizenReportsSection from './components/CitizenReportsSection';
import TransparencyHub from './components/TransparencyHub';
import FAQSection from './components/FAQSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import CreateReportModal from './components/CreateReportModal';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import FloatingChatBot from './components/FloatingChatBot';

import { getAdminSession, logoutAdmin } from './services/adminAuthService';

import {
  subscribeToReports,
  seedInitialReports,
  createReport,
  upvoteReport as updateFirestoreVote
} from './services/reportService';

export default function App() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sesi akun pengguna (Warga)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('reforca_user_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.role === 'admin') {
          return { ...parsed, role: 'warga' };
        }
        return parsed;
      } catch {
        return null;
      }
    }
    return null;
  });

  // Sesi akun administrator (DLH)
  const [adminUser, setAdminUser] = useState(() => getAdminSession());

  // Current route: '/' untuk Landing Page, '/admin' untuk Ruang Komando Instansi
  const [currentRoute, setCurrentRoute] = useState(() => {
    return window.location.pathname === '/admin' ? '/admin' : '/';
  });

  const [toast, setToast] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [modalInitialTab, setModalInitialTab] = useState('report');

  // Initialize AOS animation library
  useEffect(() => {
    AOS.init({
      duration: 550,
      easing: 'ease-out-cubic',
      once: true,
      offset: 30,
    });
  }, []);

  // Sync Real-time Firestore Reports
  useEffect(() => {
    seedInitialReports();

    const unsubscribe = subscribeToReports((data) => {
      setReports(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync route pada browser popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname === '/admin' ? '/admin' : '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Simpan sesi user ke localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('reforca_user_session', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('reforca_user_session');
    }
  }, [currentUser]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const handleNavigate = (route) => {
    // Jika meninggalkan halaman admin menuju halaman utama, hapus sesi admin demi keamanan
    if (route === '/' && currentRoute === '/admin') {
      logoutAdmin();
      setAdminUser(null);
    }

    setCurrentRoute(route);
    window.history.pushState({}, '', route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      AOS.refresh();
    }, 150);
  };

  const handleOpenReportModal = () => {
    if (!currentUser) {
      setModalInitialTab('login');
      showToast('Silakan masuk atau daftar akun untuk mengirim laporan.', 'info');
    } else {
      setModalInitialTab('report');
    }
    setIsReportModalOpen(true);
  };

  const handleOpenLoginModal = () => {
    setModalInitialTab('login');
    setIsReportModalOpen(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Anda telah keluar dari akun.', 'info');
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    showToast(`Berhasil masuk sebagai ${user.name}.`, 'success');
  };

  const handleAdminLoginSuccess = (session) => {
    setAdminUser(session);
    showToast(`Berhasil masuk ke Ruang Komando sebagai ${session.email}.`, 'success');
  };

  const handleAdminLogout = async () => {
    await logoutAdmin();
    setAdminUser(null);
    showToast('Sesi administrator telah berakhir dan diamankan.', 'info');
    handleNavigate('/admin');
  };

  const handleAddReport = async (newReport) => {
    try {
      const reportWithUser = {
        ...newReport,
        reporterName: currentUser?.name || newReport.reporterName,
        reporterContact: currentUser?.phone || newReport.reporterContact,
        reporterEmail: currentUser?.email,
        reporterUserId: currentUser?.id
      };

      await createReport(reportWithUser);
      showToast(`Laporan "${newReport.locationName}" berhasil diterbitkan ke sistem Cloud Firestore.`, 'success');
    } catch (err) {
      console.error("Gagal menambahkan laporan:", err);
      showToast("Gagal menyimpan laporan ke database.", "error");
    }
  };

  const handleUpvote = async (reportId, isIncrement) => {
    try {
      const targetReport = reports.find(r => r.id === reportId);
      if (!targetReport) return;

      const currentVotes = targetReport.votesCount || 0;
      const newVotes = Math.max(0, currentVotes + (isIncrement ? 1 : -1));

      await updateFirestoreVote(reportId, newVotes);

      if (isIncrement) {
        showToast('Dukungan suara berhasil dicatat untuk prioritas penanganan.', 'success');
      }
    } catch (err) {
      console.error("Gagal melakukan upvote:", err);
    }
  };

  const handleUpdateReport = (updatedDoc) => {
    showToast(`Status penanganan untuk "${updatedDoc.locationName}" berhasil diperbarui.`, 'success');
  };

  const scrollToReportsSection = () => {
    const el = document.getElementById('laporan-warga');
    if (el) {
      const navOffset = 90;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // ==========================================
  // ISOLASI TAMPILAN JIKA BERADA DI RUTE /admin
  // ==========================================
  if (currentRoute === '/admin') {
    return (
      <div className="min-h-screen bg-[#0F172A] text-white flex flex-col justify-between font-sans selection:bg-cyan-500 selection:text-slate-950">
        {!adminUser ? (
          // Jika belum login admin, tampilkan form login khusus (tanpa navbar warga)
          <main className="flex-1 w-full flex flex-col justify-center">
            <AdminLogin
              onLoginSuccess={handleAdminLoginSuccess}
              onBackHome={() => handleNavigate('/')}
            />
          </main>
        ) : (
          // Jika sudah login admin, tampilkan Ruang Komando eksklusif
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-700 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    Portal Internal Kedinasan
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
                    <span>Terautentikasi</span>
                  </span>
                </div>
                <h1 className="text-2xl font-black text-white mt-1">
                  Ruang Komando Instansi: Dinas Lingkungan Hidup
                </h1>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs">
                  <div className="w-6 h-6 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-[10px]">
                    DLH
                  </div>
                  <div className="text-left hidden md:block">
                    <span className="block text-white font-bold text-[11px] leading-tight">
                      {adminUser.email}
                    </span>
                    <span className="text-[10px] text-cyan-400 block leading-tight">
                      Administrator Resmi
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAdminLogout}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-1"
                    title="Keluar dari sesi Admin"
                  >
                    Keluar
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleNavigate('/')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  &larr; Halaman Utama
                </button>
              </div>
            </div>

            <AdminDashboard
              reports={reports}
              onUpdateReport={handleUpdateReport}
            />
          </main>
        )}

        {/* Footer minimalis khusus area admin */}
        <footer className="py-6 text-center text-xs text-slate-500 border-t border-slate-800/80">
          Reforca Command Center &copy; 2026 &bull; Dinas Lingkungan Hidup
        </footer>
      </div>
    );
  }

  // ==========================================
  // TAMPILAN STANDAR PORTAL PUBLIK WARGA
  // ==========================================
  return (
    <div className="min-h-screen flex flex-col bg-[#0F172A] text-[#0F172A] font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 right-4 z-[9999] max-w-md animate-fade-in pointer-events-none">
          <div className="pointer-events-auto p-4 rounded-2xl bg-white border border-[#E2E8F0] text-xs shadow-xl flex items-center gap-3 text-[#0F172A]">
            <div className={`p-2 rounded-xl ${toast.type === 'info' ? 'bg-[#EFF6FF] text-[#1D4ED8]' : 'bg-[#DCFCE7] text-[#16A34A]'}`}>
              {toast.type === 'info' ? <Info size={18} /> : <CheckCircle size={18} />}
            </div>
            <p className="flex-1 leading-snug font-medium text-[#334155]">{toast.message}</p>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-slate-700 font-bold p-1"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* FLOATING HEADER NAVBAR (Hanya muncul di portal publik warga) */}
      <Navbar
        currentUser={currentUser}
        adminUser={adminUser}
        onOpenReportModal={handleOpenReportModal}
        onOpenLoginModal={handleOpenLoginModal}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        currentRoute={currentRoute}
      />

      <main className="flex-1 w-full flex flex-col">
        <HeroSection onScrollToReports={scrollToReportsSection} />
        <FeaturesSection />
        <BeachMapSection
          reports={reports}
          onSelectReport={() => scrollToReportsSection()}
        />
        <CitizenReportsSection
          reports={reports}
          onUpvote={handleUpvote}
        />
        <TransparencyHub reports={reports} />
        <FAQSection />
        <ContactSection onOpenReportModal={handleOpenReportModal} />
      </main>

      {/* Floating AI Chatbot Widget (Pengganti Scroll to Top) */}
      <FloatingChatBot />

      <Footer onNavigate={handleNavigate} />

      <CreateReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitReport={handleAddReport}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        initialTab={modalInitialTab}
      />

    </div>
  );
}