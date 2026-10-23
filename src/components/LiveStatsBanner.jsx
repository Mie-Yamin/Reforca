import React from 'react';
import { 
  FileCheck2, 
  CheckCircle, 
  Building, 
  Cpu, 
  Activity, 
  Radio 
} from 'lucide-react';

export default function LiveStatsBanner() {
  const metrics = [
    {
      value: "1,240+",
      label: "Laporan Terkirim",
      description: "Dari warga pesisir & komunitas bahari",
      icon: FileCheck2,
      accentColor: "#0A40F9",
    },
    {
      value: "88%",
      label: "Masalah Teratasi",
      description: "Pembersihan fisik & daur ulang selesai",
      icon: CheckCircle,
      accentColor: "#00E6A5",
    },
    {
      value: "45+",
      label: "Instansi & Vendor Terhubung",
      description: "Dinas LH, BKSDA, dan mitra pengolah limbah",
      icon: Building,
      accentColor: "#0A40F9",
    },
    {
      value: "24/7",
      label: "AI Verification System",
      description: "Validasi citra visi & estimasi polutan otomatis",
      icon: Cpu,
      accentColor: "#00E6A5",
    },
  ];

  return (
    <section className="w-full bg-[#010D64] border-y border-[#011480] py-12 relative overflow-hidden">
      {/* Background ambient water glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0A40F9] via-transparent to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Micro-label */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-[#011480]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E6A5] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00E6A5]"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#00E6A5]">
              Live Counter & Metrik Efektivitas Reforca
            </span>
          </div>

          <div className="text-[11px] text-[#F8FAFC]/70 hidden sm:flex items-center gap-1.5 font-medium">
            <Radio size={14} className="text-[#00E6A5]" />
            <span>Sinkronisasi Otomatis Google Cloud Firestore</span>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="rounded-2xl p-6 bg-[#020746]/80 border border-[#011480] hover:border-[#0A40F9] transition-all duration-300 hover:-translate-y-1 shadow-xl group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${item.accentColor}20`, color: item.accentColor }}
                  >
                    <Icon size={24} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#010D64] text-white/70 border border-[#011480]">
                    Verified
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-3xl sm:text-4xl font-black text-white font-sans tracking-tight">
                    {item.value}
                  </div>
                  <div className="text-sm font-bold text-[#F8FAFC] flex items-center gap-1">
                    <span>{item.label}</span>
                  </div>
                  <p className="text-xs text-[#F8FAFC]/65 leading-relaxed pt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
