import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { 
  ArrowUp,
  CheckCircle,
  Building2,
  X
} from 'lucide-react';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ImpactStatsBar from './components/ImpactStatsBar';
import FeaturesSection from './components/FeaturesSection';
import CitizenReportsSection from './components/CitizenReportsSection';
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

  // Current route: '/' for Full Landing Page, '/admin' for Ruang Komando Instansi
  const [currentRoute, setCurrentRoute] = useState(() => {
    return window.location.pathname === '/admin' ? '/admin' : '/';
  });

  const [toast, setToast] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Initialize AOS animation library
  useEffect(() => {
    AOS.init({
      duration: 550,
      easing: 'ease-out-cubic',
      once: true,
      offset: 30,
    });
  }, []);

  // Sync route on browser navigation popstate
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

  // Persist reports to localStorage
  useEffect(() => {
    localStorage.setItem('reforca_reports_v2', JSON.stringify(reports));
  }, [reports]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleNavigate = (route) => {
    setCurrentRoute(route);
    window.history.pushState({}, '', route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      AOS.refresh();
    }, 150);
  };

  // Add Citizen Report Handler
  const handleAddReport = (newReport) => {
    setReports((prev) => [newReport, ...prev]);
    showToast(`Laporan "${newReport.locationName}" berhasil diterbitkan ke sistem Reforca.`, 'success');
  };

  // Upvote Handler
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

  // Update Report (from Admin command center)
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
    <div className="min-h-screen flex flex-col bg-white text-[#0F172A] font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 right-4 z-[9999] max-w-md animate-fade-in pointer-events-none">
          <div className="pointer-events-auto p-4 rounded-2xl bg-white border border-[#E2E8F0] text-xs shadow-xl flex items-center gap-3 text-[#0F172A]">
            <div className="p-2 rounded-xl bg-[#DCFCE7] text-[#16A34A]">
              <CheckCircle size={18} />
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

      {/* ========================================================= */}
      {/* 1. STICKY HEADER NAVBAR (Capsule Mengambang Putih)       */}
      {/* ========================================================= */}
      <Navbar 
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Conditional View: Landing Page (Default) vs Admin Command Center */}
      {currentRoute === '/' ? (
        <main className="flex-1 w-full flex flex-col">
          
          {/* ========================================================= */}
          {/* 2. HERO SECTION (Tebing Pesisir Nyata + Dark Floating Card)*/}
          {/* ========================================================= */}
          <HeroSection 
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onScrollToReports={scrollToReportsSection}
          />

          {/* ========================================================= */}
          {/* 3. IMPACT STATS BAR (Clean Style White Banner)           */}
          {/* ========================================================= */}
          <ImpactStatsBar />

          {/* ========================================================= */}
          {/* 4. SECTION PENGENALAN FITUR (Fitur Utama Reforca)        */}
          {/* ========================================================= */}
          <FeaturesSection />

          {/* ========================================================= */}
          {/* 5. SECTION LAPORAN WARGA (News/Article Card Grid Layout) */}
          {/* ========================================================= */}
          <CitizenReportsSection 
            reports={reports}
            onUpvote={handleUpvote}
          />

          {/* ========================================================= */}
          {/* 6. SECTION FAQ (Frequently Asked Questions)              */}
          {/* ========================================================= */}
          <FAQSection />

          {/* ========================================================= */}
          {/* 7. SECTION KONTAK & BANNER PENUTUP                       */}
          {/* ========================================================= */}
          <ContactSection 
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />

          {/* Floating Admin Portal Switcher */}
          <div className="fixed bottom-6 left-6 z-[450] hidden sm:block">
            <button
              type="button"
              onClick={() => handleNavigate('/admin')}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] text-xs font-bold shadow-md flex items-center gap-2 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
              title="Buka Ruang Komando Instansi Pemerintah"
            >
              <Building2 size={14} className="text-[#1D4ED8]" />
              <span>Ruang Komando Instansi (/admin)</span>
            </button>
          </div>

        </main>
      ) : (
        /* Admin Command Center Route */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
            <div>
              <span className="text-xs font-bold text-[#1D4ED8] uppercase tracking-wider">
                Portal Internal Kedinasan
              </span>
              <h1 className="text-2xl font-black text-[#0F172A]">
                Ruang Komando Instansi: Dinas Lingkungan Hidup
              </h1>
            </div>
            <button
              type="button"
              onClick={() => handleNavigate('/')}
              className="px-4 py-2 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-bold transition-all shadow-xs"
            >
              &larr; Kembali ke Landing Page Warga
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

      {/* ========================================================= */}
      {/* 8. FOOTER BERSIH LATAR PUTIH / GRAY                      */}
      {/* ========================================================= */}
      <Footer onNavigateToAdmin={() => handleNavigate('/admin')} />

      {/* Modal Buat Laporan & Masuk Akun */}
      <CreateReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitReport={handleAddReport}
        onLoginSuccess={(role) => {
          if (role === 'admin') {
            handleNavigate('/admin');
          } else {
            showToast('Selamat datang kembali di Reforca!', 'success');
          }
        }}
      />

    </div>
  );
}
