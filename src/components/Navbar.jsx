import React, { useState, useEffect } from 'react';
import { Menu, X, PlusCircle, LogIn, LogOut } from 'lucide-react';
import OrcaLogo from './OrcaLogo';

export default function Navbar({ 
  onOpenReportModal, 
  currentUser, 
  onOpenLoginModal, 
  onLogout 
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

  const navLinks = [
    { id: 'beranda', label: 'HOME' },
    { id: 'fitur', label: 'FITUR' },
    { id: 'peta-laporan', label: 'PETA' },
    { id: 'laporan-warga', label: 'LAPORAN WARGA' },
    { id: 'akuntabilitas', label: 'TRANSPARANSI' },
    { id: 'faq', label: 'FAQ' },
    { id: 'kontak', label: 'KONTAK' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full pt-3 sm:pt-4 px-4 sm:px-6 lg:px-8 transition-all duration-300 pointer-events-none">
      <div className="max-w-7xl mx-auto pointer-events-auto">
        {/* Floating White Capsule Navbar */}
        <div 
          className={`w-full rounded-full bg-white/95 backdrop-blur-md border border-[#E2E8F0] px-4 sm:px-6 py-2.5 sm:py-3 transition-all duration-300 ${
            isScrolled 
              ? 'shadow-lg shadow-slate-900/10' 
              : 'shadow-md shadow-slate-900/5'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            
            {/* Logo Orca Reforca di sebelah kiri */}
            <button 
              type="button"
              onClick={() => scrollToSection('beranda')}
              className="flex items-center gap-2.5 group text-left focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] rounded-full p-1 shrink-0"
              aria-label="Reforca Beranda"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
                <OrcaLogo className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg sm:text-xl font-extrabold tracking-tight text-[#0F172A] font-sans">
                    Reforca
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#1D4ED8] border border-[#DBEAFE] uppercase tracking-wider hidden lg:inline-block">
                    Report For Care
                  </span>
                </div>
              </div>
            </button>

            {/* Menu Navigasi Tengah (HOME, FITUR, PETA, LAPORAN WARGA, TRANSPARANSI, FAQ, KONTAK) */}
            <nav className="hidden xl:flex items-center gap-1" aria-label="Navigasi Utama">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => scrollToSection(link.id)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold text-[#0F172A] hover:text-[#1D4ED8] hover:bg-[#F8FAFC] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Navigasi Compact untuk layar Medium (md s/d lg) */}
            <nav className="hidden md:flex xl:hidden items-center gap-1" aria-label="Navigasi Utama Ringkas">
              {navLinks.slice(0, 5).map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => scrollToSection(link.id)}
                  className="px-2.5 py-1.5 rounded-full text-[11px] font-bold text-[#0F172A] hover:text-[#1D4ED8] hover:bg-[#F8FAFC] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Tombol Masuk Akun / Profil & Buat Laporan */}
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              {currentUser ? (
                <div className="flex items-center gap-1.5 p-1 pl-2 pr-1 rounded-full bg-[#F8FAFC] border border-[#CBD5E1]">
                  <div className="w-6 h-6 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center font-bold text-[10px]">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-bold text-[#0F172A] max-w-[110px] truncate" title={currentUser.name}>
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] uppercase">
                    Warga
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
                  className="px-3.5 py-2 rounded-full text-[#1D4ED8] hover:bg-[#EFF6FF] border border-[#DBEAFE] font-bold text-xs transition-all flex items-center gap-1.5"
                >
                  <LogIn size={14} />
                  <span>Masuk</span>
                </button>
              )}

              <button
                type="button"
                onClick={onOpenReportModal}
                className="px-4 sm:px-5 py-2 rounded-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-xs sm:text-sm shadow-sm transition-all hover:shadow hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:ring-offset-2 flex items-center gap-1.5"
              >
                <PlusCircle size={15} />
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

        {/* Mobile Drawer Menu (Clean White Pill Card) */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 rounded-2xl border border-[#E2E8F0] bg-white/95 backdrop-blur-xl p-4 shadow-xl space-y-2 animate-fade-in">
            {currentUser && (
              <div className="p-3 mb-2 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <span className="font-bold text-[#0F172A] block">{currentUser.name}</span>
                    <span className="text-[10px] text-[#1D4ED8] font-semibold uppercase">
                      Warga Pelapor Bahari
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
                className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-[#0F172A] hover:text-[#1D4ED8] hover:bg-[#F8FAFC] transition-colors"
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
                  <span>Masuk / Daftar Akun</span>
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
                <PlusCircle size={16} />
                <span>Buat Laporan</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
