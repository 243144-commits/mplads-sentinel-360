import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  MapPin, 
  Crosshair, 
  Compass, 
  Search, 
  Filter, 
  ExternalLink,
  Satellite,
  Sun,
  Moon
} from 'lucide-react';
import { MPLADSWork } from '../../types';
import { RiskBadge } from '../common/RiskBadge';

interface RealLeafletMapProps {
  works: MPLADSWork[];
  onSelectWork: (work: MPLADSWork) => void;
  selectedState?: string;
  selectedRisk?: string;
}

export const RealLeafletMap: React.FC<RealLeafletMapProps> = ({
  works,
  onSelectWork,
  selectedState = 'ALL',
  selectedRisk = 'ALL',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const polylineLayerRef = useRef<L.LayerGroup | null>(null);

  const [activeBaseLayer, setActiveBaseLayer] = useState<'DARK' | 'STREET' | 'SATELLITE'>('DARK');
  const [activeProject, setActiveProject] = useState<MPLADSWork | null>(null);
  const [mapSearch, setMapSearch] = useState('');

  // Key quick-zoom hubs in India
  const QUICK_HUBS = [
    { name: 'All India', lat: 21.5, lng: 79.0, zoom: 5 },
    { name: 'Pune (MH)', lat: 18.5204, lng: 73.8567, zoom: 12 },
    { name: 'Varanasi (UP)', lat: 25.3176, lng: 82.9739, zoom: 12 },
    { name: 'Barabanki (UP)', lat: 26.9272, lng: 81.1843, zoom: 11 },
    { name: 'Belagavi (KA)', lat: 15.8497, lng: 74.4977, zoom: 11 },
    { name: 'Jodhpur (RJ)', lat: 26.2389, lng: 73.0243, zoom: 11 },
    { name: 'Rajkot (GJ)', lat: 22.3039, lng: 70.8022, zoom: 11 }
  ];

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Centered on India
    const map = L.map(mapContainerRef.current, {
      center: [21.5, 79.0],
      zoom: 5,
      zoomControl: true,
      minZoom: 4,
      maxZoom: 18,
    });

    // Dark Matter CartoDB Basemap
    const darkTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    tileLayerRef.current = darkTileLayer;
    markersLayerRef.current = L.layerGroup().addTo(map);
    polylineLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Switch Base Layer (Dark vs Street vs Satellite)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let url = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    let attribution = '&copy; OpenStreetMap contributors &copy; CARTO';

    if (activeBaseLayer === 'STREET') {
      url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      attribution = '&copy; OpenStreetMap contributors';
    } else if (activeBaseLayer === 'SATELLITE') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
    }

    const newLayer = L.tileLayer(url, { attribution, maxZoom: 19 }).addTo(map);
    tileLayerRef.current = newLayer;
  }, [activeBaseLayer]);

  // 3. Filter & Render Real Pinpoint Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    const polylineLayer = polylineLayerRef.current;
    if (!map || !markersLayer || !polylineLayer) return;

    markersLayer.clearLayers();
    polylineLayer.clearLayers();

    const filteredWorks = works.filter((w) => {
      if (selectedState !== 'ALL' && w.state !== selectedState) return false;
      if (selectedRisk !== 'ALL' && w.riskLevel !== selectedRisk) return false;
      return true;
    });

    // Plot real markers with interactive pulse styling
    filteredWorks.forEach((work) => {
      const isCritical = work.riskLevel === 'CRITICAL';
      const isHigh = work.riskLevel === 'HIGH';

      const color = isCritical ? '#ef4444' : isHigh ? '#f59e0b' : '#06b6d4';
      const radius = isCritical ? 8 : isHigh ? 6 : 5;

      const marker = L.circleMarker([work.latitude, work.longitude], {
        radius: radius,
        fillColor: color,
        color: '#ffffff',
        weight: 1.5,
        opacity: 0.9,
        fillOpacity: 0.85,
      });

      // Custom dark HTML popup
      const popupHtml = `
        <div style="font-family: inherit; font-size: 12px; line-height: 1.4; padding: 2px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <strong style="color: #38bdf8; font-family: monospace;">${work.workCode}</strong>
            <span style="font-size: 10px; color: ${isCritical ? '#f87171' : '#34d399'}; font-weight: bold;">
              Priority: ${work.reviewPriorityScore}/100
            </span>
          </div>
          <p style="font-weight: 600; margin: 0 0 6px 0; color: #f8fafc; font-size: 12px;">${work.title}</p>
          <div style="font-size: 11px; color: #94a3b8; font-family: monospace; border-top: 1px solid #334155; padding-top: 4px;">
            <span>Budget: ₹${work.sanctionedAmount}L</span> · <span>Progress: ${work.physicalProgress}%</span>
          </div>
          <div style="margin-top: 4px; font-size: 11px; color: #cbd5e1;">
            📍 ${work.locationName}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        setActiveProject(work);
      });

      markersLayer.addLayer(marker);
    });

    // Plot real polyline connecting near-duplicate works (MP-10482 and MP-10483)
    const workA = works.find(w => w.workCode === 'MP-10482');
    const workB = works.find(w => w.workCode === 'MP-10483');
    if (workA && workB) {
      const latlngs: [number, number][] = [
        [workA.latitude, workA.longitude],
        [workB.latitude, workB.longitude]
      ];
      const line = L.polyline(latlngs, {
        color: '#c026d3',
        weight: 3,
        dashArray: '5, 8',
        opacity: 0.9
      });
      line.bindTooltip('Duplicate Work Signal: 140m separation (94% similarity)', {
        permanent: false,
        direction: 'top',
        className: 'font-mono text-xs'
      });
      polylineLayer.addLayer(line);
    }

  }, [works, selectedState, selectedRisk]);

  // Quick Fly to Location
  const handleFlyTo = (lat: number, lng: number, zoom: number) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([lat, lng], zoom, {
      duration: 1.5,
      easeLinearity: 0.25
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapSearch.trim()) return;

    const match = works.find(w => 
      w.workCode.toLowerCase().includes(mapSearch.toLowerCase()) ||
      w.district.toLowerCase().includes(mapSearch.toLowerCase()) ||
      w.title.toLowerCase().includes(mapSearch.toLowerCase())
    );

    if (match && mapInstanceRef.current) {
      setActiveProject(match);
      mapInstanceRef.current.flyTo([match.latitude, match.longitude], 14, { duration: 1.2 });
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Map Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        
        {/* Quick Zoom Hubs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="text-slate-400 font-mono text-[11px] whitespace-nowrap flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            Quick Focus:
          </span>
          {QUICK_HUBS.map((hub) => (
            <button
              key={hub.name}
              type="button"
              onClick={() => handleFlyTo(hub.lat, hub.lng, hub.zoom)}
              className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white font-mono text-[11px] whitespace-nowrap transition-colors"
            >
              {hub.name}
            </button>
          ))}
        </div>

        {/* Map Layers (Dark Matter, OpenStreetMap, Satellite) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 bg-slate-950 border border-slate-800 rounded-lg text-[11px]">
            <button
              type="button"
              onClick={() => setActiveBaseLayer('DARK')}
              className={`px-2 py-1 rounded flex items-center gap-1 transition-colors ${
                activeBaseLayer === 'DARK' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="w-3 h-3" />
              <span>Dark Tile</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveBaseLayer('STREET')}
              className={`px-2 py-1 rounded flex items-center gap-1 transition-colors ${
                activeBaseLayer === 'STREET' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-3 h-3" />
              <span>Street OSM</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveBaseLayer('SATELLITE')}
              className={`px-2 py-1 rounded flex items-center gap-1 transition-colors ${
                activeBaseLayer === 'SATELLITE' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Satellite className="w-3 h-3" />
              <span>Satellite</span>
            </button>
          </div>

          {/* Quick coordinate search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={mapSearch}
              onChange={(e) => setMapSearch(e.target.value)}
              placeholder="Jump to work/district..."
              className="w-44 pl-7 pr-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <Search className="w-3 h-3 text-slate-500 absolute left-2 top-2" />
          </form>
        </div>

      </div>

      {/* Real Leaflet Map Container */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl h-[560px]">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Active Project Drawer on selection */}
        {activeProject && (
          <div className="absolute top-4 right-4 z-20 w-80 bg-slate-900/95 border border-slate-700/80 p-4 rounded-xl shadow-2xl backdrop-blur-md space-y-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-mono text-xs font-bold text-cyan-400">
                  {activeProject.workCode}
                </span>
                <h4 className="text-xs font-semibold text-white mt-0.5 line-clamp-2">
                  {activeProject.title}
                </h4>
              </div>
              <RiskBadge score={activeProject.reviewPriorityScore} size="sm" showLabel={false} />
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
              <div>Location: {activeProject.locationName}</div>
              <div>Coordinates: {activeProject.latitude}, {activeProject.longitude}</div>
              <div>Sanction: ₹{activeProject.sanctionedAmount}L · Physical: {activeProject.physicalProgress}%</div>
            </div>

            {activeProject.anomalySignals && activeProject.anomalySignals.length > 0 && (
              <div className="text-[11px] text-amber-300/90 bg-amber-950/30 p-2 rounded border border-amber-900/40">
                <strong>Signal:</strong> {activeProject.anomalySignals[0].description}
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onSelectWork(activeProject)}
                className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Inspect Project Intelligence</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setActiveProject(null)}
                className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-20 flex flex-wrap items-center gap-3 bg-slate-950/85 border border-slate-800 px-3 py-1.5 rounded-xl backdrop-blur-md text-[11px] font-mono text-slate-300">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
            Critical Review (&ge; 80)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            High Priority (65-79)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            Nominal
          </span>
          <span className="flex items-center gap-1.5 text-purple-400">
            <span className="w-4 h-0.5 border-t-2 border-dashed border-purple-400" />
            140m Duplicate Corridor
          </span>
        </div>
      </div>

    </div>
  );
};
