import React, { useState, useEffect } from 'react';
import { 
  ThumbsUp, 
  MessageSquare, 
  MapPin, 
  Calendar, 
  X, 
  Send, 
  User, 
  Sparkles, 
  Building2, 
  ChevronRight
} from 'lucide-react';
import { formatRelativeDate, formatRupiah } from '../data/mockFirestore';

export default function CitizenReportsSection({ reports, onUpvote }) {
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'TUNTAS' | 'PERBAIKAN'
  const [activePhotoTab, setActivePhotoTab] = useState('before'); // 'before' | 'after'
  const [commentsState, setCommentsState] = useState({
    reforca_doc_001: [
      { id: 'c1', name: 'Rian Saputra', text: 'Semoga segera tuntas. Nelayan muara sangat membutuhkan akses alur perahu yang bersih.', time: '2 hari lalu' },
      { id: 'c2', name: 'Dewi Lestari', text: 'Salut untuk tim relawan yang terjun langsung ke sela mangrove!', time: '1 hari lalu' }
    ],
    reforca_doc_003: [
      { id: 'c3', name: 'Siti Nurhaliza', text: 'Pantai Pasir Perawan sudah sangat bersih sekarang, terima kasih respon cepatnya!', time: '3 hari lalu' },
      { id: 'c4', name: 'Agus Purnomo', text: 'Sebelum dan sesudahnya sangat kontras. Mari jaga bersama jangan buang sampah lagi.', time: '2 hari lalu' }
    ],
    reforca_doc_004: [
      { id: 'c5', name: 'Budi Santoso', text: 'Bebatuan pemecah ombak memang sering jadi perangkap sachet. Perlu tempat sampah lebih banyak di dekat dermaga.', time: '3 hari lalu' }
    ]
  });

  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [votedReports, setVotedReports] = useState({});

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedReport(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleVote = (e, reportId) => {
    e.stopPropagation();
    const isVoted = !votedReports[reportId];
    setVotedReports((prev) => ({ ...prev, [reportId]: isVoted }));
    if (onUpvote) {
      onUpvote(reportId, isVoted);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!selectedReport || !newCommentText.trim()) return;

    const author = newCommentName.trim() || 'Warga Pesisir';
    const newEntry = {
      id: `c_${Date.now()}`,
      name: author,
      text: newCommentText.trim(),
      time: 'Baru saja'
    };

    setCommentsState((prev) => ({
      ...prev,
      [selectedReport.id]: [...(prev[selectedReport.id] || []), newEntry]
    }));

    setNewCommentText('');
  };

  // Status Matte: Hijau Lembut (#16A34A) untuk 'Tuntas' dan Amber Lembut (#D97706) untuk 'Masa Perbaikan'
  const getNormalizedStatus = (report) => {
    if (report.status === 'Completed' || report.citizenConfirmed) {
      return {
        label: 'Tuntas',
        type: 'tuntas',
        bgColor: 'bg-[#DCFCE7]',
        textColor: 'text-[#16A34A]',
        borderColor: 'border-[#BBF7D0]',
        dotColor: 'bg-[#16A34A]'
      };
    }
    return {
      label: 'Masa Perbaikan',
      type: 'perbaikan',
      bgColor: 'bg-[#FEF3C7]',
      textColor: 'text-[#D97706]',
      borderColor: 'border-[#FDE68A]',
      dotColor: 'bg-[#D97706]'
    };
  };

  const filteredReports = reports.filter((r) => {
    const statusObj = getNormalizedStatus(r);
    if (filterStatus === 'TUNTAS') return statusObj.type === 'tuntas';
    if (filterStatus === 'PERBAIKAN') return statusObj.type === 'perbaikan';
    return true;
  });

  return (
    <section 
      id="laporan-warga" 
      className="relative py-20 lg:py-28 bg-[#F8FAFC] border-b border-[#E2E8F0] overflow-hidden"
    >
      {/* Subtle Coastal Fine Sand / Shore Texture (Low-opacity 4% blended with #F8FAFC) */}
      <div 
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-[0.04] mix-blend-multiply"
        style={{
          backgroundImage: `url('/images/coastal_cliff_hero.jpg')`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6" data-aos="fade-up">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] text-[#1D4ED8] text-xs font-bold uppercase tracking-wider">
              Dokumentasi Publik
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Laporan Warga Pesisir
            </h2>
            <p className="text-[#64748B] text-sm sm:text-base leading-relaxed">
              Koleksi dokumentasi kondisi pantai terkini yang dikirim oleh masyarakat pesisir. Setiap laporan diverifikasi AI dan dipantau hingga pembersihan tuntas.
            </p>
          </div>

          {/* Filter Status Buttons Matte Light */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm">
            <button
              type="button"
              onClick={() => setFilterStatus('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterStatus === 'ALL'
                  ? 'bg-[#1D4ED8] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Semua ({reports.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('TUNTAS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filterStatus === 'TUNTAS'
                  ? 'bg-[#16A34A] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#16A34A]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${filterStatus === 'TUNTAS' ? 'bg-white' : 'bg-[#16A34A]'}`}></span>
              <span>Tuntas</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('PERBAIKAN')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filterStatus === 'PERBAIKAN'
                  ? 'bg-[#D97706] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#D97706]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${filterStatus === 'PERBAIKAN' ? 'bg-white' : 'bg-[#D97706]'}`}></span>
              <span>Masa Perbaikan</span>
            </button>
          </div>
        </div>

        {/* News Card Grid Layout: Clean White Elements (#FFFFFF) with shadow-sm */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" data-aos="fade-up" data-aos-delay="100">
          {filteredReports.map((report) => {
            const status = getNormalizedStatus(report);
            const commentsCount = (commentsState[report.id] || []).length;
            const isVoted = !!votedReports[report.id];
            const displayVotes = (report.votesCount || 0) + (isVoted ? 1 : 0);

            return (
              <article
                key={report.id}
                onClick={() => {
                  setSelectedReport(report);
                  setActivePhotoTab('before');
                }}
                className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Bagian Atas: Foto Kondisi Pesisir & Badge Status */}
                <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100">
                  <img
                    src={report.photoBefore}
                    alt={report.locationName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>

                  {/* Badge Status Matte */}
                  <div className="absolute top-3.5 right-3.5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border shadow-xs flex items-center gap-1.5 ${status.bgColor} ${status.textColor} ${status.borderColor}`}>
                      <span className={`w-2 h-2 rounded-full ${status.dotColor}`}></span>
                      <span>{status.label}</span>
                    </span>
                  </div>

                  {/* Lokasi Pesisir Tag */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center gap-1.5 text-xs text-white font-medium bg-slate-900/75 backdrop-blur-xs px-2.5 py-1 rounded-lg w-fit">
                    <MapPin size={13} className="text-[#60A5FA] shrink-0" />
                    <span className="truncate">{report.locationName.split('(')[0]}</span>
                  </div>
                </div>

                {/* Konten Berita / Editorial */}
                <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    {/* Tanggal & Pelapor */}
                    <div className="flex items-center gap-2 text-xs text-[#64748B]">
                      <Calendar size={13} className="text-[#1D4ED8]" />
                      <span>{formatRelativeDate(report.createdAt)}</span>
                      <span>•</span>
                      <span className="font-medium text-[#334155]">{report.reporterName}</span>
                    </div>

                    {/* Judul Laporan */}
                    <h3 className="text-base sm:text-lg font-bold text-[#0F172A] group-hover:text-[#1D4ED8] transition-colors line-clamp-2">
                      {report.locationName}
                    </h3>

                    {/* Deskripsi Singkat */}
                    <p className="text-xs sm:text-sm text-[#475569] line-clamp-2 leading-relaxed">
                      {report.description}
                    </p>
                  </div>

                  {/* Bagian Bawah: Indikator Interaktif (Vote & Komentar) */}
                  <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* Tombol Vote / Dukungan */}
                      <button
                        type="button"
                        onClick={(e) => handleVote(e, report.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isVoted
                            ? 'bg-[#1D4ED8] text-white shadow-xs'
                            : 'bg-[#F8FAFC] text-[#334155] hover:bg-[#F1F5F9] border border-[#E2E8F0]'
                        }`}
                        title="Dukung penanganan laporan ini"
                      >
                        <ThumbsUp size={13} className={isVoted ? 'fill-current' : ''} />
                        <span>{displayVotes}</span>
                      </button>

                      {/* Jumlah Komentar */}
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8FAFC] text-[#64748B] text-xs font-medium border border-[#E2E8F0]">
                        <MessageSquare size={13} className="text-[#1D4ED8]" />
                        <span>{commentsCount}</span>
                      </div>
                    </div>

                    {/* Tombol Detail */}
                    <span className="text-xs font-bold text-[#1D4ED8] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Detail</span>
                      <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

      </div>

      {/* Pop-up Modal Preview Detail Laporan Warga (Clean White Card) */}
      {selectedReport && (
        <div 
          className="fixed inset-0 z-[600] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setSelectedReport(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-report-title"
        >
          <div 
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-[#E2E8F0] shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="sticky top-0 z-20 flex items-center justify-between p-5 sm:p-6 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2.5">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getNormalizedStatus(selectedReport).bgColor} ${getNormalizedStatus(selectedReport).textColor} ${getNormalizedStatus(selectedReport).borderColor}`}>
                  {getNormalizedStatus(selectedReport).label}
                </span>
                <span className="text-xs text-[#64748B]">ID: {selectedReport.id}</span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="p-2 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                aria-label="Tutup jendela laporan"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-7 space-y-6">
              
              {/* Judul & Lokasi */}
              <div>
                <h3 id="modal-report-title" className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">
                  {selectedReport.locationName}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B] mt-2">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin size={13} className="text-[#1D4ED8]" />
                    <span>{selectedReport.coordinates.join(', ')}</span>
                  </span>
                  <span>•</span>
                  <span>Pelapor: {selectedReport.reporterName}</span>
                  <span>•</span>
                  <span>{formatRelativeDate(selectedReport.createdAt)}</span>
                </div>
              </div>

              {/* Tampilan Foto Before & After */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                    Dokumentasi Visual Lapangan
                  </span>
                  
                  {/* Photo Switcher Tabs */}
                  {selectedReport.photoAfter ? (
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <button
                        type="button"
                        onClick={() => setActivePhotoTab('before')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          activePhotoTab === 'before'
                            ? 'bg-white text-[#1D4ED8] shadow-xs border border-[#CBD5E1]'
                            : 'text-[#64748B] hover:text-[#0F172A]'
                        }`}
                      >
                        Foto Sebelum (Before)
                      </button>
                      <button
                        type="button"
                        onClick={() => setActivePhotoTab('after')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          activePhotoTab === 'after'
                            ? 'bg-white text-[#16A34A] shadow-xs border border-[#BBF7D0]'
                            : 'text-[#64748B] hover:text-[#16A34A]'
                        }`}
                      >
                        Foto Sesudah (After)
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-[#D97706] bg-[#FEF3C7] px-2.5 py-0.5 rounded-full border border-[#FDE68A] font-medium">
                      Foto After dalam proses pembersihan
                    </span>
                  )}
                </div>

                <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-100 border border-[#E2E8F0]">
                  <img
                    src={activePhotoTab === 'after' && selectedReport.photoAfter ? selectedReport.photoAfter : selectedReport.photoBefore}
                    alt={selectedReport.locationName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs px-3 py-1.5 rounded-xl text-xs text-white font-bold">
                    {activePhotoTab === 'after' && selectedReport.photoAfter 
                      ? 'Dokumentasi Kondisi Sesudah Dibersihkan' 
                      : 'Kondisi Pencemaran Saat Dilaporkan'}
                  </div>
                </div>
              </div>

              {/* Deskripsi Lengkap */}
              <div className="space-y-1.5 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Deskripsi Laporan:
                </span>
                <p className="text-sm text-[#475569] leading-relaxed">
                  {selectedReport.description}
                </p>
              </div>

              {/* AI & Agency Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1D4ED8]">
                    <Sparkles size={14} />
                    <span>Analisis AI Reforca</span>
                  </div>
                  <div className="text-xs text-[#0F172A]">
                    Keparahan: <strong>{selectedReport.aiAnalysis?.severity}</strong> ({selectedReport.aiAnalysis?.confidenceScore}% akurasi)
                  </div>
                  <div className="text-xs text-[#64748B]">
                    Estimasi Luasan: {selectedReport.aiAnalysis?.estimatedVolumeM2} m²
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
                    <Building2 size={14} className="text-[#1D4ED8]" />
                    <span>Instansi Penanggung Jawab</span>
                  </div>
                  <div className="text-xs text-[#0F172A] font-semibold truncate">
                    {selectedReport.assignedVendor || 'Sedang Ditugaskan ke DLH'}
                  </div>
                  <div className="text-xs text-[#64748B]">
                    Alokasi: {selectedReport.costDetails?.totalCost > 0 ? formatRupiah(selectedReport.costDetails.totalCost) : 'Tahap Verifikasi Anggaran'}
                  </div>
                </div>
              </div>

              {/* Tombol Vote Aktif di Dalam Modal */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div>
                  <span className="text-sm font-bold text-[#0F172A] block">
                    Dukung Prioritas Penanganan
                  </span>
                  <span className="text-xs text-[#64748B]">
                    Semakin banyak dukungan, semakin cepat instansi menindaklanjuti.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleVote(e, selectedReport.id)}
                  className={`px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                    votedReports[selectedReport.id]
                      ? 'bg-[#1D4ED8] text-white shadow-xs'
                      : 'bg-white border border-[#CBD5E1] text-[#334155] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <ThumbsUp size={15} className={votedReports[selectedReport.id] ? 'fill-current' : ''} />
                  <span>
                    {votedReports[selectedReport.id] ? 'Didukung' : 'Beri Vote'} ({ (selectedReport.votesCount || 0) + (votedReports[selectedReport.id] ? 1 : 0) })
                  </span>
                </button>
              </div>

              {/* Kolom Komentar Diskusi Publik */}
              <div className="space-y-4 pt-4 border-t border-[#E2E8F0]">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                    <MessageSquare size={16} className="text-[#1D4ED8]" />
                    <span>Diskusi Publik Warga</span>
                  </h4>
                  <span className="text-xs text-[#64748B]">
                    {(commentsState[selectedReport.id] || []).length} komentar
                  </span>
                </div>

                {/* Form Kirim Komentar */}
                <form onSubmit={handleAddComment} className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Nama Anda (opsional)"
                      value={newCommentName}
                      onChange={(e) => setNewCommentName(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#1D4ED8] focus:bg-white"
                    />
                    <div className="sm:col-span-2 flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Tulis tanggapan atau informasi tambahan..."
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#1D4ED8] focus:bg-white"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
                      >
                        <Send size={13} />
                        <span>Kirim</span>
                      </button>
                    </div>
                  </div>
                </form>

                {/* Daftar Komentar */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {(commentsState[selectedReport.id] || []).length === 0 ? (
                    <div className="text-xs text-[#64748B] text-center py-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      Belum ada komentar untuk laporan ini. Jadilah yang pertama memberikan tanggapan!
                    </div>
                  ) : (
                    (commentsState[selectedReport.id] || []).map((comm) => (
                      <div key={comm.id} className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#0F172A] flex items-center gap-1.5">
                            <User size={12} className="text-[#1D4ED8]" />
                            <span>{comm.name}</span>
                          </span>
                          <span className="text-[11px] text-[#64748B]">{comm.time}</span>
                        </div>
                        <p className="text-xs text-[#475569] leading-relaxed">
                          {comm.text}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </section>
  );
}
