/**
 * Reforca - Mock Firestore BaaS Store
 * Struktur data 1:1 mengikuti Google Cloud Firestore Documents & Collections
 */

export const INITIAL_REPORTS = [
  {
    id: "reforca_doc_001",
    locationName: "Pesisir Muara Angke (Hutan Mangrove & Muara Kali Adem)",
    coordinates: [-6.1108, 106.7731],
    description: "Timbunan sampah plastik kiriman dan jaring nelayan terbengkalai (ghost nets) menjerat akar mangrove seluas lebih dari 300 meter persegi. Berisiko mematikan bibit mangrove dan mencemari tambak warga sekitar.",
    photoBefore: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=1000&q=80",
    photoAfter: null,
    reporterName: "Bambang Sudirman",
    reporterContact: "+62 812-8871-3321",
    aiAnalysis: {
      severity: "Darurat",
      wasteType: ["Plastik Sekali Pakai", "Jaring Hanyut (Ghost Nets)", "Styrofoam", "Limbah Kemasan"],
      estimatedVolumeM2: 320,
      confidenceScore: 94.6,
      aiSummary: "Tingkat keparahan KRITIS. Ditemukan akumulasi polimer plastik berat dan jaring sintetis yang menyumbat sirkulasi air pasang-surut mangrove. Dibutuhkan tim evakuasi manual berpelampung dan perahu pengangkut sampah.",
      recommendedActions: [
        "Pengerahan perahu katamaran pengangkut sampah",
        "Penggunaan gunting jaring bawah air untuk melepaskan akar mangrove",
        "Pemasangan jaring barrier terapung di mulut muara"
      ]
    },
    status: "In Progress",
    assignedVendor: "Dinas Lingkungan Hidup DKI Jakarta & Trash Hero Jakarta",
    costDetails: {
      totalCost: 18500000,
      breakdown: [
        { item: "Sewa 3 Perahu Katamaran Pembersih Muara (3 hari)", amount: 7500000 },
        { item: "Honorarium & APD 30 Petugas Pasukan Oranye Pesisir", amount: 6000000 },
        { item: "Pengangkutan Kontainer ke TPST Bantargebang & TPS 3R", amount: 3500000 },
        { item: "Pemasangan Trash Boom / Barrier Sementara", amount: 1500000 }
      ]
    },
    votesCount: 246,
    citizenConfirmed: false,
    createdAt: "2026-10-14T08:30:00Z",
    updatedAt: "2026-10-18T14:15:00Z"
  },
  {
    id: "reforca_doc_002",
    locationName: "Pantai Marunda (Ujung Pesisir Cilincing, Jakarta Utara)",
    coordinates: [-6.0984, 106.9642],
    description: "Garis pantai dipenuhi sampah domestik, limbah kain, botol kaca, dan serpihan styrofoam yang terdampar akibat gelombang pasang rob. Bau menyengat dan mengganggu aktivitas nelayan serta anak-anak pesisir.",
    photoBefore: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1000&q=80",
    photoAfter: null,
    reporterName: "Siti Rahmawati (Forum Warga Marunda)",
    reporterContact: "+62 856-9120-4490",
    aiAnalysis: {
      severity: "Darurat",
      wasteType: ["Limbah Tekstil", "Botol Kaca/B3", "Styrofoam Pecahan", "Sampah Domestik"],
      estimatedVolumeM2: 480,
      confidenceScore: 96.2,
      aiSummary: "Tingkat keparahan DARURAT TINGGI. Ditemukan serpihan tajam dan sampah padat menyatu dengan lumpur pantai. Berpotensi menimbulkan bahaya kesehatan kulit dan pencemaran biota laut mikro.",
      recommendedActions: [
        "Pembersihan menggunakan mini-excavator pesisir beroda rantai karet",
        "Pemisahan limbah tajam dan B3 dengan wadah khusus",
        "Pemberian drum komunal di dermaga nelayan"
      ]
    },
    status: "Pending",
    assignedVendor: "Belum Ditugaskan",
    costDetails: {
      totalCost: 0,
      breakdown: []
    },
    votesCount: 389,
    citizenConfirmed: false,
    createdAt: "2026-10-16T11:20:00Z",
    updatedAt: "2026-10-16T11:20:00Z"
  },
  {
    id: "reforca_doc_003",
    locationName: "Pantai Pasir Perawan (Pulau Pari, Kepulauan Seribu Selatan)",
    coordinates: [-5.8622, 106.6214],
    description: "Area pesisir pasir putih sempat tercemar serpihan mikroplastik dan sampah plastik turis yang terbawa arus laut barat. Telah dilakukan operasi pembersihan gotong royong dan pemilahan daur ulang terpadu.",
    photoBefore: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1000&q=80",
    photoAfter: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
    reporterName: "Kapten Darmawan (Pokdarwis Pari)",
    reporterContact: "+62 813-1002-8971",
    aiAnalysis: {
      severity: "Sedang",
      wasteType: ["Mikroplastik", "Sedotan & Tutup Botol", "Pecahan Plastik Keras"],
      estimatedVolumeM2: 110,
      confidenceScore: 91.8,
      aiSummary: "Tingkat keparahan SEDANG. Polutan didominasi fraksi plastik kecil di permukaan pasir. Efektif dibersihkan dengan metode beach-sifting manual dan saringan pasir.",
      recommendedActions: [
        "Operasi beach sifting pasir halus",
        "Penyediaan tempat sampah terpilah per 20 meter bibir pantai",
        "Edukasi wisatawan bahari"
      ]
    },
    status: "Completed",
    assignedVendor: "Kelompok Sadar Wisata Pulau Pari & Kolaborasi Swasta Laut Lestari",
    costDetails: {
      totalCost: 9200000,
      breakdown: [
        { item: "Pengadaan 10 Unit Ayakan Pasir Khusus Mikroplastik", amount: 2800000 },
        { item: "Operasional 15 Relawan & Nelayan Lokal (2 Hari)", amount: 3500000 },
        { item: "Transportasi Kapal Muatan Sampah Terpilah ke Marina", amount: 2400000 },
        { item: "Plang Edukasi & Tempat Sampah Tematik", amount: 500000 }
      ]
    },
    votesCount: 178,
    citizenConfirmed: true,
    createdAt: "2026-10-08T09:00:00Z",
    updatedAt: "2026-10-15T16:40:00Z"
  },
  {
    id: "reforca_doc_004",
    locationName: "Pantai Karnaval & Kawasan Tanggul Marina Ancol",
    coordinates: [-6.1215, 106.8491],
    description: "Akumulasi sampah sachet makanan, puntung rokok, dan kemasan gelas plastik di sepanjang celah tanggul pemecah ombak (breakwater) setelah liburan akhir pekan.",
    photoBefore: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=1000&q=80",
    photoAfter: null,
    reporterName: "Hendro Wijaya (Komunitas Peduli Teluk)",
    reporterContact: "+62 878-3341-2098",
    aiAnalysis: {
      severity: "Tinggi",
      wasteType: ["Plastik Sachet", "Gelas Plastik Sekali Pakai", "Puntung Rokok", "Aluminium Can"],
      estimatedVolumeM2: 195,
      confidenceScore: 93.1,
      aiSummary: "Tingkat keparahan TINGGI. Sampah terjepit di sela batuan tetrapod pemecah gelombang, menyulitkan pembersihan manual dan berpotensi tergerus menjadi mikroplastik ke laut lepas.",
      recommendedActions: [
        "Pembersihan menggunakan penjepit panjang teleskopik",
        "Penempatan safety netting di belakang area pedagang",
        "Sosialisasi larangan plastik sekali pakai di area publik"
      ]
    },
    status: "In Progress",
    assignedVendor: "PT Pembangunan Jaya Ancol Bersih & LH Pademangan",
    costDetails: {
      totalCost: 12400000,
      breakdown: [
        { item: "Peralatan Safety & Penjepit Teleskopik 20 Unit", amount: 3400000 },
        { item: "Petugas Pembersih Tanggul Berpengalaman (5 Hari)", amount: 5500000 },
        { item: "Sewa Dump Truck Pengangkut ke Bank Sampah", amount: 3500000 }
      ]
    },
    votesCount: 165,
    citizenConfirmed: false,
    createdAt: "2026-10-12T13:45:00Z",
    updatedAt: "2026-10-17T10:00:00Z"
  },
  {
    id: "reforca_doc_005",
    locationName: "Pesisir Tanjung Pasir (Perbatasan Muara Teluknaga)",
    coordinates: [-6.0152, 106.6789],
    description: "Gelontoran sampah batang pohon, styrofoam pendingin ikan, dan plastik kemasan menumpuk di dermaga perahu penyeberangan warga ke Kepulauan Seribu.",
    photoBefore: "https://images.unsplash.com/photo-1562077772-3ab121825b15?auto=format&fit=crop&w=1000&q=80",
    photoAfter: null,
    reporterName: "Ahmad Zulkarnaen",
    reporterContact: "+62 811-9922-381",
    aiAnalysis: {
      severity: "Tinggi",
      wasteType: ["Styrofoam Box Ikan", "Batang Kayu & Organik", "Plastik Tebal HDPE"],
      estimatedVolumeM2: 260,
      confidenceScore: 89.4,
      aiSummary: "Tingkat keparahan TINGGI. Berisiko mengganggu baling-baling kapal penumpang dan mencemari alur pelayaran perahu rakyat.",
      recommendedActions: [
        "Evakuasi sampah kayu dan boks styrofoam dengan crane dermaga",
        "Pemberian area drop-off limbah perikanan"
      ]
    },
    status: "Pending",
    assignedVendor: "Belum Ditugaskan",
    costDetails: {
      totalCost: 0,
      breakdown: []
    },
    votesCount: 98,
    citizenConfirmed: false,
    createdAt: "2026-10-17T07:15:00Z",
    updatedAt: "2026-10-17T07:15:00Z"
  }
];

// Helper: Hitung kalkulasi Skor Prioritas AI Matrix
export function calculatePriorityScore(report) {
  const severityWeights = {
    "Darurat": 100,
    "Tinggi": 65,
    "Sedang": 35,
    "Rendah": 15
  };
  const severityScore = severityWeights[report.aiAnalysis?.severity] || 20;
  const votesBonus = (report.votesCount || 0) * 1.5;
  const volumeBonus = Math.min((report.aiAnalysis?.estimatedVolumeM2 || 0) * 0.2, 50);
  
  // Status pending gets higher priority in queue than already completed
  const statusMultiplier = report.status === "Pending" ? 1.3 : report.status === "In Progress" ? 1.0 : 0.2;
  
  return Math.round((severityScore + votesBonus + volumeBonus) * statusMultiplier);
}

// Helper: Format Rupiah
export function formatRupiah(amount) {
  if (!amount || isNaN(amount)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount);
}

// Helper: Format Waktu Relatif
export function formatRelativeDate(isoDate) {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Hari ini";
  if (diffDays === 1) return "Kemarin";
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}
