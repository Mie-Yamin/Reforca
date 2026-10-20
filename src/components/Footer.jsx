import React from 'react';
import { Waves, Heart, Shield, ExternalLink, MapPin, Phone, Mail, Award } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="mt-24 border-t border-slate-800 bg-slate-950/90 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand & Proposal context */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-slate-950 font-black">
                <Waves size={18} />
              </div>
              <span className="text-base font-extrabold text-white tracking-tight">
                Reforca (Report For Care)
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Platform Civic Reporting and Accountability yang dirancang untuk mengawal keberlanjutan dan kebersihan ekosistem pesisir serta laut Indonesia, dikembangkan dalam kerangka proposal <strong>Multimedia In Action (MIA)</strong>.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-teal-400">
              <Award size={14} />
              <span>Inisiatif Digital Lingkungan Pesisir & Kelautan Teluk Jakarta</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">Navigasi Portal</h5>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onNavigate('/')} className="hover:text-cyan-300 transition-colors">
                  Peta Sebaran Titik Kritis
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/')} className="hover:text-cyan-300 transition-colors">
                  Feed Laporan Warga & Upvoting
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/')} className="hover:text-cyan-300 transition-colors">
                  Hub Transparansi Anggaran & Rekanan
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/admin')} className="text-cyan-400 hover:text-cyan-200 font-semibold flex items-center gap-1">
                  <span>Portal Admin Instansi (`/admin`)</span>
                  <ExternalLink size={10} />
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency & Gov Contacts */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">Kontak Respons Darurat</h5>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex items-center gap-2">
                <Phone size={13} className="text-teal-400" />
                <span>Call Center LH DKI: 112 / (021) 8092744</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={13} className="text-cyan-400" />
                <span>pengaduan@reforca-pesisir.id</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={13} className="text-emerald-400" />
                <span>Pos Pantau Teluk Jakarta & P. Pari</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Credits & Tech Stack */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p className="text-slate-500">
            © {new Date().getFullYear()} Reforca. Dilindungi di bawah lisensi inisiatif keterbukaan data publik.
          </p>

          <div className="flex flex-wrap items-center gap-2 text-slate-400">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]">React 19 + Vite</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]">Tailwind CSS</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]">Leaflet.js</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]">AOS Animation</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]">Groq AI Simulator</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]">Google Cloud Firestore Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
