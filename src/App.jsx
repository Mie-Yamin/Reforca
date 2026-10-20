import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import { 
  Waves, 
  MapPin, 
  FileText, 
  DollarSign, 
  Sparkles, 
  ShieldCheck, 
  ArrowUp,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import BeachMap from './components/BeachMap';
import PublicReportForm from './components/PublicReportForm';
import PublicFeed from './components/PublicFeed';
import TransparencyHub from './components/TransparencyHub';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';

import { INITIAL_REPORTS } from './data/mockFirestore';

export default function App() {
  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem('reforca_reports_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_REPORTS;
      }
    }
    return INITIAL_REPORTS;
  });

  // Router: support window.location.pathname or SPA internal state
  const [currentRoute, setCurrentRoute] = useState(() => {
    return window.location.pathname === '/admin' ? '/admin' : '/';
  });

  const [activeReportId, setActiveReportId] = useState(null);
  const [toast, setToast] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Initialize AOS (Animate On Scroll)
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 40,
    });
  }, []);

  // Listen to browser popstate (Back/Forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname === '/admin' ? '/admin' : '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Persist to localStorage to simulate Firestore BaaS persistence
  useEffect(() => {
    localStorage.setItem('reforca_reports_v1', JSON.stringify(reports));
  }, [reports]);

  // Toast Helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Navigation Handler
  const handleNavigate = (route) => {
    setCurrentRoute(route);
    window.history.pushState({}, '', route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      AOS.refresh();
    }, 150);
  };

  // Add Report Handler (Citizen Reporting)
  const handleAddReport = (newReport) => {
    setReports((prev) => [newReport, ...prev]);
    showToast(`Laporan titik "${newReport.locationName}" berhasil diterbitkan ke koleksi Firestore!`, 'success');
    setActiveReportId(newReport.id);
    setTimeout(() => {
      AOS.refresh();
    }, 200);
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
      showToast('Dukungan suara warga berhasil dicatat! Skor AI Priority Matrix diperbarui.', 'success');
    }
  };

  // Citizen Verification Handler
  const handleCitizenVerify = (reportId) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          return { ...r, citizenConfirmed: true, updatedAt: new Date().toISOString() };
        }
        return r;
      })
    );
    showToast('Terima kasih! Verifikasi kebersihan pantai dari warga telah disematkan secara permanen.', 'success');
  };

  // Admin Update Report Handler
  const handleUpdateReport = (updatedDoc) => {
    setReports((prev) =>
      prev.map((r) => (r.id === updatedDoc.id ? updatedDoc : r))
    );
    showToast(`Status & transparansi anggaran untuk "${updatedDoc.locationName}" berhasil diperbarui.`, 'success');
  };

  const handleSelectReport = (report) => {
    setActiveReportId(report.id);
    const feedElement = document.getElementById('feed-section');
    if (feedElement) {
      feedElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalVotesCount = reports.reduce((acc, r) => acc + (r.votesCount || 0), 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-slate-950">
      
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-24 right-4 z-[9999] max-w-md animate-fade-in pointer-events-none">
          <div className="pointer-events-auto p-4 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-teal-500/40 text-xs shadow-2xl flex items-center gap-3 text-white">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300">
              <CheckCircle size={18} />
            </div>
            <p className="flex-1 leading-snug">{toast.message}</p>
            <button 
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-white font-bold p-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Top Header Navbar */}
      <Navbar currentRoute={currentRoute} onNavigate={handleNavigate} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-16">
        
        {/* ========================================================= */}
        {/* SISI 1: MASYARAKAT / USER (PUBLIC PORTAL - ROUTE '/')     */}
        {/* ========================================================= */}
        {currentRoute === '/' ? (
          <>
            {/* Hero Section */}
            <div id="beranda">
              <HeroSection 
                totalReports={reports.length}
                totalVotes={totalVotesCount}
                onOpenReportForm={() => {
                  const el = document.getElementById('formulir-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                onExploreMap={() => {
                  const el = document.getElementById('peta-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            </div>

            {/* Peta Interaktif Leaflet Section */}
            <section id="peta-section" className="space-y-4" data-aos="fade-up">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 uppercase tracking-wider mb-1">
                    <MapPin size={14} />
                    <span>Pemetaan Geospasial Real-time</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Peta Sebaran Titik Kritis Pencemaran Pesisir
                  </h2>
                </div>
                <p className="text-xs text-slate-400 max-w-md sm:text-right">
                  Marker diwarnai sesuai tingkat urgensi AI. Klik pin untuk memeriksa rincian polutan dan melompat ke laporan warga.
                </p>
              </div>

              {/* Map Container */}
              <BeachMap 
                reports={reports} 
                onSelectReport={handleSelectReport}
                activeReportId={activeReportId}
              />
            </section>

            {/* Feed Laporan Publik & Dukungan Voting */}
            <section id="feed-section" className="space-y-6" data-aos="fade-up">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
                    <FileText size={14} />
                    <span>Feed Laporan Transparan Warga</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Suara Masyarakat & Progres Pembersihan
                  </h2>
                </div>
                <p className="text-xs text-slate-400 max-w-md sm:text-right">
                  Berikan dukungan upvote pada laporan yang mendesak untuk menaikkan peringkatnya pada AI Priority Matrix instansi.
                </p>
              </div>

              <PublicFeed 
                reports={reports}
                onUpvote={handleUpvote}
                onCitizenVerify={handleCitizenVerify}
                onFocusMap={(reportId) => {
                  setActiveReportId(reportId);
                  const el = document.getElementById('peta-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            </section>

            {/* Form Pelaporan Mandiri dengan Groq AI Analyzer */}
            <section id="formulir-section" className="space-y-4" data-aos="fade-up">
              <PublicReportForm onSubmitReport={handleAddReport} />
            </section>

            {/* Hub Transparansi Biaya & Rekanan Vendor */}
            <section id="transparansi-section" className="space-y-4" data-aos="fade-up">
              <TransparencyHub reports={reports} />
            </section>
          </>
        ) : (
          /* ========================================================= */
          /* SISI 2: ADMIN / INSTANSI PEMERINTAH (ROUTE '/admin')       */
          /* ========================================================= */
          <div id="admin-view" className="space-y-8 animate-fade-in">
            <AdminDashboard 
              reports={reports}
              onUpdateReport={handleUpdateReport}
            />
          </div>
        )}

      </main>

      {/* Floating Scroll To Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-[450] p-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black shadow-xl shadow-teal-500/30 transition-all hover:scale-110 active:scale-95"
          title="Kembali ke atas"
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}
