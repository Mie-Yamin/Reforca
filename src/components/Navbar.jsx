import React, { useState, useEffect } from 'react';
import { Menu, X, Plus, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import OrcaLogo from './OrcaLogo';

export default function Navbar({
  onOpenReportModal,
  currentUser,
  adminUser,
  onOpenLoginModal,
  onLogout,
  onNavigate,
  currentRoute = '/'
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const scrollToSection = (sectionId) => {
    setIsMobileMenuOpen(false);
    if (currentRoute !== '/') {
      if (onNavigate) onNavigate('/');
      setTimeout(() => {
        if (sectionId === 'beranda') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        const element = document.getElementById(sectionId);
        if (element) {
          const navOffset = 90;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
      return;
    }
    if (sectionId === 'beranda') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      const navOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Navigasi clean dalam uppercase tebal: HOME, FITUR, LAPORAN WARGA, FAQ, KONTAK
  const navLinks = [
    { id: 'beranda', label: 'HOME' },
    { id: 'fitur', label: 'FITUR' },
    { id: 'laporan-warga', label: 'LAPORAN WARGA' },
    { id: 'faq', label: 'FAQ' },
    { id: 'kontak', label: 'KONTAK' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full pt-3 sm:pt-4 px-4 sm:px-6 lg:px-8 transition-all duration-300 pointer-events-none">
      <div className="max-w-7xl mx-auto pointer-events-auto">
        {/* Floating Header Navbar: Container Pill Putih Bersih di atas Gambar Latar */}
        <div
          className={`w-full rounded-full bg-white border border-[#E2E8F0] px-4 sm:px-6 py-2 sm:py-2.5 transition-all duration-300 ${isScrolled
              ? 'shadow-lg shadow-slate-900/10'
              : 'shadow-md shadow-slate-900/5'
            }`}
        >
          <div className="flex items-center justify-between gap-4">

            {/* Left: Reforca official Orca logo (from src/assets/reforca-logo.png) */}
            <button 
              type="button"
              onClick={() => scrollToSection('beranda')}
              className="flex items-center gap-2 group text-left focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] rounded-xl p-0.5 shrink-0"
              aria-label="Reforca Beranda"
            >
              <OrcaLogo className="h-11 sm:h-12 md:h-14 w-auto object-contain group-hover:scale-105 transition-transform" />
            </button>

            {/* Center: Clean navigation links in bold dark uppercase: HOME, FITUR, LAPORAN WARGA, FAQ, KONTAK */}
            <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2" aria-label="Navigasi Utama">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => scrollToSection(link.id)}
                  className="px-3.5 py-1.5 rounded-full text-xs xl:text-[13px] font-bold tracking-wider text-[#0F172A] hover:text-[#1D4ED8] hover:bg-[#F8FAFC] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] uppercase"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Navigasi Compact untuk layar Tablet (md s/d lg) */}
            <nav className="hidden md:flex lg:hidden items-center gap-1" aria-label="Navigasi Utama Ringkas">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => scrollToSection(link.id)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider text-[#0F172A] hover:text-[#1D4ED8] hover:bg-[#F8FAFC] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] uppercase"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Right: Pill-shaped action button + Buat Laporan in solid ocean blue (#1D4ED8) */}
            <div className="hidden sm:flex items-center gap-2.5 shrink-0">
              {currentUser ? (
                <div className="flex items-center gap-1.5 p-1 pl-2.5 pr-1.5 rounded-full bg-[#F8FAFC] border border-[#CBD5E1]">
                  <div className="w-6 h-6 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center font-bold text-[10px]">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'W'}
                  </div>
                  <span className="text-xs font-bold text-[#0F172A] max-w-[90px] truncate" title={currentUser.name}>
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="p-1 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-0.5"
                    title="Keluar dari akun"
                  >
                    <LogOut size={13} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onOpenLoginModal}
                  className="px-3 py-1.5 rounded-full text-[#1D4ED8] hover:bg-[#EFF6FF] border border-[#DBEAFE] font-bold text-xs transition-all flex items-center gap-1.5"
                >
                  <LogIn size={13} />
                  <span>Masuk</span>
                </button>
              )}

              {/* Admin Portal Button */}
              {adminUser ? (
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('/admin')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                    currentRoute === '/admin'
                      ? 'bg-cyan-500/20 text-cyan-800 border border-cyan-400'
                      : 'bg-slate-100 hover:bg-cyan-50 text-slate-700 hover:text-cyan-700 border border-slate-200'
                  }`}
                  title="Akses Ruang Komando Dinas Lingkungan Hidup"
                >
                  <ShieldCheck size={14} className="text-cyan-600" />
                  <span className="hidden xl:inline">Ruang Komando</span>
                </button>
              ) : null}

              {/* Pill-shaped primary action button: + Buat Laporan */}
              <button
                type="button"
                onClick={onOpenReportModal}
                className="px-5 py-2 sm:py-2.5 rounded-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-xs sm:text-sm shadow-sm transition-all hover:shadow hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:ring-offset-2 flex items-center gap-1.5 shrink-0"
              >
                <Plus size={16} className="stroke-[2.5]" />
                <span>Buat Laporan</span>
              </button>
            </div>

            {/* Tombol Hamburger Mobile */}
            <div className="flex md:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] hover:text-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                aria-label={isMobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 rounded-2xl border border-[#E2E8F0] bg-white/95 backdrop-blur-xl p-4 shadow-xl space-y-2 animate-fade-in">
            {currentUser && (
              <div className="p-3 mb-2 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'W'}
                  </div>
                  <div>
                    <span className="font-bold text-[#0F172A] block">{currentUser.name}</span>
                    <span className="text-[10px] text-[#1D4ED8] font-semibold uppercase">
                      Warga Pelapor
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="px-2.5 py-1 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold flex items-center gap-1"
                >
                  <LogOut size={12} />
                  <span>Keluar</span>
                </button>
              </div>
            )}

            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollToSection(link.id)}
                className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-[#0F172A] hover:text-[#1D4ED8] hover:bg-[#F8FAFC] transition-colors uppercase tracking-wider"
              >
                {link.label}
              </button>
            ))}

            <div className="pt-2 border-t border-[#E2E8F0] space-y-2">
              {!currentUser && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onOpenLoginModal) onOpenLoginModal();
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] font-bold text-xs shadow-xs flex items-center justify-center gap-2"
                >
                  <LogIn size={15} />
                  <span>Masuk Akun</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onOpenReportModal) onOpenReportModal();
                }}
                className="w-full py-2.5 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2"
              >
                <Plus size={16} className="stroke-[2.5]" />
                <span>Buat Laporan</span>
              </button>

              {/* Tautan Portal Admin di Mobile */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onNavigate) onNavigate('/admin');
                }}
                className={`w-full py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                  adminUser
                    ? 'bg-cyan-50 text-cyan-800 border-cyan-200'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                <ShieldCheck size={15} className="text-cyan-600" />
                <span>{adminUser ? 'Ruang Komando (DLH)' : 'Portal Admin Kedinasan'}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
