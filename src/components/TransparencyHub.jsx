import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  Clock, 
  Layers,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { formatRupiah } from '../data/mockFirestore';

export default function TransparencyHub({ reports = [] }) {
  const [expandedReportId, setExpandedReportId] = useState(reports[0]?.id || null);
  const [beforeAfterToggleMap, setBeforeAfterToggleMap] = useState({});

  // Financial aggregates
  const totalAllocatedFunds = reports.reduce((acc, curr) => acc + (curr.costDetails?.totalCost || 0), 0);
  const completedReports = reports.filter(r => r.status === 'Completed');
  const totalCleanedAreaM2 = completedReports.reduce((acc, curr) => acc + (curr.aiAnalysis?.estimatedVolumeM2 || 0), 0);
  
  const completedWithCost = completedReports.filter(r => r.costDetails?.totalCost > 0);
  const averageCostPerM2 = totalCleanedAreaM2 > 0 && completedWithCost.length > 0
    ? Math.round(completedWithCost.reduce((acc, c) => acc + c.costDetails.totalCost, 0) / totalCleanedAreaM2)
    : 83636;

  const toggleExpand = (id) => {
    setExpandedReportId(expandedReportId === id ? null : id);
  };

  const handleToggleBeforeAfter = (id, mode) => {
    setBeforeAfterToggleMap(prev => ({ ...prev, [id]: mode }));
  };

  const handleDownloadAuditJson = () => {
    const auditData = {
      platform: "Reforca (Report For Care): Civic Marine Accountability",
      timestamp: new Date().toISOString(),
      governance: "Dinas Lingkungan Hidup & Forum Transparansi Pesisir",
      totalAllocatedFunds,
      totalCleanedAreaM2,
      records: reports.map(r => ({
        id: r.id,
        location: r.locationName,
        status: r.status,
        authority: "Dinas Lingkungan Hidup DKI Jakarta",
        vendor: r.assignedVendor,
        totalCost: r.costDetails?.totalCost || 0,
        costBreakdown: r.costDetails?.breakdown || [],
        citizenVerified: r.citizenConfirmed,
        votesSupport: r.votesCount
      }))
    };

    const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reforca_audit_transparansi_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Specific highlighted cards for Before/After showcase
  const showcaseReports = reports.slice(0, 3);

  return (
    <section id="akuntabilitas" className="w-full bg-[#010D64] py-16 lg:py-24 border-t border-[#011480]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#020746] border border-[#0121B6] text-[#00E6A5] text-xs font-bold">
              <ShieldCheck size={14} />
              <span>Section Transparansi & Akuntabilitas (Accountability & Cost Detail)</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Keterbukaan Anggaran & Hasil Kerja
            </h2>
            <p className="text-sm sm:text-base text-[#F8FAFC]/75 max-w-2xl font-normal">
              Setiap penanganan titik sampah dipublikasikan lengkap dengan foto perbandingan Before/After, instansi penanggung jawab, vendor pelaksana, dan rincian alokasi biaya per item.
            </p>
          </div>

          <button
            onClick={handleDownloadAuditJson}
            className="self-start lg:self-center px-5 py-3 rounded-xl bg-[#020746] hover:bg-[#0A40F9] text-[#00E6A5] hover:text-white border border-[#0121B6] text-xs font-bold flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <Download size={16} />
            <span>Unduh Berkas Audit (JSON)</span>
          </button>
        </div>

        {/* 3 Metric Summary Banner Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#020746] border border-[#011480] shadow-xl">
            <span className="text-xs text-[#F8FAFC]/70 font-semibold block">Total Anggaran Pesisir Terpantau</span>
            <div className="text-2xl sm:text-3xl font-black text-[#00E6A5] font-mono mt-1">
              {formatRupiah(totalAllocatedFunds)}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Tercatat di basis data Firestore BaaS</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#020746] border border-[#011480] shadow-xl">
            <span className="text-xs text-[#F8FAFC]/70 font-semibold block">Total Area Pantai Pulih Bersih</span>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
              {totalCleanedAreaM2.toLocaleString('id-ID')} m²
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Terbebas dari polutan anorganik</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#020746] border border-[#011480] shadow-xl">
            <span className="text-xs text-[#F8FAFC]/70 font-semibold block">Rata-Rata Efisiensi Biaya / m²</span>
            <div className="text-2xl sm:text-3xl font-black text-[#0A40F9] font-mono mt-1">
              {formatRupiah(averageCostPerM2)} / m²
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Termasuk evakuasi & daur ulang</span>
          </div>
        </div>

        {/* TAMPILAN KARTU DETAIL PENANGANAN (BEFORE/AFTER + INSTANSI + VENDOR + BIAYA) */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers size={18} className="text-[#00E6A5]" />
            <span>Kartu Dokumentasi Penanganan Titik Pesisir</span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {showcaseReports.map((report) => {
              const currentMode = beforeAfterToggleMap[report.id] || (report.photoAfter ? 'after' : 'before');
              const activeImage = currentMode === 'after' && report.photoAfter ? report.photoAfter : report.photoBefore;

              return (
                <div 
                  key={report.id}
                  className="rounded-2xl bg-[#020746] border border-[#011480] overflow-hidden flex flex-col justify-between shadow-2xl hover:border-[#0A40F9] transition-all group"
                >
                  {/* Photo Before/After Area */}
                  <div className="relative h-56 w-full bg-[#010D64] overflow-hidden">
                    <img 
                      src={activeImage} 
                      alt={report.locationName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020746] via-transparent to-transparent"></div>

                    {/* Before / After Toggle Buttons */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 bg-[#020746]/90 backdrop-blur-md p-1 rounded-xl border border-[#0121B6]">
                        <button
                          type="button"
                          onClick={() => handleToggleBeforeAfter(report.id, 'before')}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            currentMode === 'before'
                              ? 'bg-[#E53E3E] text-white shadow-sm'
                              : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          Before (Kotor)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleBeforeAfter(report.id, 'after')}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            currentMode === 'after'
                              ? 'bg-[#00E6A5] text-[#020746] shadow-sm font-black'
                              : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          After (Bersih) ✨
                        </button>
                      </div>

                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur ${
                        report.status === 'Completed' ? 'bg-[#00E6A5]/20 text-[#00E6A5] border border-[#00E6A5]' :
                        report.status === 'In Progress' ? 'bg-[#0A40F9]/20 text-[#0A40F9] border border-[#0A40F9]' :
                        'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]'
                      }`}>
                        {report.status}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="text-sm font-bold text-white line-clamp-1">
                        {report.locationName}
                      </h4>
                    </div>
                  </div>

                  {/* Card Body Details */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    
                    {/* Instansi Penanggung Jawab & Vendor Pelaksana */}
                    <div className="space-y-2.5">
                      <div className="p-3 rounded-xl bg-[#011480]/50 border border-[#0121B6] space-y-2 text-xs">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-slate-400 text-[11px]">Instansi PJ:</span>
                          <span className="text-white font-bold text-right text-[11px]">
                            Dinas Lingkungan Hidup DKI Jakarta
                          </span>
                        </div>

                        <div className="flex items-start justify-between gap-2 pt-1 border-t border-[#0121B6]/60">
                          <span className="text-slate-400 text-[11px]">Vendor Pelaksana:</span>
                          <span className="text-[#00E6A5] font-semibold text-right text-[11px]">
                            {report.assignedVendor || "Sedang Ditugaskan"}
                          </span>
                        </div>
                      </div>

                      {/* Rincian Anggaran Transparansi */}
                      <div className="p-3 rounded-xl bg-[#010D64] border border-[#011480] space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-300 font-medium">Alokasi Anggaran:</span>
                          <span className="font-mono font-bold text-sm text-[#00E6A5]">
                            {report.costDetails?.totalCost > 0 
                              ? formatRupiah(report.costDetails.totalCost)
                              : "Tahap Estimasi (Rp 0)"}
                          </span>
                        </div>

                        {report.costDetails?.breakdown?.length > 0 && (
                          <div className="space-y-1 pt-1.5 border-t border-[#011480]">
                            {report.costDetails.breakdown.slice(0, 2).map((item, i) => (
                              <div key={i} className="flex justify-between text-[11px] text-slate-300">
                                <span className="line-clamp-1">• {item.item}</span>
                                <span className="font-mono text-white/90 shrink-0 ml-2">{formatRupiah(item.amount)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Status & Verification */}
                    <div className="pt-3 border-t border-[#011480] flex items-center justify-between text-[11px]">
                      {report.citizenConfirmed ? (
                        <span className="text-[#00E6A5] font-semibold flex items-center gap-1">
                          <CheckCircle2 size={13} />
                          <span>Diverifikasi Warga</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 flex items-center gap-1">
                          <Clock size={13} />
                          <span>Dalam Proses Validasi</span>
                        </span>
                      )}

                      <span className="text-[#0A40F9] font-bold">
                        {report.votesCount} Suara Warga
                      </span>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabel Lengkap Transparansi Anggaran Seluruh Titik */}
        <div className="rounded-2xl bg-[#020746] border border-[#011480] overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-[#011480] flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <FileSpreadsheet size={16} className="text-[#00E6A5]" />
              <span>Daftar Transparansi Anggaran Tiap Lokasi Titik Sampah Pesisir</span>
            </h4>
            <span className="text-xs text-slate-400">Klik baris untuk melihat detail nota</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#010D64] text-slate-300 uppercase tracking-wider font-semibold border-b border-[#011480]">
                <tr>
                  <th className="py-3 px-4">Titik Lokasi Pantai</th>
                  <th className="py-3 px-4">Instansi Penanggung Jawab</th>
                  <th className="py-3 px-4">Vendor Pelaksana</th>
                  <th className="py-3 px-4 text-right">Alokasi Biaya (IDR)</th>
                  <th className="py-3 px-4 text-center">Rincian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#011480]">
                {reports.map((report) => {
                  const isExpanded = expandedReportId === report.id;
                  const hasCost = report.costDetails?.totalCost > 0;

                  return (
                    <React.Fragment key={report.id}>
                      <tr 
                        onClick={() => toggleExpand(report.id)}
                        className="hover:bg-[#011480]/50 cursor-pointer transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{report.locationName}</div>
                          <div className="text-[11px] text-slate-400">Pelapor: {report.reporterName}</div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-200">
                          Dinas Lingkungan Hidup DKI Jakarta
                        </td>

                        <td className="py-3.5 px-4 text-[#00E6A5] font-medium">
                          {report.assignedVendor || "Sedang Ditugaskan"}
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                          {hasCost ? formatRupiah(report.costDetails.totalCost) : "Tahap Estimasi (Rp 0)"}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <button className="p-1 rounded-lg bg-[#011480] text-white">
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-[#010D64]/80">
                          <td colSpan={5} className="p-4 sm:p-5">
                            <div className="rounded-xl bg-[#020746] border border-[#0121B6] p-4 space-y-3">
                              <div className="flex items-center justify-between border-b border-[#011480] pb-2">
                                <span className="font-bold text-white text-xs">
                                  Rincian Item Anggaran: {report.locationName}
                                </span>
                                <span className="text-xs font-mono font-bold text-[#00E6A5]">
                                  Total: {formatRupiah(report.costDetails?.totalCost || 0)}
                                </span>
                              </div>

                              {report.costDetails?.breakdown?.length > 0 ? (
                                <div className="space-y-1.5">
                                  {report.costDetails.breakdown.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-xs py-1 px-2.5 rounded bg-[#010D64] border border-[#011480]">
                                      <span className="text-slate-300">{item.item}</span>
                                      <span className="font-mono text-[#00E6A5] font-bold">{formatRupiah(item.amount)}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-slate-400 italic">
                                  Belum ada nota rincian pengeluaran yang dicatatkan untuk titik ini.
                                </p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
