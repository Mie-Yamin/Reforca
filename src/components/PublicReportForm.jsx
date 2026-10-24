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

const PRESET_BEACHES = [
  { name: "Pesisir Muara Angke (Hutan Mangrove & Muara Kali Adem)", coords: [-6.1108, 106.7731] },
  { name: "Pantai Marunda (Pesisir Cilincing, Jakarta Utara)", coords: [-6.0984, 106.9642] },
  { name: "Pantai Karnaval & Kawasan Tanggul Marina Ancol", coords: [-6.1215, 106.8491] },
  { name: "Pantai Pasir Perawan (Pulau Pari, Kepulauan Seribu)", coords: [-5.8622, 106.6214] },
  { name: "Pantai Untung Jawa (Pesisir Dermaga Sakura)", coords: [-5.9782, 106.7041] },
  { name: "Pesisir Tanjung Pasir (Muara Teluknaga)", coords: [-6.0152, 106.6789] }
];

const PRESET_THUMBNAILS = [
  {
    title: "Mangrove Muara Angke",
    url: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=1000&q=80",
    severity: "Darurat",
    accuracy: "97.4%",
    area: "± 290 m²",
    wasteTypes: ["Plastik Sekali Pakai", "Jaring Nelayan", "Styrofoam", "Tali Tambang"],
    narrative: "ANALISIS AI VISION: Terdeteksi kerapatan sampah anorganik tinggi (>40 kg/m²) yang mengikat pneumatofora (akar napas) mangrove. Urgensi DARURAT karena berisiko mematikan tegakan mangrove dan mencemari tambak pesisir dalam 14 hari."
  },
  {
    title: "Garis Pantai Marunda",
    url: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1000&q=80",
    severity: "Darurat",
    accuracy: "96.2%",
    area: "± 480 m²",
    wasteTypes: ["Plastik Sekali Pakai", "Limbah Tekstil", "Botol Kaca", "Styrofoam"],
    narrative: "ANALISIS AI VISION: Penumpukan sampah domestik pesisir terbawa arus rob laut. Ditemukan pecahan kaca dan serpihan styrofoam yang membahayakan aktivitas nelayan dan anak-anak pesisir."
  },
  {
    title: "Pesisir Pulau Pari",
    url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1000&q=80",
    severity: "Sedang",
    accuracy: "92.8%",
    area: "± 110 m²",
    wasteTypes: ["Plastik Sekali Pakai", "Sedotan Plastik", "Tutup Botol", "Serpihan Foam"],
    narrative: "ANALISIS AI VISION: Polutan mikro dan makro plastik tersebar di bibir pantai wisata. Disarankan penanganan segera menggunakan ayakan pasir pantai untuk menghindari degradasi mikroplastik."
  }
];

export default function PublicReportForm({ onSubmitReport, currentUser }) {
  const [selectedBeach, setSelectedBeach] = useState(PRESET_BEACHES[0].name);
  const [customBeachName, setCustomBeachName] = useState('');
  const [description, setDescription] = useState(
    "Timbunan jaring nelayan dan kantong plastik menumpuk tebal di sela-sela akar bakau setelah pasang air laut. Nelayan setempat kesulitan menambatkan perahu dan air mulai berbau busuk."
  );
  const [reporterName, setReporterName] = useState(() => currentUser?.name || 'Bambang Sudirman');
  const [reporterContact, setReporterContact] = useState(() => currentUser?.phone || currentUser?.email || '0812-8871-3321');
  
  const [activeThumbnailIndex, setActiveThumbnailIndex] = useState(0);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState(PRESET_THUMBNAILS[0].url);
  
  // AI Vision Analyzer states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(100);
  const [aiData, setAiData] = useState(PRESET_THUMBNAILS[0]);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  const handleSelectThumbnail = (index) => {
    setActiveThumbnailIndex(index);
    setCurrentPhotoUrl(PRESET_THUMBNAILS[index].url);
    setAiData(PRESET_THUMBNAILS[index]);
  };

  const handleRunAiAnalyzer = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(20);

    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 95;
        }
        return prev + 25;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setAnalysisProgress(100);
      setIsAnalyzing(false);
      setAiData(PRESET_THUMBNAILS[activeThumbnailIndex]);
    }, 1200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!reporterName.trim() || !description.trim()) {
      alert("Mohon lengkapi nama pelapor dan deskripsi temuan sampah.");
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
        estimatedVolumeM2: parseInt(aiData.area.replace(/[^0-9]/g, ''), 10) || 290,
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
            
            {/* KOLOM KIRI: PREVIEW FOTO, 3 THUMBNAILS & AI VISION BOX */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Photo Preview Card */}
              <div className="rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 space-y-3">
                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon size={15} className="text-[#1D4ED8]" />
                  <span>1. Foto Bukti Sampah Pantai (Before)</span>
                </label>

                {/* Main Image View */}
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-slate-100 border border-[#E2E8F0] group">
                  <img 
                    src={currentPhotoUrl} 
                    alt="Bukti Sampah Pantai" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-[#E2E8F0] text-[11px] font-bold text-[#1D4ED8] shadow-xs flex items-center gap-1.5">
                    <Activity size={13} className="text-[#1D4ED8]" />
                    <span>Resolusi Siap Analisis</span>
                  </div>
                </div>

                {/* 3 Foto Thumbnail Contoh Kondisi Pesisir */}
                <div>
                  <span className="text-[11px] text-[#64748B] block mb-1.5 font-medium">
                    Pilih contoh foto kondisi pesisir:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_THUMBNAILS.map((thumb, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectThumbnail(idx)}
                        className={`p-1.5 rounded-xl border text-[11px] transition-all flex flex-col items-center gap-1 text-left ${
                          activeThumbnailIndex === idx
                            ? 'bg-white border-[#1D4ED8] text-[#1D4ED8] ring-1 ring-[#1D4ED8] font-bold shadow-xs'
                            : 'bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#CBD5E1]'
                        }`}
                      >
                        <img 
                          src={thumb.url} 
                          alt={thumb.title} 
                          className="w-full h-11 object-cover rounded-lg" 
                        />
                        <span className="line-clamp-1 text-center w-full text-[10px]">{thumb.title}</span>
                      </button>
                    ))}
                  </div>
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
                        Model inferensi visi estimasi polutan
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FEE2E2] border border-[#FECACA] text-[#DC2626] text-[11px] font-bold">
                    <AlertTriangle size={12} />
                    <span>Darurat (97.4% Akurasi)</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRunAiAnalyzer}
                  disabled={isAnalyzing}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
                >
                  <Sparkles size={14} className={isAnalyzing ? 'animate-spin' : ''} />
                  <span>{isAnalyzing ? 'Memindai Citra Satelit & Visi...' : 'Uji Analisis AI'}</span>
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
                    <span className="font-bold text-[#1D4ED8]">± 290 m²</span>
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
                
                {/* Field 2: Lokasi */}
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

                {/* Field 3: Deskripsi */}
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <FileText size={14} className="text-[#1D4ED8]" />
                    <span>3. Deskripsi Kondisi & Dampak</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Deskripsikan kondisi timbunan sampah, jenis polutan, atau dampaknya terhadap nelayan..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] focus:border-[#1D4ED8] rounded-xl p-3 text-xs sm:text-sm text-[#0F172A] placeholder-slate-400 outline-none transition-colors resize-none leading-relaxed"
                    required
                  ></textarea>
                </div>

                {/* Field 4: Pelapor & Kontak */}
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
                      placeholder="Contoh: Bambang Sudirman"
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
                      placeholder="Contoh: 0812-8871-3321"
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
