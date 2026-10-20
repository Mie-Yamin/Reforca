import React, { useState } from 'react';
import { 
  Waves, 
  MapPin, 
  FileText, 
  PlusCircle, 
  ShieldAlert, 
  DollarSign, 
  Menu, 
  X, 
  Users, 
  Building2,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function Navbar({ currentRoute, onNavigate }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (route, targetId = null) => {
    onNavigate(route);
    setIsMobileMenuOpen(false);

    if (targetId && route === '/') {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <header className="sticky top-0 z-[500] w-full bg-slate-950/85 backdrop-blur-xl border-b border-teal-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Platform Name */}
          <div 
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-400 via-cyan-500 to-emerald-500 flex items-center justify-center text-slate-950 shadow-glow-teal transition-transform group-hover:scale-105">
              <Waves size={24} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white font-sans">
                  Reforca
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 uppercase tracking-widest hidden sm:inline-block">
                  MIA CIVIC
                </span>
              </div>
              <p className="text-[11px] text-cyan-300/80 font-medium">Report For Care — Lingkungan Pesisir</p>
            </div>
          </div>

          {/* Center Navigation Links (Public Portal) */}
          {currentRoute === '/' && (
            <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800">
              <button 
                onClick={() => handleNavClick('/', 'peta-section')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-300 hover:bg-slate-800/80 transition-all flex items-center gap-1.5"
              >
                <MapPin size={13} className="text-teal-400" />
                <span>Peta Interaktif</span>
              </button>
              <button 
                onClick={() => handleNavClick('/', 'feed-section')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-300 hover:bg-slate-800/80 transition-all flex items-center gap-1.5"
              >
                <FileText size={13} className="text-cyan-400" />
                <span>Laporan Warga</span>
              </button>
              <button 
                onClick={() => handleNavClick('/', 'formulir-section')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-300 hover:bg-slate-800/80 transition-all flex items-center gap-1.5"
              >
                <PlusCircle size={13} className="text-emerald-400" />
                <span>Buat Laporan</span>
              </button>
              <button 
                onClick={() => handleNavClick('/', 'transparansi-section')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-300 hover:bg-slate-800/80 transition-all flex items-center gap-1.5"
              >
                <DollarSign size={13} className="text-teal-300" />
                <span>Hub Transparansi</span>
              </button>
            </nav>
          )}

          {/* Two-Sided Portal Switcher (Special Route Toggle) */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-1 rounded-2xl border border-slate-700/80 flex items-center gap-1 shadow-inner">
              <button
                onClick={() => handleNavClick('/')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  currentRoute === '/'
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users size={14} />
                <span className="hidden sm:inline">Masyarakat (Warga)</span>
                <span className="sm:hidden">Warga</span>
              </button>

              <button
                onClick={() => handleNavClick('/admin')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  currentRoute === '/admin'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-cyan-300'
                }`}
              >
                <Building2 size={14} />
                <span className="hidden sm:inline">Admin Instansi (`/admin`)</span>
                <span className="sm:hidden">Admin</span>
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 border-b border-teal-500/20 px-4 pt-3 pb-6 space-y-2 backdrop-blur-2xl">
          <button
            onClick={() => handleNavClick('/', 'peta-section')}
            className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-900 flex items-center gap-2"
          >
            <MapPin size={16} className="text-teal-400" />
            <span>Peta Interaktif Sebaran Pantai</span>
          </button>
          <button
            onClick={() => handleNavClick('/', 'feed-section')}
            className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-900 flex items-center gap-2"
          >
            <FileText size={16} className="text-cyan-400" />
            <span>Feed Laporan & Voting Warga</span>
          </button>
          <button
            onClick={() => handleNavClick('/', 'formulir-section')}
            className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-900 flex items-center gap-2"
          >
            <PlusCircle size={16} className="text-emerald-400" />
            <span>Form Pelaporan + Groq AI Analyzer</span>
          </button>
          <button
            onClick={() => handleNavClick('/', 'transparansi-section')}
            className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-900 flex items-center gap-2"
          >
            <DollarSign size={16} className="text-teal-300" />
            <span>Hub Transparansi Anggaran & Rekanan</span>
          </button>
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => handleNavClick('/admin')}
              className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-2"
            >
              <ShieldAlert size={16} />
              <span>Buka Ruang Komando Instansi / Admin</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
