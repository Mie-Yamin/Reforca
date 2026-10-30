import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  AlertTriangle,
  Layers,
  Compass,
  Filter,
  TrendingUp,
  CheckCircle2,
  Clock,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { formatRupiah } from '../data/mockFirestore';

export default function BeachMap({ reports, onSelectReport, activeReportId }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  const [urgencyFilter, setUrgencyFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isExpanded, setIsExpanded] = useState(false);

  // Filtered reports
  const filteredReports = reports.filter(r => {
    const matchUrgency = urgencyFilter === 'ALL' || r.aiAnalysis?.severity === urgencyFilter;
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchUrgency && matchStatus;
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default view on Jakarta Bay & Thousand Islands
      const map = L.map(mapContainerRef.current, {
        center: [-6.06, 106.80],
        zoom: 11,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Tile Layer: OpenStreetMap Standard (100% Gratis & Tanpa API Key)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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

  // Update Markers when reports or filters change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    layer.clearLayers();

    filteredReports.forEach((report) => {
      const isDarurat = report.aiAnalysis?.severity === 'Darurat';
      const isTinggi = report.aiAnalysis?.severity === 'Tinggi';
      const isSedang = report.aiAnalysis?.severity === 'Sedang';

      let markerColorClass = 'bg-emerald-500 border-emerald-300 shadow-glow-emerald';
      let pinColor = '#10b981';
      let badgeLabel = 'Rendah';

      if (isDarurat) {
        markerColorClass = 'bg-rose-500 border-rose-300 shadow-glow-rose';
        pinColor = '#f43f5e';
        badgeLabel = 'Darurat';
      } else if (isTinggi) {
        markerColorClass = 'bg-amber-500 border-amber-300';
        pinColor = '#f59e0b';
        badgeLabel = 'Tinggi';
      } else if (isSedang) {
        markerColorClass = 'bg-cyan-500 border-cyan-300 shadow-glow-cyan';
        pinColor = '#06b6d4';
        badgeLabel = 'Sedang';
      }

      const isCurrentActive = activeReportId === report.id;

      // Custom HTML Icon
      const customIcon = L.divIcon({
        className: 'custom-reforca-pin',
        html: `
          <div class="relative group cursor-pointer flex items-center justify-center">
            ${isDarurat ? '<div class="absolute -inset-2 rounded-full bg-rose-500/40 animate-ping"></div>' : ''}
            <div class="relative w-9 h-9 rounded-full ${markerColorClass} border-2 flex items-center justify-center text-white shadow-xl transition-transform duration-200 ${isCurrentActive ? 'scale-125 ring-4 ring-cyan-300' : 'group-hover:scale-110'}">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div class="absolute -top-1 -right-1 bg-slate-900 border border-slate-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full text-cyan-300">
              ${report.votesCount}
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
      });

      const marker = L.marker(report.coordinates, { icon: customIcon });

      // Popup Content
      const popupHtml = `
        <div class="p-2 min-w-[240px] max-w-[280px] text-slate-100">
          <div class="relative h-28 rounded-lg overflow-hidden mb-2 bg-slate-800">
            <img src="${report.photoBefore}" alt="${report.locationName}" class="w-full h-full object-cover" />
            <span class="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-white shadow" style="background-color: ${pinColor}">
              ${badgeLabel}
            </span>
            <span class="absolute top-2 right-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur text-slate-200">
              ${report.status}
            </span>
          </div>

          <h4 class="font-bold text-sm text-cyan-200 leading-snug mb-1">${report.locationName}</h4>
          <p class="text-xs text-slate-300 line-clamp-2 mb-2">${report.description}</p>
          
          <div class="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-2 mb-3">
            <span class="flex items-center gap-1 font-semibold text-teal-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              ${report.votesCount} Dukungan
            </span>
            <span>Est. ${report.aiAnalysis?.estimatedVolumeM2 || 0} m²</span>
          </div>

          <button id="btn-popup-${report.id}" class="w-full py-1.5 px-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow-md">
            <span>Periksa Rincian Laporan</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-popup-${report.id}`);
        if (btn) {
          btn.onclick = () => {
            if (onSelectReport) onSelectReport(report);
          };
        }
      });

      layer.addLayer(marker);
    });
  }, [filteredReports, activeReportId, onSelectReport]);

  // Focus map on specific report when selected externally
  useEffect(() => {
    if (!activeReportId || !mapInstanceRef.current) return;
    const target = reports.find(r => r.id === activeReportId);
    if (target && target.coordinates) {
      mapInstanceRef.current.flyTo(target.coordinates, 13, { duration: 1.2 });
    }
  }, [activeReportId, reports]);

  const handleFlyToPreset = (coords, zoom = 12) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(coords, zoom, { duration: 1.0 });
    }
  };

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-teal-500/35 shadow-2xl transition-all duration-300 ${isExpanded ? 'h-[620px]' : 'h-[460px] md:h-[520px]'}`}>
      {/* Top Floating Controls Bar */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Filter Pills */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-teal-500/20 shadow-lg">
          <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-cyan-300">
            <Filter size={14} />
            <span className="hidden sm:inline">Urgensi:</span>
          </div>

          {['ALL', 'Darurat', 'Tinggi', 'Sedang'].map((urgency) => (
            <button
              key={urgency}
              onClick={() => setUrgencyFilter(urgency)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${urgencyFilter === urgency
                ? urgency === 'Darurat'
                  ? 'bg-rose-500 text-white font-bold shadow-glow-rose'
                  : urgency === 'Tinggi'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : urgency === 'Sedang'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-teal-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
            >
              {urgency === 'ALL' ? 'Semua' : urgency}
            </button>
          ))}

          <div className="h-4 w-[1px] bg-slate-700 mx-1 hidden sm:block"></div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pointer-events-auto bg-slate-800/90 border border-slate-700 text-xs text-slate-200 rounded-lg px-2 py-1 outline-none focus:border-teal-400"
          >
            <option value="ALL">Semua Status</option>
            <option value="Pending">Menunggu (Pending)</option>
            <option value="In Progress">Sedang Dikerjakan</option>
            <option value="Completed">Selesai (Cleaned)</option>
          </select>
        </div>

        {/* Right: Quick Zoom Presets & Expand */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-teal-500/20 shadow-lg ml-auto">
          <button
            onClick={() => handleFlyToPreset([-6.1108, 106.7731], 13)}
            title="Fokus Muara Angke"
            className="px-2 py-1 text-xs text-slate-300 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors font-medium hidden md:inline-block"
          >
            Muara Angke
          </button>
          <button
            onClick={() => handleFlyToPreset([-6.0984, 106.9642], 13)}
            title="Fokus Marunda"
            className="px-2 py-1 text-xs text-slate-300 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors font-medium hidden md:inline-block"
          >
            Marunda
          </button>
          <button
            onClick={() => handleFlyToPreset([-5.8622, 106.6214], 13)}
            title="Fokus Kepulauan Seribu"
            className="px-2 py-1 text-xs text-slate-300 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors font-medium hidden md:inline-block"
          >
            P. Pari
          </button>
          <button
            onClick={() => handleFlyToPreset([-6.06, 106.80], 11)}
            title="Reset Peta Teluk Jakarta"
            className="p-1.5 text-slate-300 hover:text-teal-300 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Compass size={15} />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Kecilkan Peta' : 'Perluas Tampilan Peta'}
            className="p-1.5 text-slate-300 hover:text-teal-300 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Maximize2 size={15} />
          </button>
        </div>
      </div>

      {/* Map Target Container */}
      <div ref={mapContainerRef} className="w-full h-full z-[100]" />

      {/* Bottom Map Legend */}
      <div className="absolute bottom-3 left-3 z-[400] bg-slate-950/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-teal-500/20 text-xs shadow-lg hidden sm:flex items-center gap-4">
        <span className="font-semibold text-slate-300 flex items-center gap-1.5">
          <Layers size={13} className="text-teal-400" />
          Legenda Urgensi AI:
        </span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-rose-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            Darurat (Kritis)
          </span>
          <span className="flex items-center gap-1.5 text-amber-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            Tinggi
          </span>
          <span className="flex items-center gap-1.5 text-cyan-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
            Sedang
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Terkendali / Selesai
          </span>
        </div>
      </div>
    </div>
  );
}