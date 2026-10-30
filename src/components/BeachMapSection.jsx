import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Layers, 
  Compass, 
  Filter, 
  ShieldCheck,
  Search,
  TrendingUp,
  CheckCircle,
  Building2
} from 'lucide-react';

export default function BeachMapSection({ reports = [], onSelectReport }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  const [urgencyFilter, setUrgencyFilter] = useState('ALL');
  const [selectedReportId, setSelectedReportId] = useState(reports[0]?.id || null);
  const [searchTerm, setSearchTerm] = useState('');

  // Live Stats Metrics
  const completedCount = reports.filter(r => r.status === 'Completed').length;

  const liveStats = [
    {
      value: "1.240+",
      label: "Laporan Terkirim",
      description: `${reports.length} laporan terpantau di sistem`,
      icon: TrendingUp,
    },
    {
      value: "88%",
      label: "Masalah Teratasi",
      description: `${completedCount} lokasi diverifikasi tuntas`,
      icon: CheckCircle,
    },
    {
      value: "45+",
      label: "Instansi & Mitra",
      description: "Dinas LH, pelabuhan, dan komunitas warga",
      icon: Building2,
    },
  ];

  // Filtered reports
  const filteredReports = reports.filter(r => {
    const matchUrgency = urgencyFilter === 'ALL' || r.aiAnalysis?.severity === urgencyFilter;
    const matchSearch = r.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchUrgency && matchSearch;
  });

  // Initialize Leaflet Map (Light Minimalist Positron Tile)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [-6.06, 106.80],
        zoom: 11,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // CartoDB Positron light matter tile layer (Soft Coastal Minimalist)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Sync Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const layer = markersLayerRef.current;
    layer.clearLayers();

    filteredReports.forEach((report) => {
      const isDarurat = report.aiAnalysis?.severity === 'Darurat';
      const isCompleted = report.status === 'Completed';

      let pinBgClass = 'bg-[#DC2626] border-white shadow-md';
      let pinLabel = 'Darurat';

      if (isCompleted) {
        pinBgClass = 'bg-[#16A34A] border-white shadow-md';
        pinLabel = 'Teratasi';
      } else if (!isDarurat) {
        pinBgClass = 'bg-[#D97706] border-white shadow-md';
        pinLabel = 'Tinggi';
      }

      const isCurrentActive = selectedReportId === report.id;

      const customIcon = L.divIcon({
        className: 'custom-reforca-pin',
        html: `
          <div class="relative cursor-pointer flex items-center justify-center">
            ${isDarurat && !isCompleted ? '<div class="absolute -inset-2 rounded-full bg-rose-500/40 animate-ping"></div>' : ''}
            <div class="w-8 h-8 rounded-full ${pinBgClass} border-2 flex items-center justify-center text-white shadow-md transition-transform ${isCurrentActive ? 'scale-125 ring-4 ring-[#1D4ED8]' : 'hover:scale-110'}">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div class="absolute -top-1 -right-1 bg-[#0F172A] border border-[#CBD5E1] text-[9px] font-bold px-1.5 py-0.2 rounded-full text-white">
              ${report.votesCount}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      const marker = L.marker(report.coordinates, { icon: customIcon });

      const popupHtml = `
        <div class="p-2 min-w-[220px] max-w-[260px] text-[#0F172A] font-sans">
          <div class="relative h-24 rounded-lg overflow-hidden mb-2 bg-[#F8FAFC]">
            <img src="${report.photoBefore}" alt="${report.locationName}" class="w-full h-full object-cover" />
            <span class="absolute top-1.5 left-1.5 text-[9px] font-bold px-2 py-0.5 rounded-full text-white ${
              isCompleted ? 'bg-[#16A34A]' : isDarurat ? 'bg-[#DC2626]' : 'bg-[#D97706]'
            }">
              ${pinLabel}
            </span>
          </div>
          <h4 class="font-bold text-xs text-[#0F172A] leading-tight mb-1">${report.locationName}</h4>
          <p class="text-[11px] text-[#64748B] line-clamp-2 mb-2">${report.description}</p>
          <div class="flex items-center justify-between text-[11px] text-[#475569] border-t border-[#E2E8F0] pt-1.5">
            <span class="text-[#1D4ED8] font-semibold">${report.votesCount} Dukungan</span>
            <span>Est. ${report.aiAnalysis?.estimatedVolumeM2 || 0} m²</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        setSelectedReportId(report.id);
      });

      layer.addLayer(marker);
    });
  }, [filteredReports, selectedReportId]);

  const handleCardClick = (report) => {
    setSelectedReportId(report.id);
    if (mapInstanceRef.current && report.coordinates) {
      mapInstanceRef.current.flyTo(report.coordinates, 13, { duration: 1.0 });
    }
    if (onSelectReport) {
      onSelectReport(report);
    }
  };

  return (
    <section 
      id="peta-laporan" 
      className="relative w-full py-16 lg:py-24 bg-white border-b border-[#E2E8F0] overflow-hidden"
    >
      {/* Subtle Coastal Sea Texture (Low-opacity 4% blended with #FFFFFF) */}
      <div 
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-[0.04] mix-blend-multiply"
        style={{
          backgroundImage: `url('/images/split_water_ocean.jpg')`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4" data-aos="fade-up">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] text-[#1D4ED8] text-xs font-bold mb-2">
              <MapPin size={14} />
              <span>Peta Interaktif & Metrik Data Real-Time</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Peta Sebaran Titik Kritis & Pantauan Lapangan
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] max-w-md md:text-right">
            Sistem informasi geospasial interaktif pesisir Indonesia. Pantau laporan titik sampah, tingkat kedaruratan, serta penanganan lapangan secara langsung.
          </p>
        </div>

        {/* Live Stats Metric Cards: Clean White Elements (#FFFFFF) with shadow-sm */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6" data-aos="fade-up">
          {liveStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex items-center gap-4 transition-all hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] border border-[#DBEAFE] text-[#1D4ED8] flex items-center justify-center shrink-0">
                  <Icon size={24} />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
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

        {/* Main Grid: Interactive Map + Side Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch" data-aos="fade-up" data-aos-delay="100">
          
          {/* Kolom Peta Interaktif (Leaflet) */}
          <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-[#E2E8F0] bg-white relative shadow-sm min-h-[480px] lg:min-h-[560px] flex flex-col">
            
            {/* Top Map Floating Filter Bar */}
            <div className="absolute top-4 left-4 right-4 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              <div className="pointer-events-auto flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-[#CBD5E1] shadow-sm">
                <span className="text-[11px] font-bold text-[#0F172A] px-2 flex items-center gap-1">
                  <Filter size={12} className="text-[#1D4ED8]" />
                  <span>Filter:</span>
                </span>
                
                {['ALL', 'Darurat', 'Tinggi'].map((urg) => (
                  <button
                    key={urg}
                    onClick={() => setUrgencyFilter(urg)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      urgencyFilter === urg
                        ? urg === 'Darurat'
                          ? 'bg-[#DC2626] text-white shadow-xs'
                          : urg === 'Tinggi'
                          ? 'bg-[#D97706] text-white shadow-xs'
                          : 'bg-[#1D4ED8] text-white shadow-xs'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    {urg === 'ALL' ? 'Semua' : urg}
                  </button>
                ))}
              </div>

              {/* Reset to Center Button */}
              <button
                type="button"
                onClick={() => {
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.flyTo([-6.06, 106.80], 11, { duration: 1.0 });
                  }
                }}
                className="pointer-events-auto p-2 rounded-xl bg-white/95 hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#1D4ED8] shadow-sm transition-colors"
                title="Pusatkan Peta ke Teluk Jakarta"
                aria-label="Pusatkan Peta ke Teluk Jakarta"
              >
                <Compass size={16} />
              </button>
            </div>

            {/* Map Container Target */}
            <div ref={mapContainerRef} className="w-full flex-1 z-[100]" />

            {/* Bottom Color Legend Bar */}
            <div className="bg-white border-t border-[#E2E8F0] p-3 px-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#334155]">
              <span className="font-bold text-[#0F172A] flex items-center gap-1.5">
                <Layers size={14} className="text-[#1D4ED8]" />
                <span>Legenda Pin GIS:</span>
              </span>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1.5 text-[#334155] font-medium">
                  <span className="w-3 h-3 rounded-full bg-[#DC2626] inline-block shadow-xs"></span>
                  <span>Merah: Kritis / Darurat</span>
                </span>
                <span className="flex items-center gap-1.5 text-[#334155] font-medium">
                  <span className="w-3 h-3 rounded-full bg-[#D97706] inline-block shadow-xs"></span>
                  <span>Amber: Tinggi / Sedang</span>
                </span>
                <span className="flex items-center gap-1.5 text-[#334155] font-medium">
                  <span className="w-3 h-3 rounded-full bg-[#16A34A] inline-block shadow-xs"></span>
                  <span>Hijau: Teratasi</span>
                </span>
              </div>
            </div>

          </div>

          {/* Kolom Panel Samping: Daftar Titik Laporan Warga */}
          <div className="lg:col-span-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm p-4 sm:p-5 flex flex-col justify-between space-y-4 max-h-[560px]">
            
            {/* Header Panel */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <div>
                  <h3 className="text-sm font-extrabold text-[#0F172A]">
                    Daftar Titik Laporan Warga
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    Klik kartu untuk memusatkan peta lokasi
                  </p>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#1D4ED8] border border-[#DBEAFE]">
                  {filteredReports.length} Laporan
                </span>
              </div>

              {/* Search Box */}
              <div className="relative mt-3">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari pantai atau lokasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#1D4ED8] rounded-xl pl-8 pr-3 py-2 text-xs text-[#0F172A] placeholder-slate-400 outline-none"
                />
              </div>
            </div>

            {/* Scrollable Cards List */}
            <div className="overflow-y-auto space-y-2.5 pr-1 flex-1 custom-scroll">
              {filteredReports.map((report) => {
                const isSelected = selectedReportId === report.id;
                const isDarurat = report.aiAnalysis?.severity === 'Darurat';
                const isCompleted = report.status === 'Completed';

                return (
                  <div
                    key={report.id}
                    onClick={() => handleCardClick(report)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#EFF6FF] border-[#1D4ED8] shadow-xs ring-1 ring-[#1D4ED8]'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <img 
                        src={report.photoBefore} 
                        alt={report.locationName} 
                        className="w-14 h-14 rounded-lg object-cover shrink-0 border border-[#E2E8F0]"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            isCompleted ? 'bg-[#DCFCE7] text-[#16A34A]' :
                            isDarurat ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {isCompleted ? 'Selesai' : report.aiAnalysis?.severity || 'Darurat'}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {report.votesCount} Upvote
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-[#0F172A] line-clamp-1 leading-snug">
                          {report.locationName}
                        </h4>

                        <p className="text-[11px] text-[#64748B] line-clamp-1">
                          {report.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredReports.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-400">
                  Tidak ada laporan yang cocok dengan pencarian.
                </div>
              )}
            </div>

            {/* Verification Note */}
            <div className="pt-2 border-t border-[#E2E8F0] text-[11px] text-[#64748B] flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#16A34A] shrink-0" />
              <span>Data lokasi tervalidasi koordinat satelit GPS akurat.</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
