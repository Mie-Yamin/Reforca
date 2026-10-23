import React from 'react';
import { PlusCircle, Eye } from 'lucide-react';

export default function HeroSection({ onOpenReportModal, onScrollToReports }) {
  const scrollToReports = () => {
    if (onScrollToReports) {
      onScrollToReports();
    } else {
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
    }
  };

  return (
    <section 
      id="beranda" 
      className="relative min-h-[85vh] sm:min-h-[88vh] flex items-center overflow-hidden bg-cover bg-center pt-8 pb-16 sm:pb-24"
      style={{
        backgroundImage: `url('/images/coastal_cliff_hero.jpg')`,
      }}
    >
      {/* Subtle Natural Sunlit Daylight Overlay */}
      <div className="absolute inset-0 bg-slate-900/15 pointer-events-none"></div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl text-left" data-aos="fade-up">
          
          {/* Floating Card Melengkung Berwarna Biru Gelap Matte Semi-Transparan (Opacity 85%) */}
          <div 
            className="rounded-[28px] p-7 sm:p-10 lg:p-12 border border-white/15 shadow-2xl space-y-6"
            style={{
              backgroundColor: 'rgba(30, 41, 59, 0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            {/* Tag Kategori Kecil */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#3B82F6]"></span>
              <span>Platform Pengawasan & Aksi Pesisir</span>
            </div>

            {/* Headline Teks Putih, Bold */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.18] font-sans">
              Jaga Ekosistem Pesisir dan Laut Bersama Reforca
            </h1>

            {/* Sub-teks Deskripsi Singkat */}
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              Platform partisipasi publik untuk memantau, mendokumentasikan, dan mempercepat penanganan limbah pantai di seluruh perairan Indonesia bersama instansi berwenang secara transparan.
            </p>

            {/* 2 Tombol Aksi Matte */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              {/* Primary Blue Button */}
              <button
                type="button"
                onClick={onOpenReportModal}
                className="px-6 py-3.5 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <PlusCircle size={17} />
                <span>Laporkan Masalah</span>
              </button>

              {/* Outlined Button */}
              <button
                type="button"
                onClick={scrollToReports}
                className="px-6 py-3.5 rounded-xl border border-white/30 hover:border-white bg-white/10 hover:bg-white/20 text-white font-bold text-sm shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <Eye size={17} />
                <span>Lihat Laporan Warga</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
