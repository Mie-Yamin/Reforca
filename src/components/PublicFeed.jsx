import React, { useState } from 'react';
import { 
  Heart, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  ShieldCheck, 
  ExternalLink, 
  Filter, 
  DollarSign, 
  Briefcase, 
  SlidersHorizontal,
  ChevronDown,
  Layers,
  Sparkles,
  Award
} from 'lucide-react';
import { formatRupiah, formatRelativeDate } from '../data/mockFirestore';

export default function PublicFeed({ 
  reports, 
  onUpvote, 
  onCitizenVerify, 
  onFocusMap 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [votedMap, setVotedMap] = useState({});
  const [activeImageTab, setActiveImageTab] = useState({}); // { [reportId]: 'before' | 'after' }

  const handleVoteClick = (reportId) => {
    const isAlreadyVoted = !!votedMap[reportId];
    setVotedMap(prev => ({ ...prev, [reportId]: !isAlreadyVoted }));
    onUpvote(reportId, !isAlreadyVoted);
  };

  const toggleImageTab = (reportId, view) => {
    setActiveImageTab(prev => ({ ...prev, [reportId]: view }));
  };

  // Filter reports
  const filteredReports = reports.filter(r => {
    const matchSearch = r.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reporterName.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchSearch) return false;

    if (activeTab === 'DARURAT') return r.aiAnalysis?.severity === 'Darurat';
    if (activeTab === 'IN_PROGRESS') return r.status === 'In Progress';
    if (activeTab === 'COMPLETED') return r.status === 'Completed';
    if (activeTab === 'VERIFIED') return r.citizenConfirmed;
    return true;
  });

  return (
    <div className="space-y-6" data-aos="fade-up">
      {/* Search and Tabs Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-teal-500/20">
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {[
            { id: 'ALL', label: 'Semua Laporan' },
            { id: 'DARURAT', label: '🚨 Butuh Aksi Darurat' },
            { id: 'IN_PROGRESS', label: '⏳ Sedang Dikerjakan' },
            { id: 'COMPLETED', label: '✨ Selesai Dibersihkan' },
            { id: 'VERIFIED', label: '🛡️ Terverifikasi Warga' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px] md:max-w-xs">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari pantai, wilayah, pelapor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700 focus:border-teal-400 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none transition-colors"
          />
        </div>
      </div>

      {/* Reports Count Info */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-2">
        <span>Menampilkan <strong className="text-teal-300">{filteredReports.length}</strong> titik laporan masyarakat</span>
        <span>Diurutkan berdasarkan waktu & aktivitas dukungan</span>
      </div>

      {/* Grid of Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReports.map((report) => {
          const isDarurat = report.aiAnalysis?.severity === 'Darurat';
          const isTinggi = report.aiAnalysis?.severity === 'Tinggi';
          const isSedang = report.aiAnalysis?.severity === 'Sedang';
          const isVoted = !!votedMap[report.id];
          const currentImageView = activeImageTab[report.id] || (report.photoAfter ? 'after' : 'before');

          return (
            <div 
              key={report.id}
              className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-800 hover:border-teal-500/40 transition-all duration-300"
            >
              {/* Card Image Header with Before / After Tabs if Completed */}
              <div className="relative h-56 w-full bg-slate-900 overflow-hidden">
                <img
                  src={currentImageView === 'after' && report.photoAfter ? report.photoAfter : report.photoBefore}
                  alt={report.locationName}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                  {/* Severity Badge */}
                  <span className={`pointer-events-auto text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg backdrop-blur ${
                    isDarurat ? 'bg-rose-600/90 text-white shadow-glow-rose' :
                    isTinggi ? 'bg-amber-500/90 text-slate-950 font-extrabold' :
                    isSedang ? 'bg-cyan-500/90 text-slate-950 font-extrabold' :
                    'bg-emerald-500/90 text-slate-950 font-extrabold'
                  }`}>
                    <AlertTriangle size={12} />
                    <span>{report.aiAnalysis?.severity}</span>
                  </span>

                  {/* Status Badge */}
                  <span className={`pointer-events-auto text-[11px] font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur flex items-center gap-1.5 ${
                    report.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                    report.status === 'In Progress' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {report.status === 'Completed' && <CheckCircle2 size={12} />}
                    {report.status === 'In Progress' && <Clock size={12} className="animate-spin-slow" />}
                    <span>{report.status}</span>
                  </span>
                </div>

                {/* Before / After toggle for completed reports */}
                {report.photoAfter && (
                  <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 bg-slate-950/80 backdrop-blur-md p-1 rounded-xl border border-slate-700">
                    <button
                      onClick={() => toggleImageTab(report.id, 'before')}
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-lg transition-all ${
                        currentImageView === 'before'
                          ? 'bg-rose-500 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Kondisi Kotor (Before)
                    </button>
                    <button
                      onClick={() => toggleImageTab(report.id, 'after')}
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-lg transition-all ${
                        currentImageView === 'after'
                          ? 'bg-emerald-500 text-slate-950'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Sudah Bersih (After) ✨
                    </button>
                  </div>
                )}

                {/* Map Quick jump button */}
                <button
                  onClick={() => onFocusMap && onFocusMap(report.id)}
                  title="Lihat Titik di Peta Interaktif"
                  className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-xl bg-slate-950/80 hover:bg-teal-500 hover:text-slate-950 text-cyan-300 text-[11px] font-semibold backdrop-blur border border-cyan-500/30 flex items-center gap-1 transition-all"
                >
                  <MapPin size={12} />
                  <span>Lihat Peta</span>
                </button>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
                    <span className="text-teal-400 font-medium">{report.reporterName}</span>
                    <span>•</span>
                    <span>{formatRelativeDate(report.createdAt)}</span>
                  </div>

                  <h4 className="text-lg font-bold text-white leading-snug hover:text-cyan-300 transition-colors">
                    {report.locationName}
                  </h4>

                  <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                    {report.description}
                  </p>

                  {/* AI Analysis Tags */}
                  <div className="mt-3.5 pt-3 border-t border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Sparkles size={12} className="text-cyan-400" />
                        AI Analysis (Llama 3):
                      </span>
                      <span className="text-slate-300 font-medium">Est. {report.aiAnalysis?.estimatedVolumeM2 || 0} m²</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {report.aiAnalysis?.wasteType?.map((w, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-teal-300 border border-teal-500/20 font-medium">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Vendor & Transparency Brief */}
                  {report.assignedVendor && report.assignedVendor !== 'Belum Ditugaskan' && (
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] space-y-1">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="flex items-center gap-1 font-medium">
                          <Briefcase size={12} className="text-teal-400" />
                          Pelaksana:
                        </span>
                        <span className="text-slate-200 font-semibold">{report.assignedVendor}</span>
                      </div>
                      {report.costDetails?.totalCost > 0 && (
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="flex items-center gap-1 font-medium">
                            <DollarSign size={12} className="text-emerald-400" />
                            Biaya Transparan:
                          </span>
                          <span className="text-emerald-300 font-bold">{formatRupiah(report.costDetails.totalCost)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Citizen Verification & Upvote Footer */}
                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  
                  {/* Upvote Button ("Dukung Laporan Ini") */}
                  <button
                    onClick={() => handleVoteClick(report.id)}
                    className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      isVoted
                        ? 'bg-rose-500 text-white shadow-glow-rose scale-105'
                        : 'bg-slate-900 hover:bg-rose-500/20 text-slate-200 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40'
                    }`}
                  >
                    <Heart size={14} className={isVoted ? 'fill-current text-white' : 'text-rose-400'} />
                    <span>{isVoted ? 'Didukung' : 'Dukung Laporan Ini'}</span>
                    <span className="px-1.5 py-0.2 rounded-md bg-slate-950/40 text-[11px] font-mono">
                      {report.votesCount}
                    </span>
                  </button>

                  {/* Citizen Verification Action / Badge */}
                  {report.status === 'Completed' ? (
                    report.citizenConfirmed ? (
                      <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold">
                        <ShieldCheck size={14} className="text-emerald-400" />
                        <span>Telah Diverifikasi Bersih oleh Warga</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => onCitizenVerify(report.id)}
                        className="px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                      >
                        <Award size={14} />
                        <span>Konfirmasi Selesai (Warga)</span>
                      </button>
                    )
                  ) : (
                    <span className="text-[11px] text-slate-500 italic text-center sm:text-right">
                      Verifikasi aktif setelah penanganan selesai
                    </span>
                  )}

                </div>
              </div>

            </div>
          );
        })}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12 glass-panel rounded-2xl border border-slate-800">
          <p className="text-sm text-slate-400">Tidak ada laporan yang cocok dengan filter atau kata kunci pencarian.</p>
        </div>
      )}
    </div>
  );
}
