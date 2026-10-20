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
  AlertCircle, 
  Trash2, 
  Image as ImageIcon,
  Activity,
  Layers,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const PRESET_BEACHES = [
  { name: "Pesisir Muara Angke (Hutan Mangrove & Muara Kali Adem)", coords: [-6.1108, 106.7731] },
  { name: "Pantai Marunda (Pesisir Cilincing, Jakarta Utara)", coords: [-6.0984, 106.9642] },
  { name: "Pantai Karnaval & Kawasan Tanggul Marina Ancol", coords: [-6.1215, 106.8491] },
  { name: "Pantai Pasir Perawan (Pulau Pari, Kepulauan Seribu)", coords: [-5.8622, 106.6214] },
  { name: "Pantai Untung Jawa (Pesisir Dermaga Sakura)", coords: [-5.9782, 106.7041] },
  { name: "Pesisir Tanjung Pasir (Muara Teluknaga)", coords: [-6.0152, 106.6789] },
  { name: "Pantai Mutiara (Pesisir Pluit / Waduk Pluit)", coords: [-6.1136, 106.7915] }
];

const PRESET_IMAGES = [
  {
    label: "Sampah Plastik & Jaring Terjebak Mangrove",
    url: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=1000&q=80",
    mockAi: {
      severity: "Darurat",
      wasteType: ["Plastik Sekali Pakai", "Jaring Nelayan (Ghost Nets)", "Styrofoam Pecahan", "Tali Tambang Plastik"],
      estimatedVolumeM2: 290,
      confidenceScore: 97.4,
      aiSummary: "ANALISIS GROQ LLAMA-3: Terdeteksi kerapatan sampah anorganik tinggi (>40 kg/m²) yang mengikat pneumatofora (akar napas) mangrove. Urgensi DARURAT karena berisiko mematikan tegakan mangrove dalam 14 hari.",
      recommendedActions: [
        "Pengerahan tim evakuasi manual berpelampung",
        "Pengangkutan tongkang limbah pesisir",
        "Pemasangan jaring barrier terapung"
      ]
    }
  },
  {
    label: "Tumpukan Sampah Domestik Garis Pantai Pasang",
    url: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1000&q=80",
    mockAi: {
      severity: "Tinggi",
      wasteType: ["Kantong Kresek", "Limbah Kemasan Sachet", "Kemasan Minuman Kaca", "Tekstil Basah"],
      estimatedVolumeM2: 185,
      confidenceScore: 94.8,
      aiSummary: "ANALISIS GROQ LLAMA-3: Penumpukan sampah kiriman arus pasang laut. Ditemukan serpihan kaca dan limbah mikro berpotensi mencemari pasang surut.",
      recommendedActions: [
        "Pembersihan menggunakan tim sapu pesisir",
        "Penyortiran limbah pecahan kaca terpisah",
        "Penyediaan drop box limbah di bibir pantai"
      ]
    }
  },
  {
    label: "Serpihan Mikro & Makro Plastik Pesisir Wisata",
    url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1000&q=80",
    mockAi: {
      severity: "Sedang",
      wasteType: ["Sedotan Plastik", "Tutup Botol PET", "Serpihan Foam Putih"],
      estimatedVolumeM2: 85,
      confidenceScore: 92.1,
      aiSummary: "ANALISIS GROQ LLAMA-3: Kepadatan polutan sedang, dominasi pecahan plastik berukuran 2-10 cm. Memerlukan alat ayakan pasir (beach sand-sifter).",
      recommendedActions: [
        "Pembersihan metode ayakan pasir manual",
        "Pemasangan signage edukasi turis bahari"
      ]
    }
  }
];

export default function PublicReportForm({ onSubmitReport }) {
  const [selectedBeach, setSelectedBeach] = useState(PRESET_BEACHES[0].name);
  const [customBeachName, setCustomBeachName] = useState('');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [photoUrl, setPhotoUrl] = useState(PRESET_IMAGES[0].url);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);

  // AI Inference State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [inferenceTokensPerSec, setInferenceTokensPerSec] = useState(0);
  const [aiResult, setAiResult] = useState(PRESET_IMAGES[0].mockAi);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Handle Preset Image Change
  const handleSelectPreset = (index) => {
    setSelectedPresetIndex(index);
    setPhotoUrl(PRESET_IMAGES[index].url);
    setAiResult(null); // Reset AI to encourage running analyzer
  };

  // Simulate Groq Llama 3 Inference
  const handleRunAiAnalyzer = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(15);
    setInferenceTokensPerSec(485);

    const stepInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 90) {
          clearInterval(stepInterval);
          return 95;
        }
        return prev + 25;
      });
      setInferenceTokensPerSec(Math.floor(480 + Math.random() * 80));
    }, 180);

    setTimeout(() => {
      clearInterval(stepInterval);
      setAnalysisProgress(100);
      setIsAnalyzing(false);

      // Pick corresponding or dynamically generated AI result
      const activePreset = PRESET_IMAGES[selectedPresetIndex] || PRESET_IMAGES[0];
      setAiResult({
        ...activePreset.mockAi,
        aiSummary: `[GROQ LPU INFERENCE / LLAMA-3 VISION 70B]\n${activePreset.mockAi.aiSummary}\nLokasi terkonfirmasi di zona koordinat pesisir Teluk Jakarta.`
      });
    }, 1200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!reporterName.trim() || !description.trim()) {
      alert("Mohon lengkapi nama pelapor dan deskripsi temuan sampah pantai.");
      return;
    }

    const beachObj = PRESET_BEACHES.find(b => b.name === selectedBeach) || {
      name: customBeachName || selectedBeach,
      coords: [-6.10, 106.82]
    };

    const finalReport = {
      id: `reforca_doc_${Date.now()}`,
      locationName: customBeachName ? customBeachName : beachObj.name,
      coordinates: beachObj.coords,
      description: description,
      photoBefore: photoUrl,
      photoAfter: null,
      reporterName: reporterName,
      reporterContact: reporterContact || "Tidak dicantumkan",
      aiAnalysis: aiResult || {
        severity: "Sedang",
        wasteType: ["Plastik Campuran", "Sampah Pesisir"],
        estimatedVolumeM2: 120,
        confidenceScore: 88.0,
        aiSummary: "Analisis otomatis default berdasarkan parameter foto.",
        recommendedActions: ["Pembersihan manual tim kebersihan pesisir"]
      },
      status: "Pending",
      assignedVendor: "Menunggu Penugasan Dinas LH / Vendor",
      costDetails: {
        totalCost: 0,
        breakdown: []
      },
      votesCount: 1, // Automatic first vote from reporter
      citizenConfirmed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSubmitReport(finalReport);
    setIsSubmittedSuccess(true);

    // Reset Form
    setTimeout(() => {
      setIsSubmittedSuccess(false);
      setDescription('');
      setCustomBeachName('');
    }, 3500);
  };

  return (
    <div className="relative glass-panel rounded-3xl p-6 sm:p-8 border border-teal-500/25 shadow-2xl overflow-hidden" data-aos="fade-up">
      {/* Decorative gradient blur */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-2">
            <Sparkles size={14} className="text-teal-400 animate-spin-slow" />
            <span>Form Pelaporan Warga Mandiri — BaaS Firestore Ready</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Laporkan Titik Kritis Sampah Pesisir
          </h3>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Unggah bukti foto pantai, jalankan analisis instan Groq AI LPU, dan pantau proses verifikasi anggaran serta tindakan nyata pemerintah secara transparan.
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-slate-900/80 rounded-xl border border-slate-700/60 text-xs text-slate-300">
          <ShieldCheck size={16} className="text-emerald-400" />
          <span>Terbuka & Akuntabel</span>
        </div>
      </div>

      {isSubmittedSuccess ? (
        <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center animate-fade-in my-6">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-300 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-400/30">
            <CheckCircle2 size={36} />
          </div>
          <h4 className="text-xl font-bold text-white mb-2">Laporan Berhasil Diterbitkan ke Feed Publik!</h4>
          <p className="text-sm text-emerald-200/90 max-w-lg mx-auto mb-4">
            Dokumen laporan Anda telah terdaftar di koleksi Firestore publik Reforca. Warga lain kini dapat memberikan upvote dukungan, dan tim pengawas instansi dapat memasukkannya ke dalam AI Priority Matrix.
          </p>
          <span className="inline-block text-xs font-medium text-emerald-400 bg-emerald-950 px-3 py-1.5 rounded-lg border border-emerald-500/20">
            Status: Menunggu Penugasan Dinas / Vendor (Pending)
          </span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Image Selection & Groq AI Analyzer */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <label className="block text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ImageIcon size={14} />
                  1. Foto Bukti Sampah Pantai (Before)
                </label>

                {/* Main Preview Container */}
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 border-2 border-dashed border-teal-500/40 group">
                  <img 
                    src={photoUrl} 
                    alt="Pratinjau Sampah Pesisir" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex items-end p-4">
                    <span className="text-xs text-slate-200 font-medium bg-slate-900/80 px-2.5 py-1 rounded-lg backdrop-blur border border-slate-700">
                      Resolusi Kamera Lapangan Siap Analisis
                    </span>
                  </div>
                </div>

                {/* Preset Selector */}
                <div className="mt-3">
                  <span className="text-xs text-slate-400 block mb-1.5 font-medium">
                    Atau gunakan contoh foto kondisi pesisir nyata:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPreset(idx)}
                        className={`text-left p-1.5 rounded-xl border text-[11px] leading-tight transition-all flex flex-col items-center gap-1 ${
                          selectedPresetIndex === idx
                            ? 'bg-teal-950/80 border-teal-400 text-teal-200 font-semibold ring-2 ring-teal-500/30'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <img src={preset.url} alt="" className="w-full h-12 object-cover rounded-lg" />
                        <span className="line-clamp-1 text-center">{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* GROQ AI ANALYZER SIMULATOR BUTTON */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-teal-950/60 border border-teal-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-teal-500/20 text-teal-300 rounded-lg">
                      <Cpu size={16} />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">Groq LPU Inference (Llama 3 70B)</h5>
                      <p className="text-[10px] text-teal-400/80">Analisis visi otomatis jenis sampah & volume</p>
                    </div>
                  </div>

                  {aiResult && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      aiResult.severity === 'Darurat' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                      aiResult.severity === 'Tinggi' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                      'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    }`}>
                      {aiResult.severity}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleRunAiAnalyzer}
                  disabled={isAnalyzing}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
                    isAnalyzing
                      ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                      : 'bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-black shadow-glow-teal hover:scale-[1.01]'
                  }`}
                >
                  <Sparkles size={16} className={isAnalyzing ? 'animate-spin' : ''} />
                  <span>{isAnalyzing ? 'Menganalisis Foto (Groq LPU Processing...)' : 'Simulasi Groq AI Analyzer'}</span>
                </button>

                {isAnalyzing && (
                  <div className="space-y-1.5 pt-1">
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-teal-400 to-cyan-400 h-1.5 rounded-full transition-all duration-200"
                        style={{ width: `${analysisProgress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-cyan-400 font-mono">
                      <span>Memindai polimer & densitas debris...</span>
                      <span>{inferenceTokensPerSec} T/s • {analysisProgress}%</span>
                    </div>
                  </div>
                )}

                {/* AI Result Cards */}
                {aiResult && !isAnalyzing && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-teal-500/20 text-xs space-y-2 animate-fade-in">
                    <div className="flex items-center justify-between text-[11px] border-b border-slate-800 pb-1.5">
                      <span className="text-slate-400">Tingkat Urgensi AI:</span>
                      <span className={`font-bold ${
                        aiResult.severity === 'Darurat' ? 'text-rose-400' :
                        aiResult.severity === 'Tinggi' ? 'text-amber-400' : 'text-cyan-400'
                      }`}>
                        {aiResult.severity} ({aiResult.confidenceScore || 95}% Akurasi)
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] border-b border-slate-800 pb-1.5">
                      <span className="text-slate-400">Estimasi Luas Area:</span>
                      <span className="font-semibold text-white">± {aiResult.estimatedVolumeM2} m²</span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1">Klasifikasi Sampah:</span>
                      <div className="flex flex-wrap gap-1">
                        {aiResult.wasteType.map((w, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-teal-950 text-teal-300 border border-teal-500/30">
                            {w}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-300 italic bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                      "{aiResult.aiSummary}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Form Fields & Details */}
            <div className="lg:col-span-7 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Beach Location Selector */}
                <div>
                  <label className="block text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <MapPin size={14} />
                    2. Lokasi Pantai / Titik Pesisir
                  </label>
                  <select
                    value={selectedBeach}
                    onChange={(e) => setSelectedBeach(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700 focus:border-teal-400 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-colors"
                  >
                    {PRESET_BEACHES.map((b, idx) => (
                      <option key={idx} value={b.name}>{b.name}</option>
                    ))}
                    <option value="CUSTOM">+ Lokasi Pantai Lainnya (Tulis Manual)</option>
                  </select>

                  {selectedBeach === 'CUSTOM' && (
                    <input
                      type="text"
                      placeholder="Contoh: Pantai Mutiara Barat, Dermaga Kali Baru"
                      value={customBeachName}
                      onChange={(e) => setCustomBeachName(e.target.value)}
                      className="mt-2 w-full bg-slate-900 border border-teal-500/40 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-teal-400"
                      required
                    />
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <FileText size={14} />
                    3. Deskripsi Kondisi & Dampak Warga
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Ceritakan detail kondisi timbunan sampah, jenis bau, dampak terhadap perahu nelayan, biota laut, atau ekosistem bakau sekitar..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700 focus:border-teal-400 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors"
                    required
                  ></textarea>
                </div>

                {/* Reporter Info (Public Accountability) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <User size={14} />
                      4. Nama Pelapor / Komunitas
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Rizky Pratama (Warga Pesisir)"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      className="w-full bg-slate-900/90 border border-slate-700 focus:border-teal-400 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Phone size={14} />
                      Kontak / No. WhatsApp (Untuk Verifikasi)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 0812-xxxx-xxxx"
                      value={reporterContact}
                      onChange={(e) => setReporterContact(e.target.value)}
                      className="w-full bg-slate-900/90 border border-slate-700 focus:border-teal-400 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-slate-800">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-teal-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <UploadCloud size={20} />
                  <span>Kirim Laporan Resmi ke Reforca BaaS</span>
                  <ChevronRight size={18} />
                </button>
                <p className="text-[11px] text-slate-400 text-center mt-2">
                  Laporan akan langsung diterbitkan secara transparan ke peta interaktif dan berhak mendapatkan voting warga.
                </p>
              </div>
            </div>

          </div>
        </form>
      )}
    </div>
  );
}
