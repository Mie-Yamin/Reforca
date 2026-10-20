import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Flame, 
  Heart, 
  Clock, 
  CheckCircle2, 
  Briefcase, 
  DollarSign, 
  Plus, 
  Trash2, 
  Edit3, 
  Layers, 
  ChevronRight, 
  ExternalLink, 
  AlertCircle,
  FileCheck,
  TrendingUp,
  Award,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { calculatePriorityScore, formatRupiah, formatRelativeDate } from '../data/mockFirestore';

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
  const [selectedReportId, setSelectedReportId] = useState(reports[0]?.id || null);
  const [isEditing, setIsEditing] = useState(false);

  // Edit Modal/Drawer State
  const [editingReport, setEditingReport] = useState(null);
  const [editStatus, setEditStatus] = useState('Pending');
  const [editVendor, setEditVendor] = useState('');
  const [editPhotoAfter, setEditPhotoAfter] = useState('');
  const [breakdownItems, setBreakdownItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');

  // AI Priority Matrix Sorted Queue
  const sortedByPriority = [...reports].sort((a, b) => {
    return calculatePriorityScore(b) - calculatePriorityScore(a);
  });

  // Aggregated Stats
  const totalReports = reports.length;
  const criticalCount = reports.filter(r => r.aiAnalysis?.severity === 'Darurat').length;
  const inProgressCount = reports.filter(r => r.status === 'In Progress').length;
  const completedCount = reports.filter(r => r.status === 'Completed').length;
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
      photoAfter: editStatus === 'Completed' ? editPhotoAfter : editingReport.photoAfter,
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
    <div className="space-y-8" data-aos="fade-up">
      {/* Top Banner Dashboard Instansi */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/25 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
              <ShieldAlert size={14} className="text-cyan-400" />
              <span>Special Government / Agency Control Room (`/admin`)</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Pusat Komando Akuntabilitas Lingkungan Pesisir
            </h3>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Alat manajemen terintegrasi untuk instansi pemerintah dan dinas terkait. Urutkan penanganan darurat berdasarkan AI Priority Matrix, tugaskan vendor, serta catat realisasi anggaran transparan.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              BaaS Firestore Sinkron
            </span>
          </div>
        </div>

        {/* Real-time Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 mt-8 pt-6 border-t border-slate-800">
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Total Laporan</span>
            <div className="text-2xl font-black text-white mt-1">{totalReports}</div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Dari seluruh warga</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/70 border border-rose-500/30">
            <span className="text-xs text-rose-400 font-medium">Urgensi Darurat</span>
            <div className="text-2xl font-black text-rose-500 mt-1">{criticalCount}</div>
            <span className="text-[10px] text-rose-400/70 mt-0.5 block">Butuh aksi segera</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/70 border border-cyan-500/30">
            <span className="text-xs text-cyan-400 font-medium">Sedang Dikerjakan</span>
            <div className="text-2xl font-black text-cyan-400 mt-1">{inProgressCount}</div>
            <span className="text-[10px] text-cyan-400/70 mt-0.5 block">Vendor aktif</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/70 border border-emerald-500/30">
            <span className="text-xs text-emerald-400 font-medium">Selesai Dibersihkan</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">{completedCount}</div>
            <span className="text-[10px] text-emerald-400/70 mt-0.5 block">Siap diverifikasi</span>
          </div>

          <div className="col-span-2 lg:col-span-1 p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Total Anggaran Operasi</span>
            <div className="text-xl sm:text-lg font-black text-emerald-400 mt-1 font-mono">
              {formatRupiah(totalSpent)}
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Transparan di feed warga</span>
          </div>
        </div>
      </div>

      {/* AI PRIORITY MATRIX SECTION */}
      <div className="glass-panel rounded-3xl p-6 border border-teal-500/25 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-teal-400" />
              <h4 className="text-lg font-bold text-white">AI Priority Matrix — Antrean Intervensi Pesisir</h4>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Urutan kalkulasi otomatis algoritma: <code className="text-teal-300 font-mono text-[11px]">(Tingkat Keparahan Llama-3 × Bobot) + (Dukungan Upvote × 1.5) + (Volume m² × 0.2)</code>
            </p>
          </div>

          <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs text-cyan-300 font-medium self-start sm:self-auto">
            {sortedByPriority.length} Laporan Dalam Antrean Prioritas
          </span>
        </div>

        {/* Matrix Queue List */}
        <div className="space-y-3">
          {sortedByPriority.map((report, index) => {
            const score = calculatePriorityScore(report);
            const isDarurat = report.aiAnalysis?.severity === 'Darurat';

            return (
              <div 
                key={report.id}
                className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-teal-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Rank & Basic Info */}
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                    index === 0 ? 'bg-rose-500 text-white shadow-glow-rose' :
                    index === 1 ? 'bg-amber-500 text-slate-950 font-bold' :
                    index === 2 ? 'bg-cyan-500 text-slate-950 font-bold' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    #{index + 1}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isDarurat ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {report.aiAnalysis?.severity}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold text-rose-400">
                        <Heart size={12} className="fill-current" />
                        {report.votesCount} Suara Warga
                      </span>
                      <span className="text-xs text-slate-500">• Luas: {report.aiAnalysis?.estimatedVolumeM2} m²</span>
                    </div>

                    <h5 className="text-base font-bold text-white mt-1">{report.locationName}</h5>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{report.description}</p>
                    
                    <div className="text-xs text-slate-400 mt-2 flex flex-wrap items-center gap-3">
                      <span>Vendor: <strong className="text-slate-200">{report.assignedVendor}</strong></span>
                      <span>Biaya: <strong className="text-emerald-400 font-mono">{formatRupiah(report.costDetails?.totalCost || 0)}</strong></span>
                      <span>Status: <strong className="text-cyan-300">{report.status}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Score & Action Button */}
                <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Skor Prioritas</span>
                    <span className="text-xl font-black text-teal-300 font-mono">{score} pts</span>
                  </div>

                  <button
                    onClick={() => handleOpenEdit(report)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-teal-500/20 transition-all hover:scale-105 active:scale-95"
                  >
                    <Edit3 size={14} />
                    <span>Kelola Penugasan & Biaya</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL EDIT PENUGASAN, BUKTI SELESAI, & RINCIAN ANGGARAN */}
      {isEditing && editingReport && (
        <div className="fixed inset-0 z-[1000] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 rounded-3xl border border-teal-500/40 p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider block">
                  Pembaruan Administrasi Instansi (BaaS Update)
                </span>
                <h4 className="text-xl font-extrabold text-white mt-1">
                  {editingReport.locationName}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  ID: <code className="font-mono text-cyan-300">{editingReport.id}</code> • Pelapor: {editingReport.reporterName}
                </p>
              </div>

              <button
                onClick={() => setIsEditing(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-6">
              {/* Status & Vendor Assignment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1.5">
                    1. Status Pengerjaan Lapangan
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-teal-400 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white outline-none"
                  >
                    <option value="Pending">Pending (Menunggu Antrean)</option>
                    <option value="In Progress">In Progress (Sedang Dikerjakan Tim)</option>
                    <option value="Completed">Completed (Selesai Dibersihkan)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1.5">
                    2. Vendor / Rekanan Pelaksana
                  </label>
                  <select
                    value={editVendor}
                    onChange={(e) => setEditVendor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-teal-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                  >
                    {VENDOR_OPTIONS.map((v, i) => (
                      <option key={i} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Bukti Foto Selesai (After Photo) */}
              {editStatus === 'Completed' && (
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-emerald-500/30 space-y-3">
                  <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    3. Foto Bukti Pantai Sudah Bersih (After Photo)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {PRESET_AFTER_PHOTOS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditPhotoAfter(preset.url)}
                        className={`p-1.5 rounded-xl border text-[11px] flex flex-col items-center gap-1 ${
                          editPhotoAfter === preset.url
                            ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/30 font-semibold'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <img src={preset.url} alt="" className="w-full h-14 object-cover rounded-lg" />
                        <span className="line-clamp-1">{preset.label}</span>
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Atau masukkan tautan URL foto hasil pembersihan kustom..."
                    value={editPhotoAfter}
                    onChange={(e) => setEditPhotoAfter(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>
              )}

              {/* Rincian Anggaran Transparan (Cost Details) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                    4. Rincian Anggaran Operasional (Cost Breakdown)
                  </label>
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    Total: {formatRupiah(breakdownItems.reduce((acc, c) => acc + (c.amount || 0), 0))}
                  </span>
                </div>

                {/* Existing items */}
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {breakdownItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-200">{item.item}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-emerald-400">{formatRupiah(item.amount)}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveBreakdownItem(idx)}
                          className="text-rose-400 hover:text-rose-300 p-1 rounded"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {breakdownItems.length === 0 && (
                    <p className="text-xs text-slate-500 italic p-3 text-center bg-slate-950/40 rounded-xl">
                      Belum ada rincian biaya yang ditambahkan. Gunakan form di bawah untuk menambah rincian nota penanganan.
                    </p>
                  )}
                </div>

                {/* Add new item */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-2">
                  <div className="sm:col-span-7">
                    <input
                      type="text"
                      placeholder="Nama item (Contoh: Sewa Perahu Katamaran 2 Hari)"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-teal-400"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="number"
                      placeholder="Nominal (IDR)"
                      value={newItemAmount}
                      onChange={(e) => setNewItemAmount(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-teal-400 font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddBreakdownItem}
                      className="w-full h-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-teal-500 hover:text-slate-950 text-cyan-300 text-xs font-bold flex items-center justify-center gap-1 transition-all border border-slate-700 hover:border-teal-400"
                    >
                      <Plus size={14} />
                      <span>Tambah</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20"
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
