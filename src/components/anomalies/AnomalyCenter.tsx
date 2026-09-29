import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  Filter, 
  Search, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink,
  MapPin, 
  Sparkles,
  Layers,
  ArrowUpDown,
  FileCheck
} from 'lucide-react';
import { MPLADSWork, AnomalyType, RiskLevel, UserRole } from '../../types';
import { RiskBadge } from '../common/RiskBadge';

interface AnomalyCenterProps {
  works: MPLADSWork[];
  onSelectWork: (work: MPLADSWork) => void;
  activeRole: UserRole;
  initialFilter?: { riskLevel?: string; anomalyType?: string };
}

export const AnomalyCenter: React.FC<AnomalyCenterProps> = ({
  works,
  onSelectWork,
  activeRole,
  initialFilter,
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>(initialFilter?.riskLevel || 'ALL');
  const [selectedType, setSelectedType] = useState<string>(initialFilter?.anomalyType || 'ALL');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'CARDS' | 'TABLE'>('CARDS');

  // Filter anomalous works
  const anomalousWorks = useMemo(() => {
    return works.filter((w) => {
      // Must have some anomaly or require verification
      if (!w.requiresVerification && w.reviewPriorityScore < 50) return false;

      // Severity filter
      if (selectedSeverity !== 'ALL' && w.riskLevel !== selectedSeverity) return false;

      // Anomaly type filter
      if (selectedType !== 'ALL' && !w.anomalyTypes.includes(selectedType as AnomalyType)) return false;

      // State filter
      if (selectedState !== 'ALL' && w.state !== selectedState) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          w.workCode.toLowerCase().includes(q) ||
          w.title.toLowerCase().includes(q) ||
          w.district.toLowerCase().includes(q) ||
          w.implementingAgency.toLowerCase().includes(q)
        );
      }

      return true;
    }).sort((a, b) => b.reviewPriorityScore - a.reviewPriorityScore);
  }, [works, selectedSeverity, selectedType, selectedState, searchQuery]);

  // Unique States for filter
  const statesList = useMemo(() => {
    return Array.from(new Set(works.map((w) => w.state))).sort();
  }, [works]);

  const anomalyTypeLabels: Record<AnomalyType, string> = {
    COST_OUTLIER: 'Cost Deviation',
    DUPLICATE_WORK: 'Duplicate / Similarity',
    EXPENDITURE_MISMATCH: 'Expenditure Mismatch',
    TIMELINE_DELAY: 'Timeline Delay',
    AGENCY_CONCENTRATION: 'Agency Concentration',
    PAYMENT_ANOMALY: 'Payment Velocity',
    GEO_PROXIMITY: 'Geographic Proximity',
    COMPLIANCE_SIGNAL: 'Compliance & Evidence'
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header with Title and Policy Note */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
              AI Anomaly & Risk Intelligence Center
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-800 text-indigo-300">
              {anomalousWorks.length} Active Flags
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Multi-layer anomaly detection across cost baselines, progress telemetry, geospatial proximity, and similarity clustering. Alerts represent 
            <strong className="text-slate-200"> Review Priority Indicators</strong>, not confirmed fraud.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setViewMode('CARDS')}
              className={`px-3 py-1 rounded transition-colors ${
                viewMode === 'CARDS' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Card View
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              className={`px-3 py-1 rounded transition-colors ${
                viewMode === 'TABLE' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Data Grid
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search code, title, district..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Severity Filter */}
        <div>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Severity Levels</option>
            <option value="CRITICAL">Critical Review Priority (80+)</option>
            <option value="HIGH">High Review Priority (65-79)</option>
            <option value="MEDIUM">Medium Review Priority (45-64)</option>
          </select>
        </div>

        {/* Anomaly Type Filter */}
        <div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Anomaly Dimensions</option>
            <option value="COST_OUTLIER">Cost Deviation Outlier</option>
            <option value="DUPLICATE_WORK">Duplicate / Near-Duplicate</option>
            <option value="EXPENDITURE_MISMATCH">Expenditure/Progress Divergence</option>
            <option value="TIMELINE_DELAY">Critical Timeline Delay</option>
            <option value="AGENCY_CONCENTRATION">Agency Concentration</option>
            <option value="PAYMENT_ANOMALY">Rapid Payment Velocity</option>
            <option value="GEO_PROXIMITY">Geospatial Proximity</option>
            <option value="COMPLIANCE_SIGNAL">Evidence & Compliance Missing</option>
          </select>
        </div>

        {/* State Filter */}
        <div>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All States ({statesList.length})</option>
            {statesList.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {anomalousWorks.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-slate-900/40 border border-slate-800 p-8 space-y-3">
          <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No Anomaly Indicators Match Filter Criteria</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your severity or state filters to inspect other flagged project clusters.
          </p>
          <button
            onClick={() => {
              setSelectedSeverity('ALL');
              setSelectedType('ALL');
              setSelectedState('ALL');
              setSearchQuery('');
            }}
            className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'CARDS' ? (
        /* Card Investigation Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {anomalousWorks.map((work) => (
            <div
              key={work.id}
              onClick={() => onSelectWork(work)}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-indigo-500/60 transition-all cursor-pointer space-y-4 group shadow-lg hover:shadow-indigo-950/30"
              data-cursor-action="INVESTIGATE"
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400 group-hover:underline">
                      {work.workCode}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-xs text-slate-400">{work.category}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {work.district}, {work.state}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-100 group-hover:text-white line-clamp-2">
                    {work.title}
                  </h3>
                </div>

                <div className="shrink-0">
                  <RiskBadge score={work.reviewPriorityScore} size="md" />
                </div>
              </div>

              {/* Anomaly Badges */}
              <div className="flex flex-wrap gap-1.5">
                {work.anomalyTypes.map((type) => (
                  <span
                    key={type}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-cyan-300 border border-slate-700/60"
                  >
                    {anomalyTypeLabels[type] || type}
                  </span>
                ))}
              </div>

              {/* Key Signal Highlight Box */}
              {work.anomalySignals && work.anomalySignals.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      {work.anomalySignals[0].name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Impact: +{work.anomalySignals[0].scoreContribution} pts
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {work.anomalySignals[0].description}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Identified Evidence:</span>
                      <span className="text-slate-300 font-mono">{work.anomalySignals[0].evidence}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Statistical Baseline:</span>
                      <span className="text-slate-300 font-mono">{work.anomalySignals[0].baseline}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Metrics footer & CTA */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/70 text-xs">
                <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
                  <span>Sanction: ₹{work.sanctionedAmount}L</span>
                  <span>Physical: {work.physicalProgress}%</span>
                  <span>Disbursed: {work.financialProgress}%</span>
                </div>

                <div className="flex items-center gap-1 text-cyan-400 font-medium text-xs group-hover:translate-x-1 transition-transform">
                  <span>Open Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Data Grid View */
        <div className="overflow-x-auto rounded-2xl bg-slate-900/80 border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400">
              <tr>
                <th className="py-3 px-4">Work Code</th>
                <th className="py-3 px-4">Project Title</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Sanctioned</th>
                <th className="py-3 px-4 text-right">Progress</th>
                <th className="py-3 px-4 text-center">Priority</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {anomalousWorks.map((work) => (
                <tr
                  key={work.id}
                  onClick={() => onSelectWork(work)}
                  className="hover:bg-slate-850/60 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">
                    {work.workCode}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-200 max-w-xs truncate">
                    {work.title}
                  </td>
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                    {work.district}, {work.state}
                  </td>
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                    {work.category}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-200 tabular-nums">
                    ₹{work.sanctionedAmount}L
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums">
                    <span className="text-slate-200">{work.physicalProgress}%</span>
                    <span className="text-slate-500 text-[10px] ml-1">({work.financialProgress}% fin)</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <RiskBadge score={work.reviewPriorityScore} size="sm" showLabel={false} />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectWork(work);
                      }}
                      className="p-1 rounded hover:bg-slate-800 text-cyan-400 hover:text-cyan-300"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
