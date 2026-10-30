import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { 
  ArrowUp, 
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

import { INITIAL_REPORTS } from './data/mockFirestore';

export default function App() {
  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem('reforca_reports_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_REPORTS;
      }
    }
    return INITIAL_REPORTS;
  });

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

  // Current route: '/' untuk Landing Page, '/admin' untuk Ruang Komando Instansi
  const [currentRoute, setCurrentRoute] = useState(() => {
    return window.location.pathname === '/admin' ? '/admin' : '/';
  });

  const [toast, setToast] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
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

  // Sync route pada browser popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname === '/admin' ? '/admin' : '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Show/Hide Floating Scroll To Top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simpan data laporan ke localStorage
  useEffect(() => {
    localStorage.setItem('reforca_reports_v2', JSON.stringify(reports));
  }, [reports]);

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

  const handleAddReport = (newReport) => {
    const reportWithUser = {
      ...newReport,
      reporterName: currentUser?.name || newReport.reporterName,
      reporterContact: currentUser?.phone || newReport.reporterContact,
      reporterEmail: currentUser?.email,
      reporterUserId: currentUser?.id
    };

    setReports((prev) => [reportWithUser, ...prev]);
    showToast(`Laporan "${newReport.locationName}" berhasil diterbitkan ke sistem Reforca.`, 'success');
  };

  const handleUpvote = (reportId, isIncrement) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          const newVotes = Math.max(0, (r.votesCount || 0) + (isIncrement ? 1 : -1));
          return { ...r, votesCount: newVotes, updatedAt: new Date().toISOString() };
        }
        return r;
      })
    );

    if (isIncrement) {
      showToast('Dukungan suara berhasil dicatat untuk prioritas penanganan.', 'success');
    }
  };

  const handleUpdateReport = (updatedDoc) => {
    setReports((prev) =>
      prev.map((r) => (r.id === updatedDoc.id ? updatedDoc : r))
    );
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

  return (
    <div className="min-h-screen flex flex-col bg-[#0F172A] text-[#0F172A] font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 right-4 z-[9999] max-w-md animate-fade-in pointer-events-none">
          <div className="pointer-events-auto p-4 rounded-2xl bg-white border border-[#E2E8F0] text-xs shadow-xl flex items-center gap-3 text-[#0F172A]">
            <div className={`p-2 rounded-xl ${
              toast.type === 'info' ? 'bg-[#EFF6FF] text-[#1D4ED8]' : 'bg-[#DCFCE7] text-[#16A34A]'
            }`}>
              {toast.type === 'info' ? <Info size={18} /> : <CheckCircle size={18} />}
            </div>
            <p className="flex-1 leading-snug font-medium text-[#334155]">{toast.message}</p>
            <button 
              type="button"
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-slate-700 font-bold p-1"
              aria-label="Tutup notifikasi"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* 1. FLOATING HEADER NAVBAR (Clean White Pill Container: HOME, FITUR, LAPORAN WARGA, FAQ, KONTAK) */}
      <Navbar 
        currentUser={currentUser}
        onOpenReportModal={handleOpenReportModal}
        onOpenLoginModal={handleOpenLoginModal}
        onLogout={handleLogout}
      />

      {currentRoute === '/' ? (
        <main className="flex-1 w-full flex flex-col">
          
          {/* 2. HERO SECTION (Latar Pantai & Tebing Tropis + Floating Glass Card Deep Slate Navy 85%) */}
          <HeroSection 
            onScrollToReports={scrollToReportsSection}
          />

          {/* 3. SECTION FITUR & ALUR KERJA WEB */}
          <FeaturesSection />

          {/* 4. SECTION PETA INTERAKTIF & LIVE STATS */}
          <BeachMapSection 
            reports={reports}
            onSelectReport={(_report) => {
              scrollToReportsSection();
            }}
          />

          {/* 5. SECTION LAPORAN WARGA */}
          <CitizenReportsSection 
            reports={reports}
            onUpvote={handleUpvote}
          />

          {/* 6. SECTION TRANSPARANSI DATA & ANGGARAN */}
          <TransparencyHub 
            reports={reports}
          />

          {/* 7. SECTION FAQ */}
          <FAQSection />

          {/* 8. SECTION KONTAK */}
          <ContactSection 
            onOpenReportModal={handleOpenReportModal}
          />

        </main>
      ) : (
        /* Admin Command Center Route (Ruang Komando Instansi) */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-700">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Portal Internal Kedinasan
              </span>
              <h1 className="text-2xl font-black text-white">
                Ruang Komando Instansi: Dinas Lingkungan Hidup
              </h1>
            </div>
            <button
              type="button"
              onClick={() => handleNavigate('/')}
              className="px-4 py-2 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-bold transition-all shadow-xs"
            >
              &larr; Kembali ke Halaman Utama
            </button>
          </div>

          <AdminDashboard 
            reports={reports}
            onUpdateReport={handleUpdateReport}
          />
        </main>
      )}

      {/* Floating Scroll To Top Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-[450] p-3 rounded-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold shadow-lg transition-all hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
          title="Kembali ke atas"
          aria-label="Kembali ke atas halaman"
        >
          <ArrowUp size={18} />
        </button>
      )}

      {/* FOOTER RINGKAS */}
      <Footer />

      {/* Modal Buat Laporan & Autentikasi Pengguna */}
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
