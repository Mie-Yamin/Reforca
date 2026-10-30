import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Building2, 
  DollarSign, 
  Briefcase, 
  Calendar,
  X,
  Layers
} from 'lucide-react';
import { formatRupiah, formatRelativeDate } from '../data/mockFirestore';

export default function TransparencyHub({ reports = [] }) {
  const [selectedTransparencyReport, setSelectedTransparencyReport] = useState(null);
  const [beforeAfterToggleMap, setBeforeAfterToggleMap] = useState({});

  // Financial aggregates
  const totalAllocatedFunds = reports.reduce((acc, curr) => acc + (curr.costDetails?.totalCost || 0), 0);
  const completedReports = reports.filter(r => r.status === 'Completed' || r.citizenConfirmed);
  const totalCleanedAreaM2 = completedReports.reduce((acc, curr) => acc + (curr.aiAnalysis?.estimatedVolumeM2 || 0), 0);
  
  const completedWithCost = completedReports.filter(r => r.costDetails?.totalCost > 0);
  const averageCostPerM2 = totalCleanedAreaM2 > 0 && completedWithCost.length > 0
    ? Math.round(completedWithCost.reduce((acc, c) => acc + c.costDetails.totalCost, 0) / totalCleanedAreaM2)
    : 83636;

  const handleToggleBeforeAfter = (e, id, mode) => {
    e.stopPropagation();
    setBeforeAfterToggleMap(prev => ({ ...prev, [id]: mode }));
  };

  const getNormalizedStatus = (report) => {
    if (report.status === 'Completed' || report.citizenConfirmed) {
      return {
        label: 'Tuntas',
        type: 'tuntas',
        bgColor: 'bg-[#DCFCE7]',
        textColor: 'text-[#16A34A]',
        borderColor: 'border-[#BBF7D0]',
        dotColor: 'bg-[#16A34A]'
      };
    }
    return {
      label: 'Masa Perbaikan',
      type: 'perbaikan',
      bgColor: 'bg-[#FEF3C7]',
      textColor: 'text-[#D97706]',
      borderColor: 'border-[#FDE68A]',
      dotColor: 'bg-[#D97706]'
    };
  };

  return (
    <section 
      id="transparansi" 
      className="relative py-20 lg:py-28 bg-white border-b border-[#E2E8F0] overflow-hidden"
    >
      {/* Subtle Coastal Texture (Low-opacity 4% blended with #FFFFFF) */}
      <div 
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-[0.04] mix-blend-multiply"
        style={{
          backgroundImage: `url('/images/abyssal_trench.jpg')`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6" data-aos="fade-up">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] text-[#1D4ED8] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck size={14} />
              <span>Akuntabilitas Pesisir & Penggunaan Anggaran</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight">
              Transparansi Anggaran & Hasil Kerja
            </h2>
            <p className="text-[#64748B] text-sm sm:text-base leading-relaxed">
              Setiap titik lokasi pesisir disajikan transparan dengan foto dokumentasi, instansi penanggung jawab, vendor pelaksana, dan rincian alokasi anggaran langsung di dalam kotak laporan.
            </p>
          </div>
        </div>

        {/* 3 Metric Summary Banner Cards: Clean White Elements (#FFFFFF) with shadow-sm */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6" data-aos="fade-up">
          <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm">
            <span className="text-xs text-[#64748B] font-semibold block">Total Anggaran Pesisir Terpantau</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#1D4ED8] font-mono mt-1">
              {formatRupiah(totalAllocatedFunds)}
            </div>
            <span className="text-[11px] text-[#64748B] mt-1 block">Tervalidasi pada data sistem</span>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm">
            <span className="text-xs text-[#64748B] font-semibold block">Total Area Pantai Pulih Bersih</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#16A34A] font-mono mt-1">
              {totalCleanedAreaM2.toLocaleString('id-ID')} m²
            </div>
            <span className="text-[11px] text-[#64748B] mt-1 block">Bebas dari limbah padat</span>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm">
            <span className="text-xs text-[#64748B] font-semibold block">Rata-rata Efisiensi Biaya / m²</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] font-mono mt-1">
              {formatRupiah(averageCostPerM2)} / m²
            </div>
            <span className="text-[11px] text-[#64748B] mt-1 block">Termasuk evakuasi armada</span>
          </div>
        </div>

        {/* Layout Kotak Laporan Transparansi: Clean White Elements (#FFFFFF) with shadow-sm */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" data-aos="fade-up" data-aos-delay="100">
          {reports.map((report) => {
            const status = getNormalizedStatus(report);
            const currentMode = beforeAfterToggleMap[report.id] || (report.photoAfter ? 'after' : 'before');
            const activeImage = currentMode === 'after' && report.photoAfter ? report.photoAfter : report.photoBefore;

            return (
              <article
                key={report.id}
                onClick={() => setSelectedTransparencyReport(report)}
                className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Bagian Atas: Foto Dokumentasi Pesisir & Status Badge */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  <img
                    src={activeImage}
                    alt={report.locationName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>

                  {/* Switcher Foto Sebelum / Sesudah */}
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/95 backdrop-blur-xs p-1 rounded-xl border border-[#CBD5E1] shadow-xs">
                    <button
                      type="button"
                      onClick={(e) => handleToggleBeforeAfter(e, report.id, 'before')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        currentMode === 'before'
                          ? 'bg-[#1D4ED8] text-white shadow-xs'
                          : 'text-[#64748B] hover:text-[#0F172A]'
                      }`}
                    >
                      Sebelum
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleToggleBeforeAfter(e, report.id, 'after')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        currentMode === 'after'
                          ? 'bg-[#16A34A] text-white shadow-xs'
                          : 'text-[#64748B] hover:text-[#0F172A]'
                      }`}
                      disabled={!report.photoAfter}
                    >
                      Sesudah
                    </button>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border shadow-xs flex items-center gap-1.5 ${status.bgColor} ${status.textColor} ${status.borderColor}`}>
                      <span className={`w-2 h-2 rounded-full ${status.dotColor}`}></span>
                      <span>{status.label}</span>
                    </span>
                  </div>

                  {/* Lokasi Pesisir Tag */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-xs text-white font-medium bg-slate-900/75 backdrop-blur-xs px-2.5 py-1 rounded-lg w-fit">
                    <MapPin size={13} className="text-[#60A5FA] shrink-0" />
                    <span className="truncate">{report.locationName.split('(')[0]}</span>
                  </div>
                </div>

                {/* Konten Rincian Transparansi Lapangan */}
                <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    
                    {/* Tanggal & ID */}
                    <div className="flex items-center justify-between text-xs text-[#64748B]">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-[#1D4ED8]" />
                        <span>{formatRelativeDate(report.createdAt)}</span>
                      </div>
                      <span className="font-mono text-[11px] text-[#64748B]">{report.id}</span>
                    </div>

                    {/* Judul Titik Pantai */}
                    <h3 className="text-base sm:text-lg font-bold text-[#0F172A] group-hover:text-[#1D4ED8] transition-colors line-clamp-2">
                      {report.locationName}
                    </h3>

                    {/* Kotak Instansi Penanggung Jawab & Vendor Pelaksana */}
                    <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[#64748B] flex items-center gap-1 shrink-0">
                          <Building2 size={13} className="text-[#1D4ED8]" />
                          <span>Instansi PJ:</span>
                        </span>
                        <span className="font-bold text-[#0F172A] text-right line-clamp-1">
                          Dinas Lingkungan Hidup
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-2 pt-1.5 border-t border-[#E2E8F0]">
                        <span className="text-[#64748B] flex items-center gap-1 shrink-0">
                          <Briefcase size={13} className="text-[#16A34A]" />
                          <span>Vendor:</span>
                        </span>
                        <span className="font-semibold text-[#16A34A] text-right line-clamp-1">
                          {report.assignedVendor || "Sedang Ditugaskan"}
                        </span>
                      </div>
                    </div>

                    {/* Kotak Rincian Alokasi Anggaran */}
                    <div className="p-3.5 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#1E40AF] font-bold flex items-center gap-1">
                          <DollarSign size={13} />
                          <span>Alokasi Anggaran:</span>
                        </span>
                        <span className="font-mono font-extrabold text-sm text-[#1D4ED8]">
                          {report.costDetails?.totalCost > 0 
                            ? formatRupiah(report.costDetails.totalCost)
                            : "Estimasi (Rp 0)"}
                        </span>
                      </div>

                      {report.costDetails?.breakdown?.length > 0 && (
                        <div className="space-y-1 pt-1.5 border-t border-[#BFDBFE] text-[11px] text-[#334155]">
                          {report.costDetails.breakdown.slice(0, 2).map((item, i) => (
                            <div key={i} className="flex justify-between">
                              <span className="truncate pr-2">• {item.item}</span>
                              <span className="font-mono font-semibold text-[#1D4ED8] shrink-0">{formatRupiah(item.amount)}</span>
                            </div>
                          ))}
                          {report.costDetails.breakdown.length > 2 && (
                            <div className="text-[10px] text-[#1D4ED8] font-bold pt-0.5">
                              + {report.costDetails.breakdown.length - 2} rincian item lainnya
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Bagian Bawah: Validasi Warga & Tombol Detail */}
                  <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
                    {report.citizenConfirmed ? (
                      <span className="text-[#16A34A] font-semibold flex items-center gap-1">
                        <CheckCircle2 size={14} />
                        <span>Diverifikasi Warga</span>
                      </span>
                    ) : (
                      <span className="text-[#64748B] flex items-center gap-1">
                        <Clock size={14} />
                        <span>Dalam Validasi</span>
                      </span>
                    )}

                    <span className="text-[#1D4ED8] font-bold group-hover:translate-x-0.5 transition-transform">
                      Lihat Rincian &rarr;
                    </span>
                  </div>

                </div>
              </article>
            );
          })}
        </div>

      </div>

      {/* Pop-up Modal Detail Transparansi Anggaran & Nota (Clean White Card) */}
      {selectedTransparencyReport && (
        <div 
          className="fixed inset-0 z-[600] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setSelectedTransparencyReport(null)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-[#E2E8F0] shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-20 flex items-center justify-between p-5 sm:p-6 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getNormalizedStatus(selectedTransparencyReport).bgColor} ${getNormalizedStatus(selectedTransparencyReport).textColor} ${getNormalizedStatus(selectedTransparencyReport).borderColor}`}>
                  {getNormalizedStatus(selectedTransparencyReport).label}
                </span>
                <span className="text-xs text-[#64748B]">Nota Audit Lapangan</span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTransparencyReport(null)}
                className="p-2 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0] transition-colors"
                aria-label="Tutup jendela transparansi"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-7 space-y-6">
              <div>
                <h3 className="text-xl font-extrabold text-[#0F172A]">
                  {selectedTransparencyReport.locationName}
                </h3>
                <p className="text-xs text-[#64748B] mt-1">
                  Koordinat: {selectedTransparencyReport.coordinates.join(', ')}
                </p>
              </div>

              {/* Rincian Instansi & Vendor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <span className="text-xs text-[#64748B] block font-medium">Instansi Penanggung Jawab</span>
                  <span className="text-sm font-bold text-[#0F172A] block">
                    Dinas Lingkungan Hidup DKI Jakarta
                  </span>
                  <span className="text-[11px] text-[#64748B]">Divisi Pemantauan Pantai & Muara</span>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <span className="text-xs text-[#64748B] block font-medium">Vendor / Tim Pelaksana</span>
                  <span className="text-sm font-bold text-[#16A34A] block">
                    {selectedTransparencyReport.assignedVendor || "Sedang Dalam Proses Penugasan"}
                  </span>
                  <span className="text-[11px] text-[#64748B]">Mitra Pelaksana Lapangan</span>
                </div>
              </div>

              {/* Tabel Lengkap Rincian Item Anggaran */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                    <Layers size={14} className="text-[#1D4ED8]" />
                    <span>Rincian Penggunaan Anggaran</span>
                  </span>
                  <span className="font-mono text-xs font-extrabold text-[#1D4ED8]">
                    Total: {formatRupiah(selectedTransparencyReport.costDetails?.totalCost || 0)}
                  </span>
                </div>

                <div className="rounded-xl border border-[#E2E8F0] overflow-hidden bg-[#F8FAFC]">
                  {selectedTransparencyReport.costDetails?.breakdown?.length > 0 ? (
                    <div className="divide-y divide-[#E2E8F0]">
                      {selectedTransparencyReport.costDetails.breakdown.map((item, idx) => (
                        <div key={idx} className="p-3 flex items-center justify-between text-xs">
                          <span className="text-[#334155] font-medium">{item.item}</span>
                          <span className="font-mono font-bold text-[#0F172A]">{formatRupiah(item.amount)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-xs text-[#64748B] text-center">
                      Belum ada nota rincian item pengeluaran yang dicatatkan untuk lokasi ini.
                    </div>
                  )}
                </div>
              </div>

              {/* Status Konfirmasi */}
              <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#1E40AF] block">Verifikasi Lapangan Warga</span>
                  <span className="text-[#334155]">
                    {selectedTransparencyReport.citizenConfirmed
                      ? "Pekerjaan pembersihan telah disahkan oleh warga pesisir setempat."
                      : "Pekerjaan pembersihan masih dalam tahap peninjauan dan validasi komunitas."}
                  </span>
                </div>
                <span className="font-bold text-[#1D4ED8] shrink-0 ml-4">
                  {selectedTransparencyReport.votesCount} Dukungan
                </span>
              </div>

            </div>
          </div>
        </div>
      )}

    </section>
  );
}
