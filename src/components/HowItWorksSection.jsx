import React from 'react';
import { 
  Camera, 
  Cpu, 
  Building2, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Kirim Laporan",
      subtitle: "Dokumentasi Lapangan Warga",
      description: "Warga mengambil foto bukti timbunan sampah pantai, memilih titik koordinat pesisir, dan menjelaskan dampaknya terhadap aktivitas perikanan atau ekosistem laut.",
      icon: Camera,
      tag: "Partisipasi Warga",
      accent: "#0A40F9"
    },
    {
      number: "02",
      title: "Analisis AI",
      subtitle: "AI Vision & Polutan Matrix",
      description: "Model visi komputer mendeteksi jenis limbah polimer secara otomatis, menghitung estimasi luas area terdampak (m²), dan menetapkan tingkat urgensi penanganan.",
      icon: Cpu,
      tag: "Inferensi Instan",
      accent: "#00E6A5"
    },
    {
      number: "03",
      title: "Tindak Lanjut Instansi",
      subtitle: "Pengerahan Tim Lapangan",
      description: "Dinas Lingkungan Hidup menugaskan armada dan vendor rekanan untuk evakuasi sampah fisik, dengan pencatatan alokasi biaya penanganan yang dapat diaudit publik.",
      icon: Building2,
      tag: "Akuntabilitas Biaya",
      accent: "#0A40F9"
    },
    {
      number: "04",
      title: "Konfirmasi Warga",
      subtitle: "Verifikasi Kebersihan Final",
      description: "Setelah pembersihan rampung, foto kondisi After diunggah dan komunitas pesisir memverifikasi kebersihan pantai secara langsung untuk memastikan hasil tuntas.",
      icon: CheckCircle2,
      tag: "Transparansi Terbuka",
      accent: "#00E6A5"
    }
  ];

  return (
    <section id="fitur" className="w-full bg-[#020746] py-16 lg:py-24 relative overflow-hidden">
      {/* Background soft ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#0A40F9]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#011480] border border-[#0121B6] text-[#00E6A5] text-xs font-bold">
            <Sparkles size={14} />
            <span>Alur Pelaporan & Siklus Penanganan 4 Langkah</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Bagaimana Reforca Bekerja
          </h2>
          <p className="text-sm sm:text-base text-[#F8FAFC]/75 leading-relaxed font-normal">
            Menghubungkan suara masyarakat dan tindakan cepat instansi pemerintah melalui siklus kerja 4 tahap yang transparan, terukur, dan akuntabel.
          </p>
        </div>

        {/* 4 Steps Grid with Connective Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx}
                className="rounded-2xl p-6 bg-[#010D64] border border-[#011480] hover:border-[#0A40F9] transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between space-y-5 relative group"
              >
                {/* Step Top Bar: Number & Icon */}
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black font-sans text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00E6A5]">
                    {step.number}
                  </span>
                  
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-md"
                    style={{ backgroundColor: `${step.accent}20`, color: step.accent, border: `1px solid ${step.accent}40` }}
                  >
                    <Icon size={22} />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <div className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-[#020746] text-[#00E6A5] border border-[#011480]">
                    {step.tag}
                  </div>
                  <h3 className="text-lg font-extrabold text-white leading-snug">
                    {step.title}
                  </h3>
                  <h4 className="text-xs font-semibold text-[#F8FAFC]/80">
                    {step.subtitle}
                  </h4>
                  <p className="text-xs text-[#F8FAFC]/65 leading-relaxed pt-1">
                    {step.description}
                  </p>
                </div>

                {/* Bottom Step Progression Indicator */}
                <div className="pt-3 border-t border-[#011480] flex items-center justify-between text-[11px] text-[#F8FAFC]/60">
                  <span>Tahap {idx + 1} dari 4</span>
                  {idx < 3 ? (
                    <span className="text-[#00E6A5] font-bold flex items-center gap-1">
                      Lanjut <ArrowRight size={12} />
                    </span>
                  ) : (
                    <span className="text-[#00E6A5] font-bold flex items-center gap-1">
                      Selesai Sempurna ✨
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Assurance Banner */}
        <div className="p-4 rounded-2xl bg-[#010D64]/70 border border-[#011480] max-w-2xl mx-auto flex items-center justify-center gap-3 text-xs text-white text-center">
          <ShieldCheck size={18} className="text-[#00E6A5] shrink-0" />
          <span>Setiap tahapan tercatat pada log BaaS terbuka yang dapat dipantau oleh seluruh masyarakat.</span>
        </div>

      </div>
    </section>
  );
}
