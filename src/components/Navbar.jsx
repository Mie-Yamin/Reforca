import React, { useState, useEffect } from 'react';
import { Menu, X, PlusCircle } from 'lucide-react';
import OrcaLogo from './OrcaLogo';

export default function Navbar({ onOpenReportModal }) {
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
    { id: 'laporan-warga', label: 'LAPORAN WARGA' },
    { id: 'faq', label: 'FAQ' },
    { id: 'kontak', label: 'KONTAK' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full pt-3 sm:pt-4 px-4 sm:px-6 lg:px-8 transition-all duration-300 pointer-events-none">
      <div className="max-w-6xl mx-auto pointer-events-auto">
        {/* Floating White Capsule Navbar */}
        <div 
          className={`w-full rounded-full bg-white/95 backdrop-blur-md border border-[#E2E8F0] px-4 sm:px-6 py-2.5 sm:py-3 transition-all duration-300 ${
            isScrolled 
              ? 'shadow-lg shadow-slate-900/10' 
              : 'shadow-md shadow-slate-900/5'
          }`}
        >
          <div className="flex items-center justify-between">
            
            {/* Logo Orca Reforca di sebelah kiri */}
            <button 
              type="button"
              onClick={() => scrollToSection('beranda')}
              className="flex items-center gap-2.5 group text-left focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] rounded-full p-1"
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
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#1D4ED8] border border-[#DBEAFE] uppercase tracking-wider hidden sm:inline-block">
                    Report For Care
                  </span>
                </div>
              </div>
            </button>

            {/* Menu Navigasi Tengah / Kanan (HOME, FITUR, LAPORAN WARGA, FAQ, KONTAK) */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Navigasi Utama">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => scrollToSection(link.id)}
                  className="px-3.5 py-2 rounded-full text-xs font-bold text-[#0F172A] hover:text-[#1D4ED8] hover:bg-[#F8FAFC] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Tombol Buat Laporan Matte Primary Blue */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenReportModal}
                className="px-5 py-2 rounded-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-xs sm:text-sm shadow-sm transition-all hover:shadow hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:ring-offset-2 flex items-center gap-1.5"
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
            <div className="pt-2 border-t border-[#E2E8F0]">
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
