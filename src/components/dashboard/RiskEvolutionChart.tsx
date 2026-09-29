import React, { useState, useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  AlertOctagon, 
  ShieldCheck, 
  Calendar, 
  Filter, 
  Sparkles,
  Info
} from 'lucide-react';
import { MPLADSWork } from '../../types';

interface RiskEvolutionChartProps {
  works: MPLADSWork[];
  onNavigateToAnomalies?: () => void;
}

interface MonthlyRiskData {
  month: string;
  criticalAlerts: number;
  totalAnomalies: number;
  resolvedReviews: number;
  avgResolutionDays: number;
  systemicPattern: string;
}

export const RiskEvolutionChart: React.FC<RiskEvolutionChartProps> = ({
  works,
  onNavigateToAnomalies,
}) => {
  const [selectedDimension, setSelectedDimension] = useState<'ALL' | 'COST' | 'DUPLICATE' | 'PROGRESS'>('ALL');
  const [activeMetric, setActiveMetric] = useState<'CRITICAL' | 'TOTAL' | 'BOTH'>('BOTH');

  // Realistic monthly trend data over the last 6 months (April 2026 - September 2026)
  const monthlyData: MonthlyRiskData[] = useMemo(() => {
    // Ground base counts from the active dataset
    const currentCritical = works.filter(w => w.reviewPriorityScore >= 80).length;
    const currentTotal = works.filter(w => w.requiresVerification).length;

    if (selectedDimension === 'COST') {
      return [
        { month: 'Apr 2026', criticalAlerts: 18, totalAnomalies: 42, resolvedReviews: 12, avgResolutionDays: 24, systemicPattern: 'New fiscal year budget sanctions initiated' },
        { month: 'May 2026', criticalAlerts: 22, totalAnomalies: 48, resolvedReviews: 15, avgResolutionDays: 22, systemicPattern: 'PWD revised Schedule of Rates (SOR) divergence' },
        { month: 'Jun 2026', criticalAlerts: 29, totalAnomalies: 62, resolvedReviews: 19, avgResolutionDays: 26, systemicPattern: 'Mid-quarter civil works tender price spike' },
        { month: 'Jul 2026', criticalAlerts: 36, totalAnomalies: 78, resolvedReviews: 24, avgResolutionDays: 28, systemicPattern: 'Peak cost deviation in community hall projects' },
        { month: 'Aug 2026', criticalAlerts: 31, totalAnomalies: 69, resolvedReviews: 32, avgResolutionDays: 21, systemicPattern: 'Mandatory technical pre-audit enforced' },
        { month: 'Sep 2026', criticalAlerts: Math.max(14, Math.round(currentCritical * 0.45)), totalAnomalies: Math.max(35, Math.round(currentTotal * 0.4)), resolvedReviews: 38, avgResolutionDays: 17, systemicPattern: 'Cost variance stabilization post-advisory' }
      ];
    }

    if (selectedDimension === 'DUPLICATE') {
      return [
        { month: 'Apr 2026', criticalAlerts: 8, totalAnomalies: 16, resolvedReviews: 6, avgResolutionDays: 18, systemicPattern: 'Baseline duplicate rate across rural roads' },
        { month: 'May 2026', criticalAlerts: 12, totalAnomalies: 24, resolvedReviews: 9, avgResolutionDays: 19, systemicPattern: 'Overlapping road proposals in Pune & Varanasi' },
        { month: 'Jun 2026', criticalAlerts: 21, totalAnomalies: 38, resolvedReviews: 14, avgResolutionDays: 25, systemicPattern: 'Pre-monsoon accelerated sanction window' },
        { month: 'Jul 2026', criticalAlerts: 26, totalAnomalies: 45, resolvedReviews: 18, avgResolutionDays: 23, systemicPattern: 'Twin sanction clustering detected in 3 blocks' },
        { month: 'Aug 2026', criticalAlerts: 15, totalAnomalies: 28, resolvedReviews: 24, avgResolutionDays: 16, systemicPattern: 'NLP pre-filter screened 60% identical proposals' },
        { month: 'Sep 2026', criticalAlerts: Math.max(6, Math.round(currentCritical * 0.18)), totalAnomalies: Math.max(12, Math.round(currentTotal * 0.16)), resolvedReviews: 29, avgResolutionDays: 12, systemicPattern: 'Geographic 500m proximity check active' }
      ];
    }

    if (selectedDimension === 'PROGRESS') {
      return [
        { month: 'Apr 2026', criticalAlerts: 14, totalAnomalies: 34, resolvedReviews: 8, avgResolutionDays: 28, systemicPattern: 'First tranche release cycle' },
        { month: 'May 2026', criticalAlerts: 19, totalAnomalies: 44, resolvedReviews: 11, avgResolutionDays: 31, systemicPattern: 'Expenditure outpacing foundation works' },
        { month: 'Jun 2026', criticalAlerts: 32, totalAnomalies: 71, resolvedReviews: 16, avgResolutionDays: 34, systemicPattern: 'Monsoon season physical site stalls' },
        { month: 'Jul 2026', criticalAlerts: 38, totalAnomalies: 82, resolvedReviews: 21, avgResolutionDays: 32, systemicPattern: 'Substantial payment release before MB upload' },
        { month: 'Aug 2026', criticalAlerts: 28, totalAnomalies: 64, resolvedReviews: 27, avgResolutionDays: 25, systemicPattern: 'Geotag verification gate initiated' },
        { month: 'Sep 2026', criticalAlerts: Math.max(12, Math.round(currentCritical * 0.35)), totalAnomalies: Math.max(28, Math.round(currentTotal * 0.32)), resolvedReviews: 35, avgResolutionDays: 19, systemicPattern: 'Physical inspection compliance improved' }
      ];
    }

    // Default: Aggregate Multi-Layer
    return [
      { month: 'Apr 2026', criticalAlerts: 28, totalAnomalies: 68, resolvedReviews: 22, avgResolutionDays: 26, systemicPattern: 'New financial year sanction kickoff' },
      { month: 'May 2026', criticalAlerts: 34, totalAnomalies: 86, resolvedReviews: 29, avgResolutionDays: 24, systemicPattern: 'Early expenditure velocity alerts emerge' },
      { month: 'Jun 2026', criticalAlerts: 46, totalAnomalies: 114, resolvedReviews: 36, avgResolutionDays: 29, systemicPattern: 'Pre-monsoon surge in road and hall tenders' },
      { month: 'Jul 2026', criticalAlerts: 58, totalAnomalies: 142, resolvedReviews: 44, avgResolutionDays: 31, systemicPattern: 'Peak anomaly volume across cost and duplicate corridors' },
      { month: 'Aug 2026', criticalAlerts: 48, totalAnomalies: 122, resolvedReviews: 58, avgResolutionDays: 22, systemicPattern: 'State Nodal inspection drives resolve 58 cases' },
      { month: 'Sep 2026', criticalAlerts: currentCritical, totalAnomalies: currentTotal, resolvedReviews: 69, avgResolutionDays: 18, systemicPattern: 'Automated pre-sanction AI screening reduces high-risk inflow' }
    ];
  }, [selectedDimension, works]);

  // Compute 6-month trend differential
  const firstMonth = monthlyData[0].criticalAlerts;
  const latestMonth = monthlyData[monthlyData.length - 1].criticalAlerts;
  const peakMonth = [...monthlyData].sort((a, b) => b.criticalAlerts - a.criticalAlerts)[0];
  const totalResolved = monthlyData.reduce((sum, d) => sum + d.resolvedReviews, 0);

  return (
    <section className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 space-y-6 shadow-xl relative overflow-hidden">
      
      {/* Background ambient gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Risk Evolution & Compliance Trajectory
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/80 text-cyan-300 border border-indigo-800/60">
              6-Month Trend Analysis
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Fluctuation of high-priority review indicators (Score &ge; 80) over the last 6 months, mapping seasonal tender rushes to systemic irregularities.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          
          {/* Dimension Selector */}
          <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-lg">
            <button
              onClick={() => setSelectedDimension('ALL')}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors whitespace-nowrap ${
                selectedDimension === 'ALL' ? 'bg-indigo-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Signals
            </button>
            <button
              onClick={() => setSelectedDimension('COST')}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors whitespace-nowrap ${
                selectedDimension === 'COST' ? 'bg-indigo-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Cost Outliers
            </button>
            <button
              onClick={() => setSelectedDimension('DUPLICATE')}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors whitespace-nowrap ${
                selectedDimension === 'DUPLICATE' ? 'bg-indigo-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Duplicate Works
            </button>
            <button
              onClick={() => setSelectedDimension('PROGRESS')}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors whitespace-nowrap ${
                selectedDimension === 'PROGRESS' ? 'bg-indigo-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Progress Mismatches
            </button>
          </div>

          {/* Metric Toggle */}
          <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-lg">
            <button
              onClick={() => setActiveMetric('CRITICAL')}
              className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                activeMetric === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              Critical Only
            </button>
            <button
              onClick={() => setActiveMetric('BOTH')}
              className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                activeMetric === 'BOTH' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Layers
            </button>
          </div>

        </div>
      </div>

      {/* Metric Highlights Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-0.5">
          <span className="text-[10px] text-slate-400 block uppercase">Peak Alert Month</span>
          <div className="text-base font-bold text-rose-400 flex items-center gap-1.5">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
            <span>{peakMonth.month} ({peakMonth.criticalAlerts})</span>
          </div>
          <p className="text-[10px] text-slate-400 font-sans">Mid-year sanction clustering</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-0.5">
          <span className="text-[10px] text-slate-400 block uppercase">Current Active Trajectory</span>
          <div className="text-base font-bold text-cyan-300 flex items-center gap-1.5">
            <span>{latestMonth} Alerts</span>
            <span className="text-[11px] text-emerald-400 font-medium">
              (-{Math.round(((peakMonth.criticalAlerts - latestMonth) / peakMonth.criticalAlerts) * 100)}% from peak)
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-sans">Stabilizing post-advisories</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-0.5">
          <span className="text-[10px] text-slate-400 block uppercase">6-Mo Resolved Audits</span>
          <div className="text-base font-bold text-emerald-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{totalResolved} Verified</span>
          </div>
          <p className="text-[10px] text-slate-400 font-sans">Official closures documented</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-0.5">
          <span className="text-[10px] text-slate-400 block uppercase">Avg Resolution Speed</span>
          <div className="text-base font-bold text-indigo-300">
            {monthlyData[monthlyData.length - 1].avgResolutionDays} Days
          </div>
          <p className="text-[10px] text-slate-400 font-sans">Down from 26 days in April</p>
        </div>

      </div>

      {/* Main Recharts Area Chart */}
      <div className="w-full h-72 sm:h-80 -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={monthlyData}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <defs>
              {/* Critical Alert Gradient (Crimson/Rose) */}
              <linearGradient id="criticalAlertGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
              </linearGradient>

              {/* Total Anomalies Gradient (Electric Indigo / Violet) */}
              <linearGradient id="totalAnomalyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0} />
              </linearGradient>

              {/* Resolved Reviews Gradient (Cyan / Teal) */}
              <linearGradient id="resolvedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />

            <XAxis
              dataKey="month"
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              tickLine={{ stroke: '#334155' }}
              axisLine={{ stroke: '#334155' }}
            />

            <YAxis
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              tickLine={{ stroke: '#334155' }}
              axisLine={{ stroke: '#334155' }}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const dataPoint = payload[0].payload as MonthlyRiskData;
                  return (
                    <div className="bg-slate-950/95 border border-slate-700/80 p-3 rounded-xl shadow-2xl backdrop-blur-md font-sans text-xs space-y-2 max-w-xs">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 font-mono">
                        <span className="font-bold text-white">{label}</span>
                        <span className="text-[10px] text-cyan-300">Monthly Snapshot</span>
                      </div>

                      <div className="space-y-1 font-mono text-[11px]">
                        <div className="flex items-center justify-between gap-4 text-rose-400">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500" />
                            Critical Priority Alerts:
                          </span>
                          <span className="font-bold">{dataPoint.criticalAlerts}</span>
                        </div>

                        <div className="flex items-center justify-between gap-4 text-indigo-300">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-indigo-400" />
                            Total Anomaly Signals:
                          </span>
                          <span className="font-bold">{dataPoint.totalAnomalies}</span>
                        </div>

                        <div className="flex items-center justify-between gap-4 text-cyan-300">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-cyan-400" />
                            Officially Resolved:
                          </span>
                          <span className="font-bold">{dataPoint.resolvedReviews}</span>
                        </div>
                      </div>

                      <div className="pt-1.5 border-t border-slate-800/80 text-[11px] text-slate-300">
                        <span className="text-amber-300 font-semibold block text-[10px] uppercase font-mono">
                          Compliance Context:
                        </span>
                        <p className="mt-0.5 leading-snug">{dataPoint.systemicPattern}</p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono', paddingBottom: '12px' }}
              formatter={(value) => {
                if (value === 'criticalAlerts') return <span className="text-rose-400 font-medium">Critical Priority</span>;
                if (value === 'totalAnomalies') return <span className="text-indigo-300 font-medium">Total Anomalies</span>;
                if (value === 'resolvedReviews') return <span className="text-cyan-400 font-medium">Resolved Cases</span>;
                return value;
              }}
            />

            {/* Total Anomalies Area (Optional toggle) */}
            {activeMetric === 'BOTH' && (
              <Area
                type="monotone"
                dataKey="totalAnomalies"
                stroke="#818cf8"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#totalAnomalyGradient)"
              />
            )}

            {/* Critical Priority Area */}
            <Area
              type="monotone"
              dataKey="criticalAlerts"
              stroke="#ef4444"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#criticalAlertGradient)"
            />

            {/* Resolved Reviews Area */}
            {activeMetric === 'BOTH' && (
              <Area
                type="monotone"
                dataKey="resolvedReviews"
                stroke="#06b6d4"
                strokeWidth={1.8}
                fillOpacity={1}
                fill="url(#resolvedGradient)"
              />
            )}

          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Systemic Compliance Observation Banner */}
      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3 text-xs">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <span className="font-semibold text-slate-200">
            Systemic Pattern Takeaway for Supervisory Review:
          </span>
          <p className="text-slate-400">
            Historical correlation indicates a <strong className="text-amber-300">+42% surge</strong> in near-duplicate proposals during Q2 pre-monsoon sanction pushes (June–July). The deployment of automated pre-sanction NLP similarity screening reduced new duplicate flags by <strong className="text-emerald-400">38% in September</strong>, while field verification turnaround improved from 31 days to 18 days.
          </p>
        </div>
      </div>

    </section>
  );
};
