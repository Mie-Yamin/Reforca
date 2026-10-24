import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Layers, 
  Compass, 
  Filter, 
  ShieldCheck,
  Search
} from 'lucide-react';

export default function BeachMapSection({ reports = [], onSelectReport }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  const [urgencyFilter, setUrgencyFilter] = useState('ALL');
  const [selectedReportId, setSelectedReportId] = useState(reports[0]?.id || null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtered reports
  const filteredReports = reports.filter(r => {
    const matchUrgency = urgencyFilter === 'ALL' || r.aiAnalysis?.severity === urgencyFilter;
    const matchSearch = r.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchUrgency && matchSearch;
  });

  // Initialize Leaflet Map
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

      // CartoDB Dark Matter tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
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

      // Warna Pin: Merah (Darurat), Oranye (Tinggi / Sedang), Hijau (Completed / Teratasi)
      let pinColor = '#E53E3E'; // Merah
      let pinBgClass = 'bg-[#E53E3E] border-[#FFFFFF] shadow-glow-rose';
      let pinLabel = 'Darurat';

      if (isCompleted) {
        pinColor = '#00E6A5'; // Hijau
        pinBgClass = 'bg-[#00E6A5] border-[#FFFFFF] shadow-glow-teal';
        pinLabel = 'Teratasi';
      } else if (!isDarurat) {
        pinColor = '#f59e0b'; // Oranye
        pinBgClass = 'bg-[#f59e0b] border-[#FFFFFF] shadow-md';
        pinLabel = 'Tinggi';
      }

      const isCurrentActive = selectedReportId === report.id;

      const customIcon = L.divIcon({
        className: 'custom-reforca-pin',
        html: `
          <div class="relative cursor-pointer flex items-center justify-center">
            ${isDarurat && !isCompleted ? '<div class="absolute -inset-2 rounded-full bg-[#E53E3E]/40 animate-ping"></div>' : ''}
            <div class="w-8 h-8 rounded-full ${pinBgClass} border-2 flex items-center justify-center text-white shadow-xl transition-transform ${isCurrentActive ? 'scale-125 ring-4 ring-[#00E6A5]' : 'hover:scale-110'}">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${pinColor === '#00E6A5' ? '#020746' : '#FFFFFF'}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div class="absolute -top-1 -right-1 bg-[#020746] border border-[#011480] text-[9px] font-bold px-1.5 py-0.2 rounded-full text-[#00E6A5]">
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
        <div class="p-2 min-w-[220px] max-w-[260px] text-[#F8FAFC]">
          <div class="relative h-24 rounded-lg overflow-hidden mb-2 bg-[#020746]">
            <img src="${report.photoBefore}" alt="${report.locationName}" class="w-full h-full object-cover" />
            <span class="absolute top-1.5 left-1.5 text-[9px] font-bold px-2 py-0.5 rounded-full text-white" style="background-color: ${pinColor}">
              ${pinLabel}
            </span>
          </div>
          <h4 class="font-bold text-xs text-white leading-tight mb-1">${report.locationName}</h4>
          <p class="text-[11px] text-slate-300 line-clamp-2 mb-2">${report.description}</p>
          <div class="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-700 pt-1.5">
            <span class="text-[#00E6A5] font-semibold">${report.votesCount} Dukungan</span>
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
    <section id="peta-laporan" className="w-full bg-[#010D64] py-16 lg:py-20 border-y border-[#011480]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#020746] border border-[#0121B6] text-[#00E6A5] text-xs font-bold mb-2">
              <MapPin size={14} />
              <span>Section Peta Laporan Real-Time (GIS Map Preview)</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Peta Sebaran Titik Kritis Pencemaran Pesisir
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#F8FAFC]/75 max-w-md md:text-right">
            Sistem informasi geospasial interaktif pesisir Indonesia. Pantau laporan titik sampah, tingkat kedaruratan, serta penanganan lapangan.
          </p>
        </div>

        {/* Main Grid: Interactive Map + Side Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Kolom Peta Interaktif (Leaflet) */}
          <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-[#011480] bg-[#020746] relative shadow-2xl min-h-[480px] lg:min-h-[580px] flex flex-col">
            
            {/* Top Map Floating Filter Bar */}
            <div className="absolute top-4 left-4 right-4 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              <div className="pointer-events-auto flex items-center gap-1.5 bg-[#020746]/90 backdrop-blur-md p-1.5 rounded-xl border border-[#0121B6] shadow-lg">
                <span className="text-[11px] font-bold text-[#F8FAFC] px-2 flex items-center gap-1">
                  <Filter size={12} className="text-[#00E6A5]" />
                  <span>Pin:</span>
                </span>
                
                {['ALL', 'Darurat', 'Tinggi'].map((urg) => (
                  <button
                    key={urg}
                    onClick={() => setUrgencyFilter(urg)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      urgencyFilter === urg
                        ? urg === 'Darurat'
                          ? 'bg-[#E53E3E] text-white shadow-sm'
                          : urg === 'Tinggi'
                          ? 'bg-[#f59e0b] text-white shadow-sm'
                          : 'bg-[#0A40F9] text-white'
                        : 'text-[#F8FAFC]/70 hover:text-white'
                    }`}
                  >
                    {urg === 'ALL' ? 'Semua' : urg}
                  </button>
                ))}
              </div>

              {/* Reset to Center Button */}
              <button
                onClick={() => {
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.flyTo([-6.06, 106.80], 11, { duration: 1.0 });
                  }
                }}
                className="pointer-events-auto p-2 rounded-xl bg-[#020746]/90 hover:bg-[#0A40F9] border border-[#0121B6] text-white shadow-lg transition-colors"
                title="Pusatkan Peta ke Teluk Jakarta"
              >
                <Compass size={16} className="text-[#00E6A5]" />
              </button>
            </div>

            {/* Map Container Target */}
            <div ref={mapContainerRef} className="w-full flex-1 z-[100]" />

            {/* Bottom Color Legend Bar */}
            <div className="bg-[#020746] border-t border-[#011480] p-3 px-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#F8FAFC]/80">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Layers size={14} className="text-[#00E6A5]" />
                <span>Legenda Pin GIS:</span>
              </span>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1.5 text-white font-medium">
                  <span className="w-3 h-3 rounded-full bg-[#E53E3E] inline-block shadow"></span>
                  <span>Merah: Kritis / Darurat</span>
                </span>
                <span className="flex items-center gap-1.5 text-white font-medium">
                  <span className="w-3 h-3 rounded-full bg-[#f59e0b] inline-block shadow"></span>
                  <span>Oranye: Tinggi / Sedang</span>
                </span>
                <span className="flex items-center gap-1.5 text-white font-medium">
                  <span className="w-3 h-3 rounded-full bg-[#00E6A5] inline-block shadow"></span>
                  <span>Hijau: Teratasi / Selesai</span>
                </span>
              </div>
            </div>

          </div>

          {/* Kolom Panel Samping (Sidebar Daftar Laporan Terbaru Warga) */}
          <div className="lg:col-span-4 rounded-2xl bg-[#020746] border border-[#011480] shadow-2xl p-4 flex flex-col justify-between space-y-4 max-h-[580px]">
            
            {/* Panel Samping Header */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#011480]">
                <div>
                  <h3 className="text-sm font-extrabold text-white">
                    Daftar Laporan Terbaru Warga
                  </h3>
                  <p className="text-[11px] text-[#F8FAFC]/70">
                    Klik kartu untuk memusatkan peta lokasi
                  </p>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#010D64] text-[#00E6A5] border border-[#0121B6]">
                  {filteredReports.length} Laporan
                </span>
              </div>

              {/* Search Box */}
              <div className="relative mt-3">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari pantai atau wilayah..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#010D64] border border-[#011480] focus:border-[#00E6A5] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 outline-none"
                />
              </div>
            </div>

            {/* Scrollable Cards List */}
            <div className="overflow-y-auto space-y-3 pr-1 flex-1 custom-scroll">
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
                        ? 'bg-[#010D64] border-[#00E6A5] shadow-lg ring-1 ring-[#00E6A5]/50'
                        : 'bg-[#011480]/40 border-[#011480] hover:bg-[#011480]/80'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <img 
                        src={report.photoBefore} 
                        alt={report.locationName} 
                        className="w-16 h-16 rounded-lg object-cover shrink-0 border border-[#0121B6]"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${
                            isCompleted ? 'bg-[#00E6A5]/20 text-[#00E6A5]' :
                            isDarurat ? 'bg-[#E53E3E]/20 text-[#E53E3E]' : 'bg-[#f59e0b]/20 text-[#f59e0b]'
                          }`}>
                            {isCompleted ? 'Selesai' : report.aiAnalysis?.severity || 'Darurat'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {report.votesCount} Upvote
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-white line-clamp-1 leading-snug">
                          {report.locationName}
                        </h4>

                        <p className="text-[11px] text-[#F8FAFC]/70 line-clamp-1">
                          {report.description}
                        </p>

                        <div className="text-[10px] text-[#00E6A5] font-semibold flex items-center justify-between pt-1">
                          <span>Est. {report.aiAnalysis?.estimatedVolumeM2 || 0} m²</span>
                          <span className="text-slate-400 font-normal">Pelapor: {report.reporterName.split(' ')[0]}</span>
                        </div>
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

            {/* Quick Helper Note */}
            <div className="pt-2 border-t border-[#011480] text-[11px] text-[#F8FAFC]/70 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#00E6A5] shrink-0" />
              <span>Data laporan terverifikasi koordinat GPS akurat.</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
