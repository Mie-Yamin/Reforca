import React, { useState } from 'react';
import {
  Sparkles,
  UploadCloud,
  MapPin,
  FileText,
  User,
  Phone,
  Cpu,
  CheckCircle2,
  Image as ImageIcon,
  Activity,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

import { compressImageToBase64 } from '../utils/imageHelper';
import { analyzeBeachWasteWithGroq } from '../services/groqVision';

const PRESET_BEACHES = [
  { name: "Pesisir Muara Angke (Hutan Mangrove & Muara Kali Adem)", coords: [-6.1108, 106.7731] },
  { name: "Pantai Marunda (Pesisir Cilincing, Jakarta Utara)", coords: [-6.0984, 106.9642] },
  { name: "Pantai Karnaval & Kawasan Tanggul Marina Ancol", coords: [-6.1215, 106.8491] },
  { name: "Pantai Pasir Perawan (Pulau Pari, Kepulauan Seribu)", coords: [-5.8622, 106.6214] },
  { name: "Pantai Untung Jawa (Pesisir Dermaga Sakura)", coords: [-5.9782, 106.7041] },
  { name: "Pesisir Tanjung Pasir (Muara Teluknaga)", coords: [-6.0152, 106.6789] }
];

export default function PublicReportForm({ onSubmitReport, currentUser }) {
  const [selectedBeach, setSelectedBeach] = useState(PRESET_BEACHES[0].name);
  const [customBeachName, setCustomBeachName] = useState('');

  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState(() => currentUser?.name || '');
  const [reporterContact, setReporterContact] = useState(() => currentUser?.phone || currentUser?.email || '');

  const [currentPhotoUrl, setCurrentPhotoUrl] = useState('');

  // AI Vision Analyzer states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(100);
  const [aiData, setAiData] = useState({
    severity: 'Darurat',
    accuracy: '97.4%',
    area: '± 250 m²',
    wasteTypes: ['Plastik Sekali Pakai', 'Limbah Domestik'],
    narrative: 'Silakan unggah foto kondisi pesisir untuk memulai analisis AI otomatis.'
  });
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsAnalyzing(true);
      setAnalysisProgress(30);

      const compressedBase64 = await compressImageToBase64(file, 1024, 0.75);
      setCurrentPhotoUrl(compressedBase64);
      setAnalysisProgress(60);

      const result = await analyzeBeachWasteWithGroq(compressedBase64, description || "Sampah pesisir");

      setAnalysisProgress(100);
      setAiData({
        severity: result.severity,
        accuracy: `${result.confidenceScore}%`,
        area: `± ${result.estimatedVolumeM2} m²`,
        wasteTypes: result.wasteType,
        narrative: result.aiSummary
      });
    } catch (err) {
      console.error("Gagal memproses gambar dengan Groq AI:", err);
      alert("Gagal menganalisis foto dengan AI Vision.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRunAiAnalyzer = async () => {
    if (!currentPhotoUrl) {
      alert("Mohon unggah foto bukti sampah terlebih dahulu.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(30);

    try {
      const result = await analyzeBeachWasteWithGroq(currentPhotoUrl, description || "Sampah pesisir");
      setAnalysisProgress(100);
      setAiData({
        severity: result.severity,
        accuracy: `${result.confidenceScore}%`,
        area: `± ${result.estimatedVolumeM2} m²`,
        wasteTypes: result.wasteType,
        narrative: result.aiSummary
      });
    } catch (err) {
      console.error("Gagal menjalankan AI:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!reporterName.trim() || !description.trim() || !currentPhotoUrl) {
      alert("Mohon lengkapi foto bukti, deskripsi, dan nama pelapor.");
      return;
    }

    const beachObj = PRESET_BEACHES.find(b => b.name === selectedBeach) || {
      name: customBeachName || selectedBeach,
      coords: [-6.10, 106.82]
    };

    const newReport = {
      id: `reforca_doc_${Date.now()}`,
      locationName: customBeachName ? customBeachName : beachObj.name,
      coordinates: beachObj.coords,
      description: description,
      photoBefore: currentPhotoUrl,
      photoAfter: null,
      reporterName: reporterName,
      reporterContact: reporterContact || "0812-xxxx-xxxx",
      aiAnalysis: {
        severity: aiData.severity,
        wasteType: aiData.wasteTypes,
        estimatedVolumeM2: parseInt(aiData.area.replace(/[^0-9]/g, ''), 10) || 250,
        confidenceScore: parseFloat(aiData.accuracy.replace(/[^0-9.]/g, '')) || 97.4,
        aiSummary: aiData.narrative,
        recommendedActions: [
          "Pengerahan perahu pembersih pesisir",
          "Evakuasi limbah anorganik manual",
          "Pemasangan jaring barrier penahan sampah"
        ]
      },
      status: "Pending",
      assignedVendor: "Dinas Lingkungan Hidup DKI Jakarta",
      costDetails: {
        totalCost: 0,
        breakdown: []
      },
      votesCount: 1,
      citizenConfirmed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (onSubmitReport) {
      onSubmitReport(newReport);
    }

    setIsSubmittedSuccess(true);
    setTimeout(() => {
      setIsSubmittedSuccess(false);
    }, 4500);
  };

  return (
    <div className="w-full bg-white text-[#0F172A]">
      {isSubmittedSuccess ? (
        <div className="p-8 rounded-2xl bg-[#DCFCE7] border border-[#BBF7D0] text-center space-y-3 animate-fade-in my-4">
          <div className="w-14 h-14 bg-[#16A34A] text-white rounded-full flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 size={30} />
          </div>
          <h3 className="text-xl font-bold text-[#0F172A]">
            Laporan Berhasil Diterbitkan!
          </h3>
          <p className="text-xs sm:text-sm text-[#475569] max-w-md mx-auto">
            Terima kasih atas kepedulian Anda. Laporan titik sampah ini telah diterbitkan ke Peta Real-Time dan masuk ke antrean prioritas dinas terkait.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* KOLOM KIRI: PREVIEW FOTO & AI VISION ANALYZER */}
            <div className="lg:col-span-6 space-y-4">

              <div className="rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon size={15} className="text-[#1D4ED8]" />
                    <span>1. Foto Bukti Sampah Pantai (Before)</span>
                  </label>

                  <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs">
                    <UploadCloud size={14} />
                    <span>Upload Foto HP</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>

                <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-slate-100 border border-[#E2E8F0] group flex items-center justify-center">
                  {currentPhotoUrl ? (
                    <img
                      src={currentPhotoUrl}
                      alt="Bukti Sampah Pantai"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-6 text-slate-400 space-y-2">
                      <UploadCloud size={32} className="mx-auto text-slate-300" />
                      <p className="text-xs">Belum ada foto yang diunggah. Klik tombol "Upload Foto HP" di atas.</p>
                    </div>
                  )}

                  {currentPhotoUrl && (
                    <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-[#E2E8F0] text-[11px] font-bold text-[#1D4ED8] shadow-xs flex items-center gap-1.5">
                      <Activity size={13} className="text-[#1D4ED8]" />
                      <span>Resolusi Siap Analisis</span>
                    </div>
                  )}
                </div>
              </div>

              {/* BOX AI VISION ANALYZER */}
              <div className="rounded-2xl bg-[#EFF6FF] border border-[#DBEAFE] p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-[#DBEAFE]">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-white text-[#1D4ED8] border border-[#DBEAFE] shadow-2xs">
                      <Cpu size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                        Verifikasi AI Reforca
                      </h4>
                      <p className="text-[10px] text-[#64748B]">
                        Model inferensi visi Groq Llama 3.2
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FEE2E2] border border-[#FECACA] text-[#DC2626] text-[11px] font-bold">
                    <AlertTriangle size={12} />
                    <span>{aiData.severity} ({aiData.accuracy})</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRunAiAnalyzer}
                  disabled={isAnalyzing}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
                >
                  <Sparkles size={14} className={isAnalyzing ? 'animate-spin' : ''} />
                  <span>{isAnalyzing ? 'Memindai dengan Groq AI Vision...' : 'Uji Analisis AI Nyata'}</span>
                </button>

                {isAnalyzing && (
                  <div className="space-y-1">
                    <div className="w-full bg-[#DBEAFE] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-[#1D4ED8] h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${analysisProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-[#DBEAFE]">
                    <span className="text-[10px] text-[#64748B] block">Luas Area:</span>
                    <span className="font-bold text-[#1D4ED8]">{aiData.area}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#DBEAFE]">
                    <span className="text-[10px] text-[#64748B] block">Kerapatan:</span>
                    <span className="font-bold text-[#0F172A]">Tinggi (&gt;40 kg/m²)</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#DBEAFE]">
                  <span className="text-[10px] uppercase font-bold text-[#1D4ED8] tracking-wider block mb-1">
                    Hasil Verifikasi:
                  </span>
                  <p className="text-xs text-[#334155] leading-relaxed italic">
                    "{aiData.narrative}"
                  </p>
                </div>
              </div>

            </div>

            {/* KOLOM KANAN: FIELD INPUT LOKASI, DESKRIPSI & KONTAK */}
            <div className="lg:col-span-6 space-y-4">

              <div className="rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-5 space-y-4">

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#1D4ED8]" />
                    <span>2. Titik Pesisir / Pantai</span>
                  </label>
                  <select
                    value={selectedBeach}
                    onChange={(e) => setSelectedBeach(e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] focus:border-[#1D4ED8] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#0F172A] outline-none transition-colors"
                  >
                    {PRESET_BEACHES.map((b, idx) => (
                      <option key={idx} value={b.name}>{b.name}</option>
                    ))}
                    <option value="CUSTOM">+ Tulis Lokasi Pantai Secara Manual</option>
                  </select>

                  {selectedBeach === 'CUSTOM' && (
                    <input
                      type="text"
                      placeholder="Masukkan nama pesisir / pulau / dermaga..."
                      value={customBeachName}
                      onChange={(e) => setCustomBeachName(e.target.value)}
                      className="mt-2 w-full bg-white border border-[#1D4ED8] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#0F172A] focus:outline-none"
                      required
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <FileText size={14} className="text-[#1D4ED8]" />
                    <span>3. Deskripsi Kondisi & Dampak</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tuliskan deskripsi kondisi timbunan sampah, jenis polutan, atau dampaknya secara manual di sini..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] focus:border-[#1D4ED8] rounded-xl p-3 text-xs sm:text-sm text-[#0F172A] placeholder-slate-400 outline-none transition-colors resize-none leading-relaxed"
                    required
                  ></textarea>
                </div>

                <div className="space-y-3 pt-1">
                  {currentUser && (
                    <div className="p-3 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-between text-xs text-[#1E40AF]">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
                        <span>Akun Terverifikasi: <strong>{currentUser.name}</strong> ({currentUser.email})</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#1D4ED8] border border-[#BFDBFE] uppercase">
                        Warga Pelapor Bahari
                      </span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <User size={14} className="text-[#1D4ED8]" />
                      <span>4. Nama Pelapor & Komunitas</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Masukkan nama lengkap Anda..."
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      className="w-full bg-white border border-[#E2E8F0] focus:border-[#1D4ED8] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#0F172A] outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Phone size={14} className="text-[#1D4ED8]" />
                      <span>Kontak WhatsApp (Verifikasi)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 0812-3456-7890"
                      value={reporterContact}
                      onChange={(e) => setReporterContact(e.target.value)}
                      className="w-full bg-white border border-[#E2E8F0] focus:border-[#1D4ED8] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#0F172A] outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0]">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <UploadCloud size={17} />
                    <span>Kirim Laporan Resmi</span>
                  </button>
                </div>

              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-start gap-2.5 text-xs text-[#64748B]">
                <ShieldCheck size={18} className="text-[#1D4ED8] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#0F172A] block mb-0.5">Jaminan Kerahasiaan Data</span>
                  <p className="leading-snug">
                    Nomor kontak hanya dipergunakan untuk konfirmasi verifikasi lapangan oleh petugas DLH berwenang.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </form>
      )}
    </div>
  );
}