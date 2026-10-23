import React from 'react';
import { TrendingUp, CheckCircle, Building2 } from 'lucide-react';

export default function ImpactStatsBar() {
  const stats = [
    {
      value: "1,240+",
      label: "Laporan Terkirim",
      description: "Dari warga pesisir & komunitas bahari",
      icon: TrendingUp,
    },
    {
      value: "88%",
      label: "Masalah Teratasi",
      description: "Pembersihan lapangan diverifikasi warga",
      icon: CheckCircle,
    },
    {
      value: "45+",
      label: "Instansi Terhubung",
      description: "Dinas LH, pelabuhan, dan mitra daerah",
      icon: Building2,
    },
  ];

  return (
    <section className="w-full bg-[#FFFFFF] border-y border-[#E2E8F0] py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0]">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx}
                className={`flex items-center gap-4 ${idx > 0 ? 'pt-6 md:pt-0 md:pl-8' : ''}`}
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                <div className="w-13 h-13 p-3.5 rounded-2xl bg-[#EFF6FF] text-[#1D4ED8] flex items-center justify-center shrink-0 border border-[#DBEAFE]">
                  <Icon size={26} />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-sm font-bold text-[#1E293B]">
                    {stat.label}
                  </div>
                  <div className="text-xs text-[#64748B]">
                    {stat.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
