import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Layers, 
  Filter, 
  AlertTriangle, 
  ExternalLink, 
  Globe2,
  Sparkles
} from 'lucide-react';
import { MPLADSWork } from '../../types';
import { RealLeafletMap } from './RealLeafletMap';

interface GeoIntelligenceProps {
  works: MPLADSWork[];
  onSelectWork: (work: MPLADSWork) => void;
}

export const GeoIntelligence: React.FC<GeoIntelligenceProps> = ({
  works,
  onSelectWork,
}) => {
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const statesList = useMemo(() => Array.from(new Set(works.map(w => w.state))).sort(), [works]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
              <Globe2 className="w-6 h-6 text-cyan-400" />
              Real-Life GIS Map & Geospatial Cluster Intelligence
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800 text-cyan-300">
              Live OpenStreetMap / Satellite Tiles
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Live interactive GIS engine rendering actual Indian map tiles down to street and village level. Visualizes project coordinates, 140m near-duplicate connection corridors, and risk density clusters across districts.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none"
          >
            <option value="ALL">All States ({statesList.length})</option>
            {statesList.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Risk Priorities</option>
            <option value="CRITICAL">Critical Review Only</option>
            <option value="HIGH">High Priority Only</option>
          </select>
        </div>
      </div>

      {/* Real-Life Leaflet Map with CartoDB, OSM, and Satellite Tiles */}
      <RealLeafletMap
        works={works}
        onSelectWork={onSelectWork}
        selectedState={selectedState}
        selectedRisk={selectedRisk}
      />

    </div>
  );
};
