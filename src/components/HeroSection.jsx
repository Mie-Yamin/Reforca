import React from 'react';
import { 
  Waves, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Cpu,
  Users
} from 'lucide-react';

export default function HeroSection({ onOpenReportForm, onExploreMap, totalReports, totalVotes }) {
  return (
    <section className="relative pt-8 pb-14 overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-teal-500/15 via-cyan-500/10 to-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative max-w-5xl mx-auto text-center space-y-6">
        
        {/* Top Floating Badge */}
        <div 
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-teal-500/30 text-teal-300 text-xs font-semibold shadow-lg backdrop-blur-md"
          data-aos="fade-down"
        >
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
          <span>Platform Civic Reporting & Akuntabilitas Pesisir Jakarta</span>
          <span className="text-slate-500">•</span>
          <span className="text-cyan-300 font-bold">MIA Proposal Ready</span>
        </div>

        {/* Main Headline */}
        <h1 
          className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15]"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Kawal Kebersihan Pantai Kita <br className="hidden sm:inline" />
          dengan <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Data Terbuka & AI</span>
        </h1>

        {/* Subtitle */}
        <p 
          className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <strong>Reforca (Report For Care)</strong> menjembatani warga dan instansi pemerintah dalam memberantas polusi sampah pesisir Teluk Jakarta & Kepulauan Seribu. Didukung analisis visi cerdas Llama-3, transparansi anggaran audit terbuka, dan verifikasi lapangan langsung masyarakat.
        </p>

        {/* Action Buttons */}
        <div 
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <button
            onClick={onOpenReportForm}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-black text-sm shadow-xl shadow-teal-500/25 flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles size={18} />
            <span>Laporkan Titik Sampah Sekarang</span>
          </button>

          <button
            onClick={onExploreMap}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-cyan-300 border border-teal-500/30 hover:border-cyan-400 font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <MapPin size={18} className="text-teal-400" />
            <span>Jelajahi Peta Sebaran</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Quick Highlights / Metrics Pill */}
        <div 
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 max-w-4xl mx-auto text-left"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur">
            <div className="flex items-center gap-1.5 text-teal-400 text-xs font-semibold">
              <Cpu size={14} />
              <span>Groq AI Inference</span>
            </div>
            <div className="text-lg font-black text-white mt-1">Llama 3 70B</div>
            <div className="text-[11px] text-slate-400">Deteksi polutan otomatis</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur">
            <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-semibold">
              <MapPin size={14} />
              <span>Titik Terpetakan</span>
            </div>
            <div className="text-lg font-black text-white mt-1">{totalReports} Pantai Kritis</div>
            <div className="text-[11px] text-slate-400">Muara Angke s/d Pari</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur">
            <div className="flex items-center gap-1.5 text-rose-400 text-xs font-semibold">
              <Users size={14} />
              <span>Dukungan Suara</span>
            </div>
            <div className="text-lg font-black text-white mt-1">{totalVotes}+ Upvote Warga</div>
            <div className="text-[11px] text-slate-400">Prioritas intervensi nyata</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
              <ShieldCheck size={14} />
              <span>Akuntabilitas</span>
            </div>
            <div className="text-lg font-black text-white mt-1">100% Transparan</div>
            <div className="text-[11px] text-slate-400">BaaS Firestore & Open Data</div>
          </div>
        </div>

      </div>
    </section>
  );
}
