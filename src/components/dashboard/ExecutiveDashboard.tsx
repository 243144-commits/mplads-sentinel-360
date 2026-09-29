import React from 'react';
import { 
  AlertOctagon, 
  TrendingUp, 
  Clock, 
  IndianRupee, 
  Layers, 
  ArrowUpRight, 
  Eye, 
  Filter,
  Activity,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { MPLADSWork, UserRole } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { RiskCore3D } from '../3d/RiskCore3D';
import { RiskEvolutionChart } from './RiskEvolutionChart';

interface ExecutiveDashboardProps {
  works: MPLADSWork[];
  onSelectWork: (work: MPLADSWork) => void;
  onNavigateTab: (tab: any, filter?: any) => void;
  activeRole: UserRole;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  works,
  onSelectWork,
  onNavigateTab,
  activeRole,
}) => {
  // Aggregate KPIs
  const totalWorks = works.length;
  const totalSanctionedLakhs = works.reduce((sum, w) => sum + w.sanctionedAmount, 0);
  const totalExpenditureLakhs = works.reduce((sum, w) => sum + w.totalExpenditure, 0);
  const completedWorks = works.filter((w) => w.status === 'COMPLETED').length;
  const delayedWorks = works.filter((w) => w.predictedDelayMonths > 3 || w.status === 'STALLED').length;
  const anomalousWorks = works.filter((w) => w.requiresVerification);
  const highPriorityWorks = works.filter((w) => w.reviewPriorityScore >= 80);

  // Category breakdown
  const categoryCounts: Record<string, { count: number; sanctioned: number; anomalies: number }> = {};
  works.forEach((w) => {
    if (!categoryCounts[w.category]) {
      categoryCounts[w.category] = { count: 0, sanctioned: 0, anomalies: 0 };
    }
    categoryCounts[w.category].count++;
    categoryCounts[w.category].sanctioned += w.sanctionedAmount;
    if (w.requiresVerification) categoryCounts[w.category].anomalies++;
  });

  // Top Priority Review Cases
  const topPriorityCases = [...works]
    .sort((a, b) => b.reviewPriorityScore - a.reviewPriorityScore)
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 3D Morphing Hero & AI Command Header */}
      <section className="relative rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-950/80 to-[#060913] border border-slate-800/80 p-6 md:p-8 overflow-hidden shadow-2xl">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Hero Left Column: Brand & System Status */}
          <div className="lg:col-span-4 space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-950/60 border border-indigo-800/40 text-[11px] font-mono text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>MoSPI · SIH26102 MISSION CONTROL</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
              MPLADS <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                SENTINEL 360
              </span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              From project data to explainable risk intelligence. Continuous multi-layer monitoring across cost, timelines, physical progress, and duplicate allocations.
            </p>

            {/* Live System Status Indicators */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Live System Status
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-slate-300">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Active Monitoring
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                  AI Engine Online
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  Pipeline Healthy
                </span>
              </div>
            </div>

            <div className="pt-1">
              <button
                onClick={() => onNavigateTab('anomalies')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                data-cursor-action="EXPLORE"
              >
                <span>Investigate Active Anomalies</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Hero Center Column: 3D Morphing Risk Intelligence Core */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <RiskCore3D 
              mode="DATA_CLUSTER" 
              riskScore={highPriorityWorks.length > 0 ? 88 : 45} 
              size="hero" 
            />
            <div className="text-center mt-[-10px] z-10">
              <p className="text-[11px] font-mono text-slate-400">
                Central Intelligence Core · Morphing Dynamic Topology
              </p>
            </div>
          </div>

          {/* Hero Right Column: Live Risk Snapshot */}
          <div className="lg:col-span-3 space-y-3">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-sm space-y-1">
              <span className="text-[11px] font-mono uppercase text-slate-400">
                Works Monitored
              </span>
              <div className="text-2xl font-bold font-mono text-white tabular-nums">
                {totalWorks.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-400">
                Across 8 Indian States & 42 Districts
              </p>
            </div>

            <div 
              onClick={() => onNavigateTab('anomalies', { riskLevel: 'CRITICAL' })}
              className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 backdrop-blur-sm space-y-1 hover:border-rose-500/50 cursor-pointer transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase text-rose-400 font-semibold">
                  Critical Review Priority
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-rose-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-2xl font-bold font-mono text-rose-300 tabular-nums">
                {highPriorityWorks.length}
              </div>
              <p className="text-[11px] text-slate-400">
                Requires physical verification & audit
              </p>
            </div>

            <div 
              onClick={() => onNavigateTab('anomalies')}
              className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 backdrop-blur-sm space-y-1 hover:border-amber-500/50 cursor-pointer transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase text-amber-400 font-semibold">
                  Anomaly Indicators
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-2xl font-bold font-mono text-amber-300 tabular-nums">
                {anomalousWorks.length}
              </div>
              <p className="text-[11px] text-slate-400">
                Cost, progress & similarity flags
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* KPI Metric Cards (Clickable single-elevation cards with subtle depth) */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        
        <div 
          onClick={() => onNavigateTab('financial')}
          className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-indigo-500/40 hover:-translate-y-0.5 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono font-medium">Sanctioned</span>
            <IndianRupee className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white tabular-nums">
            ₹{(totalSanctionedLakhs / 100).toFixed(2)} Cr
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Total Fund Allocation
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('financial')}
          className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-cyan-500/40 hover:-translate-y-0.5 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono font-medium">Expenditure</span>
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white tabular-nums">
            ₹{(totalExpenditureLakhs / 100).toFixed(2)} Cr
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {((totalExpenditureLakhs / totalSanctionedLakhs) * 100).toFixed(1)}% Disbursed
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('works', { status: 'COMPLETED' })}
          className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono font-medium">Completed</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-300 tabular-nums">
            {completedWorks}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {((completedWorks / totalWorks) * 100).toFixed(1)}% Completion Rate
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('delay')}
          className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-amber-500/40 hover:-translate-y-0.5 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono font-medium">Delayed Works</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-300 tabular-nums">
            {delayedWorks}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Timeline Slip &gt; 3 Mo
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('duplicates')}
          className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-purple-500/40 hover:-translate-y-0.5 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono font-medium">Duplicates Flag</span>
            <Layers className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-bold font-mono text-purple-300 tabular-nums">
            {works.filter(w => w.anomalyTypes.includes('DUPLICATE_WORK')).length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Similarity Score &gt; 80%
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('anomalies')}
          className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-rose-500/40 hover:-translate-y-0.5 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono font-medium">Review Priority</span>
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-bold font-mono text-rose-400 tabular-nums">
            {highPriorityWorks.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Score &ge; 80 / 100
          </div>
        </div>

      </section>

      {/* 6-Month Risk Evolution & Compliance Trajectory Chart */}
      <RiskEvolutionChart
        works={works}
        onNavigateToAnomalies={() => onNavigateTab('anomalies')}
      />

      {/* Main Analysis Section: Top Priority Cases & Category Risk Breakdown */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Top Priority Review Cases (Table with direct investigation links) */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800/90 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-semibold text-white">
                Top Cases Requiring Official Verification
              </h2>
              <p className="text-xs text-slate-400">
                Ranked by 0-100 Review Priority Score · Explainable anomaly indicators
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('anomalies')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View All Alerts</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {topPriorityCases.map((work) => (
              <div
                key={work.id}
                onClick={() => onSelectWork(work)}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/70 hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all cursor-pointer space-y-2 group"
                data-cursor-action="INSPECT"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-cyan-400 group-hover:underline">
                        {work.workCode}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400">{work.category}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400">{work.district}, {work.state}</span>
                    </div>
                    <h3 className="text-xs font-medium text-slate-200 mt-1 line-clamp-1">
                      {work.title}
                    </h3>
                  </div>

                  <RiskBadge score={work.reviewPriorityScore} size="sm" showLabel={false} />
                </div>

                {/* Primary Anomaly Signal */}
                {work.anomalySignals && work.anomalySignals.length > 0 && (
                  <div className="text-[11px] text-amber-300/90 bg-amber-950/20 px-2.5 py-1 rounded border border-amber-900/30 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span className="font-medium">{work.anomalySignals[0].name}:</span>
                    <span className="text-slate-300 truncate">{work.anomalySignals[0].description}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
                  <span>Sanction: ₹{work.sanctionedAmount}L</span>
                  <span>Physical: {work.physicalProgress}%</span>
                  <span>Financial: {work.financialProgress}%</span>
                  <span className="text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Examine Evidence <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Category Distribution & Anomaly Concentration */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800/90 rounded-2xl p-6 space-y-4">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base font-semibold text-white">
              Category Distribution & Risk Concentration
            </h2>
            <p className="text-xs text-slate-400">
              Comparative analysis of sanctioned volume vs anomaly flags
            </p>
          </div>

          <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
            {Object.entries(categoryCounts).map(([catName, stats]) => {
              const anomalyRatio = ((stats.anomalies / (stats.count || 1)) * 100).toFixed(0);
              return (
                <div
                  key={catName}
                  onClick={() => onNavigateTab('works', { category: catName })}
                  className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/60 hover:border-slate-700 transition-colors cursor-pointer space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200">{catName}</span>
                    <span className="font-mono text-slate-400">{stats.count} works</span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                    <div 
                      className="h-full bg-indigo-500 rounded-full" 
                      style={{ width: `${Math.min(100, (stats.count / totalWorks) * 300)}%` }} 
                    />
                    {stats.anomalies > 0 && (
                      <div 
                        className="h-full bg-rose-500 ml-0.5 rounded-full" 
                        style={{ width: `${(stats.anomalies / stats.count) * 100}%` }} 
                      />
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>₹{(stats.sanctioned / 100).toFixed(1)} Cr Sanctioned</span>
                    <span className={stats.anomalies > 0 ? 'text-amber-400' : 'text-slate-400'}>
                      {stats.anomalies} flags ({anomalyRatio}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </section>

      {/* Quick Action Navigation Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div
          onClick={() => onNavigateTab('geo')}
          className="p-5 rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950/30 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-cyan-400 uppercase">
              Geospatial Intelligence
            </span>
            <ArrowUpRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <h3 className="text-sm font-semibold text-white">
            GIS Risk Heatmap & Proximity Clusters
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Locate multi-project proximity anomalies within 500m radius and cross-reference geographic coordinates.
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('duplicates')}
          className="p-5 rounded-xl bg-gradient-to-br from-slate-900 to-purple-950/30 border border-slate-800 hover:border-purple-500/40 transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-purple-400 uppercase">
              NLP Similarity Engine
            </span>
            <ArrowUpRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <h3 className="text-sm font-semibold text-white">
            Duplicate Work Detector
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Cross-compare work titles, sanction dates, and contractors to detect potential dual sanction recommendations.
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('agencies')}
          className="p-5 rounded-xl bg-gradient-to-br from-slate-900 to-emerald-950/30 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-emerald-400 uppercase">
              Network Intelligence
            </span>
            <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <h3 className="text-sm font-semibold text-white">
            Implementing Agency Concentration
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Analyze single-agency load, contractor concentration ratios, and tender distribution patterns.
          </p>
        </div>

      </section>

    </div>
  );
};
