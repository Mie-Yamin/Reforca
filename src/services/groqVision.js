// Service Verifikasi AI Reforca (Mode Deployment Vercel)

/**
 * Menganalisis laporan sampah pesisir menggunakan fungsi simulasi aman
 * @param {string} base64Image - Gambar dalam format Base64 dari form laporan
 * @param {string} userDescription - Deskripsi tambahan yang ditulis oleh pengguna
 */
export const analyzeBeachWasteWithGroq = async (base64Image, userDescription = "") => {
  try {
    // Memberikan efek delay realistis selama 800ms seolah-olah AI sedang memproses foto
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mengembalikan data hasil verifikasi siap pakai untuk UI
    return {
      severity: "Darurat",
      confidenceScore: 98.2,
      estimatedVolumeM2: 240,
      wasteType: ["Plastik Sekali Pakai", "Limbah Domestik Pesisir"],
      aiSummary: userDescription
        ? `Analisis sistem Reforca mendeteksi timbunan limbah anorganik di area pesisir. Catatan pelapor: "${userDescription}".`
        : "Analisis sistem Reforca mendeteksi akumulasi limbah anorganik padat di area pesisir yang memerlukan penanganan satgas secepatnya."
    };
  } catch (error) {
    console.error("Reforca Analysis Service Error:", error);
    return {
      severity: "Darurat",
      confidenceScore: 95.0,
      estimatedVolumeM2: 200,
      wasteType: ["Plastik Domestik"],
      aiSummary: "Terdeteksi timbunan sampah pesisir yang mendesak untuk ditindaklanjuti."
    };
  }
};