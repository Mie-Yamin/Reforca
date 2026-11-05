import React, { useState } from 'react';
import {
  ShieldAlert,
  Heart,
  Edit3,
  Sparkles,
  Image as ImageIcon,
  Search,
  FileSpreadsheet
} from 'lucide-react';
import { calculatePriorityScore, formatRupiah } from '../data/mockFirestore';

const VENDOR_OPTIONS = [
  "Dinas Lingkungan Hidup DKI Jakarta (Pasukan Oranye)",
  "Trash Hero Jakarta & Relawan Pesisir",
  "PT Bahari Bersih Mandiri (Mitra Kapal Katamaran)",
  "Kelompok Sadar Wisata (Pokdarwis) Pulau Pari",
  "PT Pembangunan Jaya Ancol Bersih & CSR",
  "Koalisi Teluk Bersih & Nelayan Tradisional"
];

const PRESET_AFTER_PHOTOS = [
  { label: "Pantai Pasir Bersih & Jernih", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80" },
  { label: "Mangrove Terbebas dari Sampah Plastik", url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80" },
  { label: "Pesisir Tanggul Rapi & Bebas Limbah", url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=80" }
];

export default function AdminDashboard({ reports, onUpdateReport }) {
  const [isEditing, setIsEditing] = useState(false);
  const [viewingPhoto, setViewingPhoto] = useState(null);

  // Filter & Search State
  const [activeTab, setActiveTab] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Skor Prioritas Tertinggi');

  // Edit Modal State
  const [editingReport, setEditingReport] = useState(null);
  const [editStatus, setEditStatus] = useState('Pending');
  const [editVendor, setEditVendor] = useState('');
  const [editPhotoAfter, setEditPhotoAfter] = useState('');
  const [breakdownItems, setBreakdownItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');

  // Filtering & Sorting Logic
  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.locationName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reporterName?.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'Semua') return matchesSearch;
    if (activeTab === 'Menunggu Antrean') return matchesSearch && (report.status === 'Pending' || report.status === 'Menunggu Antrean');
    if (activeTab === 'Sedang Dikerjakan') return matchesSearch && (report.status === 'In Progress' || report.status === 'Sedang Dikerjakan');
    if (activeTab === 'Selesai / Tuntas') return matchesSearch && (report.status === 'Completed' || report.status === 'Selesai Dibersihkan');
    return matchesSearch;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    if (sortBy === 'Skor Prioritas Tertinggi') {
      return calculatePriorityScore(b) - calculatePriorityScore(a);
    } else if (sortBy === 'Dukungan Suara Terbanyak') {
      return (b.votesCount || 0) - (a.votesCount || 0);
    }
    return 0;
  });

  // Aggregated Stats
  const totalReports = reports.length;
  const criticalCount = reports.filter(r => r.aiAnalysis?.severity === 'Darurat').length;
  const inProgressCount = reports.filter(r => r.status === 'In Progress' || r.status === 'Sedang Dikerjakan').length;
  const completedCount = reports.filter(r => r.status === 'Completed' || r.status === 'Selesai Dibersihkan').length;
  const totalSpent = reports.reduce((acc, c) => acc + (c.costDetails?.totalCost || 0), 0);

  const handleOpenEdit = (report) => {
    setEditingReport(report);
    setEditStatus(report.status);
    setEditVendor(report.assignedVendor !== 'Belum Ditugaskan' ? report.assignedVendor : VENDOR_OPTIONS[0]);
    setEditPhotoAfter(report.photoAfter || PRESET_AFTER_PHOTOS[0].url);
    setBreakdownItems(report.costDetails?.breakdown ? [...report.costDetails.breakdown] : []);
    setIsEditing(true);
  };

  const handleAddBreakdownItem = () => {
    if (!newItemName.trim() || !newItemAmount || isNaN(newItemAmount)) {
      alert("Masukkan nama item pengeluaran dan jumlah biaya yang valid.");
      return;
    }
    setBreakdownItems([
      ...breakdownItems,
      { item: newItemName.trim(), amount: parseInt(newItemAmount, 10) }
    ]);
    setNewItemName('');
    setNewItemAmount('');
  };

  const handleRemoveBreakdownItem = (index) => {
    setBreakdownItems(breakdownItems.filter((_, i) => i !== index));
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingReport) return;

    const totalCost = breakdownItems.reduce((acc, c) => acc + (c.amount || 0), 0);

    const updatedDoc = {
      ...editingReport,
      status: editStatus,
      assignedVendor: editVendor,
      photoAfter: editStatus === 'Completed' || editStatus === 'Selesai Dibersihkan' ? editPhotoAfter : editingReport.photoAfter,
      costDetails: {
        totalCost,
        breakdown: breakdownItems
      },
      updatedAt: new Date().toISOString()
    };

    onUpdateReport(updatedDoc);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6" data-aos="fade-up">
      {/* Top Banner Dashboard Instansi - Tema Terang Bersih */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white border border-[#E2E8F0] shadow-xl shadow-slate-200/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldAlert size={14} className="text-blue-600" />
              <span>Special Government / Agency Control Room</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              Pusat Komando Akuntabilitas Lingkungan Pesisir
            </h3>
            <p className="text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
              Alat manajemen terintegrasi untuk instansi pemerintah dan dinas terkait. Urutkan penanganan darurat berdasarkan prioritas, tugaskan vendor, serta catat realisasi anggaran secara transparan.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2 font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              BaaS Firestore Sinkron
            </span>
          </div>
        </div>

        {/* Real-time Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 mt-8 pt-6 border-t border-[#E2E8F0]">
          <div className="p-4 rounded-2xl bg-slate-50 border border-[#E2E8F0]">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Laporan</span>
            <div className="text-2xl font-black text-[#0F172A] mt-1 font-mono">{totalReports}</div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Dari seluruh warga</span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200">
            <span className="text-xs text-rose-600 font-bold uppercase tracking-wider">Urgensi Darurat</span>
            <div className="text-2xl font-black text-rose-600 mt-1 font-mono">{criticalCount}</div>
            <span className="text-[10px] text-rose-500 mt-0.5 block">Butuh aksi segera</span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
            <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Sedang Dikerjakan</span>
            <div className="text-2xl font-black text-blue-600 mt-1 font-mono">{inProgressCount}</div>
            <span className="text-[10px] text-blue-500 mt-0.5 block">Vendor aktif</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
            <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Selesai Dibersihkan</span>
            <div className="text-2xl font-black text-emerald-600 mt-1 font-mono">{completedCount}</div>
            <span className="text-[10px] text-emerald-500 mt-0.5 block">Siap diverifikasi</span>
          </div>

          <div className="col-span-2 lg:col-span-1 p-4 rounded-2xl bg-slate-50 border border-[#E2E8F0]">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Anggaran</span>
            <div className="text-base font-black text-emerald-600 mt-1 font-mono truncate">
              {formatRupiah(totalSpent)}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Transparan di feed warga</span>
          </div>
        </div>
      </div>

      {/* AI PRIORITY MATRIX SECTION */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white border border-[#E2E8F0] shadow-xl shadow-slate-200/40 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0]">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                <Sparkles size={18} />
              </div>
              <h4 className="text-lg sm:text-xl font-black text-[#0F172A] tracking-tight">
                Antrean Intervensi Pesisir Berbasis Prioritas
              </h4>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Urutan otomatis berdasarkan tingkat keparahan, dukungan suara warga, dan volume limbah.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert("Rekap CSV berhasil diekspor.")}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors border border-[#E2E8F0]"
            >
              <FileSpreadsheet size={14} className="text-emerald-600" />
              <span>Ekspor Rekap CSV</span>
            </button>
            <span className="px-3.5 py-2 rounded-xl bg-slate-100 border border-[#E2E8F0] text-xs text-blue-700 font-bold">
              {sortedReports.length} Laporan Dalam Antrean
            </span>
          </div>
        </div>

        {/* Toolbar Filter & Pencarian */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-[#E2E8F0]">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0">
            {[
              { label: 'Semua', count: reports.length },
              { label: 'Menunggu Antrean', count: reports.filter(r => r.status === 'Pending' || r.status === 'Menunggu Antrean').length },
              { label: 'Sedang Dikerjakan', count: reports.filter(r => r.status === 'In Progress' || r.status === 'Sedang Dikerjakan').length },
              { label: 'Selesai / Tuntas', count: reports.filter(r => r.status === 'Completed' || r.status === 'Selesai Dibersihkan').length }
            ].map((tab) => (
              <button
                key={tab.label}
                type="button"
                onClick={() => setActiveTab(tab.label)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${activeTab === tab.label
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-[#E2E8F0]'
                  }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeTab === tab.label ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="relative flex-1 sm:w-64">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari lokasi pesisir, pelapor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#0F172A] outline-none focus:border-blue-500 shadow-inner"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#E2E8F0] rounded-xl px-3.5 py-2 text-xs font-semibold text-[#0F172A] outline-none shadow-xs cursor-pointer"
            >
              <option value="Skor Prioritas Tertinggi">Skor Prioritas Tertinggi</option>
              <option value="Dukungan Suara Terbanyak">Dukungan Suara Terbanyak</option>
            </select>
          </div>
        </div>

        {/* Matrix Queue List */}
        <div className="space-y-4">
          {sortedReports.map((report, index) => {
            const score = calculatePriorityScore(report);
            const isDarurat = report.aiAnalysis?.severity === 'Darurat';
            // Mengambil properti foto yang diinput oleh user secara konsisten (photoBefore atau photoUrl)
            const reportPhoto = report.photoBefore || report.photoUrl || report.imageUrl || report.image;

            return (
              <div
                key={report.id}
                className="p-5 rounded-2xl bg-slate-50 border border-[#E2E8F0] hover:border-blue-300 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-5 group shadow-xs"
              >
                {/* Rank, Foto & Basic Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm ${index === 0 ? 'bg-rose-600 text-white' :
                    index === 1 ? 'bg-amber-500 text-white font-bold' :
                      index === 2 ? 'bg-blue-600 text-white font-bold' :
                        'bg-slate-200 text-slate-700'
                    }`}>
                    #{index + 1}
                  </div>

                  {/* THUMBNAIL FOTO ASLI DARI PENGINPUT (WARGA) */}
                  {reportPhoto && (
                    <div className="relative group/img shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-slate-200">
                      <img
                        src={reportPhoto}
                        alt={report.locationName}
                        className="w-full h-full object-cover cursor-pointer group-hover/img:scale-105 transition-transform duration-300"
                        onClick={() => setViewingPhoto({
                          url: reportPhoto,
                          title: report.locationName,
                          reporter: report.reporterName || 'Warga'
                        })}
                        title="Klik untuk memperbesar foto asli laporan warga"
                      />
                      <div
                        onClick={() => setViewingPhoto({
                          url: reportPhoto,
                          title: report.locationName,
                          reporter: report.reporterName || 'Warga'
                        })}
                        className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer flex flex-col items-center justify-center text-white text-[10px] font-bold gap-0.5"
                      >
                        <ImageIcon size={16} />
                        <span>Lihat Foto</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${isDarurat ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                        'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}>
                        {report.aiAnalysis?.severity || 'Normal'}
                      </span>
                      <span className="text-xs text-rose-600 flex items-center gap-1 font-bold">
                        <Heart size={12} className="fill-current" />
                        {report.votesCount || 0} Suara Warga
                      </span>
                      <span className="text-xs text-slate-500">• Luas: <strong className="text-slate-700">{report.aiAnalysis?.estimatedVolumeM2 || '0'} m²</strong></span>
                      <span className="text-xs text-slate-500">• Pelapor: <strong className="text-slate-700">{report.reporterName || 'Warga'}</strong></span>
                    </div>

                    <h5 className="text-base sm:text-lg font-bold text-[#0F172A] group-hover:text-blue-600 transition-colors truncate">
                      {report.locationName}
                    </h5>
                    <p className="text-xs text-slate-600 line-clamp-1">{report.description}</p>

                    <div className="text-xs text-slate-600 pt-1 flex flex-wrap items-center gap-4">
                      <span>Vendor: <strong className="text-slate-900 font-semibold">{report.assignedVendor || 'Belum Ditugaskan'}</strong></span>
                      <span>Biaya: <strong className="text-emerald-600 font-mono font-bold">{formatRupiah(report.costDetails?.totalCost || 0)}</strong></span>
                      <span>Status: <strong className="text-blue-600 font-semibold">{report.status || 'Pending'}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Score & Action Button */}
                <div className="flex items-center justify-between md:justify-end gap-5 pt-4 md:pt-0 border-t md:border-t-0 border-[#E2E8F0] shrink-0">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Skor Prioritas</span>
                    <span className="text-xl sm:text-2xl font-black text-blue-600 font-mono">{score} pts</span>
                  </div>

                  <button
                    onClick={() => handleOpenEdit(report)}
                    className="px-4.5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all hover:scale-105 active:scale-95"
                  >
                    <Edit3 size={15} />
                    <span>Kelola Penugasan</span>
                  </button>
                </div>
              </div>
            );
          })}

          {sortedReports.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs italic bg-slate-50 rounded-2xl border border-dashed border-[#E2E8F0]">
              Tidak ada laporan yang sesuai dengan filter atau kata kunci pencarian.
            </div>
          )}
        </div>
      </div>

      {/* MODAL PRATINJAU FOTO LAPORAN WARGA */}
      {viewingPhoto && (
        <div className="fixed inset-0 z-[1100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Foto Bukti Laporan Warga</span>
                <h4 className="text-base font-bold text-[#0F172A]">{viewingPhoto.title}</h4>
                <p className="text-xs text-slate-500">Dilaporkan oleh: {viewingPhoto.reporter}</p>
              </div>
              <button
                onClick={() => setViewingPhoto(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-[#E2E8F0] bg-slate-950 flex items-center justify-center max-h-[70vh]">
              <img
                src={viewingPhoto.url}
                alt={viewingPhoto.title}
                className="max-h-[65vh] w-auto object-contain"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setViewingPhoto(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT PENUGASAN, BUKTI SELESAI, & RINCIAN ANGGARAN */}
      {isEditing && editingReport && (
        <div className="fixed inset-0 z-[1000] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-[#E2E8F0] pb-4">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
                  Pembaruan Administrasi Instansi (BaaS Update)
                </span>
                <h4 className="text-xl font-black text-[#0F172A] mt-1">
                  {editingReport.locationName}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pelapor: <span className="text-blue-600 font-medium">{editingReport.reporterName}</span>
                </p>
              </div>

              <button
                onClick={() => setIsEditing(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl bg-slate-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    1. Status Pengerjaan Lapangan
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-[#E2E8F0] focus:border-blue-500 rounded-xl px-4 py-3 text-xs font-semibold text-[#0F172A] outline-none shadow-inner"
                  >
                    <option value="Pending">Pending (Menunggu Antrean)</option>
                    <option value="In Progress">In Progress (Sedang Dikerjakan Tim)</option>
                    <option value="Completed">Completed (Selesai Dibersihkan)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    2. Vendor / Rekanan Pelaksana
                  </label>
                  <select
                    value={editVendor}
                    onChange={(e) => setEditVendor(e.target.value)}
                    className="w-full bg-slate-50 border border-[#E2E8F0] focus:border-blue-500 rounded-xl px-4 py-3 text-xs font-semibold text-[#0F172A] outline-none shadow-inner"
                  >
                    {VENDOR_OPTIONS.map((v, i) => (
                      <option key={i} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>

              {editStatus === 'Completed' && (
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3 shadow-inner">
                  <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    3. Foto Bukti Pantai Sudah Bersih (After Photo)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {PRESET_AFTER_PHOTOS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditPhotoAfter(preset.url)}
                        className={`p-2 rounded-xl border text-[11px] flex flex-col items-center gap-1.5 transition-all ${editPhotoAfter === preset.url
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20 font-bold shadow-xs'
                          : 'bg-white border-[#E2E8F0] text-slate-600 hover:text-slate-900'
                          }`}
                      >
                        <img src={preset.url} alt="" className="w-full h-16 object-cover rounded-lg shadow-xs" />
                        <span className="line-clamp-1 text-center">{preset.label}</span>
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Atau masukkan tautan URL foto hasil pembersihan kustom..."
                    value={editPhotoAfter}
                    onChange={(e) => setEditPhotoAfter(e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    4. Rincian Anggaran Operasional (Cost Breakdown)
                  </label>
                  <span className="text-xs font-black text-emerald-700 font-mono bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Total: {formatRupiah(breakdownItems.reduce((acc, c) => acc + (c.amount || 0), 0))}
                  </span>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {breakdownItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50 border border-[#E2E8F0] shadow-xs">
                      <span className="text-[#0F172A] font-medium">{item.item}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-emerald-600">{formatRupiah(item.amount)}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveBreakdownItem(idx)}
                          className="text-rose-500 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}

                  {breakdownItems.length === 0 && (
                    <p className="text-xs text-slate-400 italic p-4 text-center bg-slate-50 rounded-xl border border-dashed border-[#E2E8F0]">
                      Belum ada rincian biaya yang ditambahkan.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-2">
                  <div className="sm:col-span-7">
                    <input
                      type="text"
                      placeholder="Nama item (Contoh: Sewa Perahu Katamaran)"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] outline-none focus:border-blue-500 shadow-inner"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="number"
                      placeholder="Nominal (IDR)"
                      value={newItemAmount}
                      onChange={(e) => setNewItemAmount(e.target.value)}
                      className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] outline-none focus:border-blue-500 font-mono shadow-inner"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddBreakdownItem}
                      className="w-full h-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-blue-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-[#E2E8F0] hover:border-blue-600 shadow-xs"
                    >
                      <span>Tambah</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-5 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4.5 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 text-xs font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all hover:scale-105 active:scale-95"
                >
                  Simpan Pembaruan Data Transparan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}