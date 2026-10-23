import React from 'react';
import { Building2 } from 'lucide-react';
import OrcaLogo from './OrcaLogo';

export default function Footer({ onNavigateToAdmin }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
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
    <footer className="w-full bg-[#F8FAFC] border-t border-[#E2E8F0] text-[#64748B] text-xs py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Logo Reforca Orca & Deskripsi */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center shadow-xs">
                <OrcaLogo className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-[#0F172A] tracking-tight block">
                  Reforca
                </span>
                <span className="text-xs text-[#1D4ED8] font-bold">
                  Report For Care: Lingkungan Pesisir
                </span>
              </div>
            </div>

            <p className="text-xs text-[#64748B] leading-relaxed max-w-md">
              Platform civic reporting dan pengawasan akuntabilitas pembersihan lingkungan laut dan pesisir Indonesia. Menggabungkan teknologi kecerdasan buatan, data geospasial presisi, serta transparansi alokasi anggaran penanganan lapangan.
            </p>

            <div className="flex items-center gap-2.5 text-xs text-[#1D4ED8] font-medium pt-1">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
              <span>Sistem Pemantauan Bahari Aktif 24/7</span>
            </div>
          </div>

          {/* Navigasi Cepat */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#0F172A] uppercase tracking-wider text-xs">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2 text-xs text-[#64748B]">
              <li>
                <button 
                  type="button" 
                  onClick={() => scrollTo('beranda')} 
                  className="hover:text-[#1D4ED8] transition-colors"
                >
                  HOME
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => scrollTo('fitur')} 
                  className="hover:text-[#1D4ED8] transition-colors"
                >
                  FITUR
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => scrollTo('laporan-warga')} 
                  className="hover:text-[#1D4ED8] transition-colors"
                >
                  LAPORAN WARGA
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => scrollTo('faq')} 
                  className="hover:text-[#1D4ED8] transition-colors"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => scrollTo('kontak')} 
                  className="hover:text-[#1D4ED8] transition-colors"
                >
                  KONTAK
                </button>
              </li>
            </ul>
          </div>

          {/* Akses Instansi & Media Sosial */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#0F172A] uppercase tracking-wider text-xs">
              Portal & Komunitas
            </h4>
            
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={onNavigateToAdmin}
                className="w-full p-2.5 rounded-xl bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#0F172A] text-xs font-bold transition-all flex items-center justify-between group shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <Building2 size={14} className="text-[#1D4ED8]" />
                  <span>Ruang Komando Instansi</span>
                </span>
                <span className="text-[10px] text-[#1D4ED8] font-bold">/admin</span>
              </button>

              <div className="pt-2 space-y-1.5 text-xs text-[#64748B]">
                <div className="font-semibold text-[#0F172A]">Kanal Informasi:</div>
                <div className="flex items-center gap-3 pt-1">
                  <a href="#beranda" className="hover:text-[#1D4ED8] transition-colors">
                    Instagram
                  </a>
                  <span>•</span>
                  <a href="#beranda" className="hover:text-[#1D4ED8] transition-colors">
                    Twitter / X
                  </a>
                  <span>•</span>
                  <a href="#beranda" className="hover:text-[#1D4ED8] transition-colors">
                    YouTube
                  </a>
                  <span>•</span>
                  <a href="#beranda" className="hover:text-[#1D4ED8] transition-colors">
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Garis Pembatas & Hak Cipta */}
        <div className="pt-6 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <div>
            &copy; {new Date().getFullYear()} Reforca (Report For Care). Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="flex items-center gap-4">
            <a href="#beranda" className="hover:text-[#1D4ED8] transition-colors">
              Kebijakan Privasi
            </a>
            <span>•</span>
            <a href="#beranda" className="hover:text-[#1D4ED8] transition-colors">
              Syarat & Ketentuan
            </a>
            <span>•</span>
            <span className="text-[#1D4ED8] font-semibold">Laut Bersih Untuk Semua</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
