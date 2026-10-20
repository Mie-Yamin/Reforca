import React, { useState } from 'react';
import { 
  DollarSign, 
  ShieldCheck, 
  FileSpreadsheet, 
  Download, 
  ExternalLink, 
  Building2, 
  PieChart, 
  CheckCircle2, 
  Clock, 
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { formatRupiah } from '../data/mockFirestore';

export default function TransparencyHub({ reports }) {
  const [expandedReportId, setExpandedReportId] = useState(null);

  // Calculate aggregated financial metrics
  const totalAllocatedFunds = reports.reduce((acc, curr) => acc + (curr.costDetails?.totalCost || 0), 0);
  const totalCleanedAreaM2 = reports
    .filter(r => r.status === 'Completed')
    .reduce((acc, curr) => acc + (curr.aiAnalysis?.estimatedVolumeM2 || 0), 0);
  
  const completedReportsWithBudget = reports.filter(r => r.status === 'Completed' && r.costDetails?.totalCost > 0);
  const averageCostPerM2 = totalCleanedAreaM2 > 0 
    ? Math.round(completedReportsWithBudget.reduce((acc, c) => acc + c.costDetails.totalCost, 0) / totalCleanedAreaM2)
    : 0;

  const toggleExpand = (id) => {
    setExpandedReportId(expandedReportId === id ? null : id);
  };

  const handleDownloadAuditJson = () => {
    const auditData = {
      platform: "Reforca (Report For Care) - Civic Marine Accountability",
      timestamp: new Date().toISOString(),
      governance: "Dinas Lingkungan Hidup DKI Jakarta & Forum Transparansi Pesisir",
      totalAllocatedFunds,
      totalCleanedAreaM2,
      records: reports.map(r => ({
        id: r.id,
        location: r.locationName,
        status: r.status,
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
    a.download = `reforca_transparansi_anggaran_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8" data-aos="fade-up">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/25 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Prinsip Open Data & Akuntabilitas Anggaran Pesisir</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Hub Transparansi Publik & Audit Operasional
            </h3>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Setiap rupiah yang dialokasikan oleh APBD Dinas Lingkungan Hidup, CSR mitra swasta, maupun donasi komunitas dipublikasikan secara terbuka dengan rincian item, vendor penanggung jawab, dan status verifikasi langsung warga.
            </p>
          </div>

          <button
            onClick={handleDownloadAuditJson}
            className="self-start lg:self-center px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <Download size={15} />
            <span>Unduh Berkas Audit (JSON)</span>
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-800">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Total Anggaran Pesisir Terpantau</span>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
              {formatRupiah(totalAllocatedFunds)}
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Di seluruh titik Teluk Jakarta</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Total Area Pantai Terverifikasi Bersih</span>
            <div className="text-xl sm:text-2xl font-black text-cyan-400 mt-1">
              {totalCleanedAreaM2.toLocaleString('id-ID')} m²
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Pulih dari polutan anorganik</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Rata-Rata Biaya Penanganan / m²</span>
            <div className="text-xl sm:text-2xl font-black text-teal-400 mt-1">
              {formatRupiah(averageCostPerM2)} / m²
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Termasuk evakuasi & daur ulang</span>
          </div>
        </div>
      </div>

      {/* Itemized Transparency Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <FileSpreadsheet size={18} className="text-teal-400" />
            <span>Rincian Biaya & Rekanan Vendor Tiap Lokasi Pantai</span>
          </h4>
          <span className="text-xs text-slate-400">Klik baris untuk melihat nota rincian item</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Titik Lokasi Pantai</th>
                <th className="py-3.5 px-4">Status & Verifikasi</th>
                <th className="py-3.5 px-4">Vendor Pelaksana</th>
                <th className="py-3.5 px-4 text-right">Alokasi Biaya (IDR)</th>
                <th className="py-3.5 px-4 text-center">Rincian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {reports.map((report) => {
                const isExpanded = expandedReportId === report.id;
                const hasCost = report.costDetails?.totalCost > 0;

                return (
                  <React.Fragment key={report.id}>
                    <tr 
                      onClick={() => toggleExpand(report.id)}
                      className="hover:bg-slate-900/50 cursor-pointer transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-100">{report.locationName}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Pelapor: {report.reporterName}</div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold w-fit ${
                            report.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300' :
                            report.status === 'In Progress' ? 'bg-cyan-500/20 text-cyan-300' :
                            'bg-amber-500/20 text-amber-300'
                          }`}>
                            {report.status}
                          </span>
                          {report.citizenConfirmed && (
                            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                              <CheckCircle2 size={11} /> Diverifikasi Warga
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-slate-300">
                        {report.assignedVendor || <span className="text-slate-500 italic">Belum Ditugaskan</span>}
                      </td>

                      <td className="py-4 px-4 text-right font-bold text-sm text-slate-100">
                        {hasCost ? (
                          <span className="text-emerald-400 font-mono">{formatRupiah(report.costDetails.totalCost)}</span>
                        ) : (
                          <span className="text-slate-500 font-normal">Tahap Estimasi (Rp 0)</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <button className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white">
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </td>
                    </tr>

                    {/* Collapsible Cost Breakdown Row */}
                    {isExpanded && (
                      <tr className="bg-slate-950/70">
                        <td colSpan={5} className="p-4 sm:p-6">
                          <div className="rounded-2xl bg-slate-900/80 border border-teal-500/30 p-4 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                              <h5 className="font-bold text-white text-xs flex items-center gap-2">
                                <DollarSign size={14} className="text-emerald-400" />
                                <span>Rincian Pengeluaran Anggaran: {report.locationName}</span>
                              </h5>
                              <span className="text-xs text-slate-400">Total: <strong className="text-emerald-300 font-mono">{formatRupiah(report.costDetails?.totalCost || 0)}</strong></span>
                            </div>

                            {report.costDetails?.breakdown?.length > 0 ? (
                              <div className="space-y-2">
                                {report.costDetails.breakdown.map((item, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-slate-950/60 border border-slate-800">
                                    <span className="text-slate-300">{item.item}</span>
                                    <span className="font-mono font-bold text-emerald-400">{formatRupiah(item.amount)}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-slate-500 italic">
                                Belum ada rincian biaya yang dicatatkan untuk laporan ini. Menunggu input administrasi instansi penanggung jawab.
                              </p>
                            )}

                            <div className="text-[11px] text-slate-400 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80 flex items-start gap-2">
                              <Info size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                              <span>
                                Pengawasan publik: Jika warga menemukan ketidaksesuaian antara pengerjaan fisik di lapangan dan rincian biaya di atas, Anda dapat mengajukan sanggahan langsung melalui kanal verifikasi warga.
                              </span>
                            </div>
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
  );
}
