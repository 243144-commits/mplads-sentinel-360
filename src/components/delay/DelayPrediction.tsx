import React, { useState } from 'react';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingDown, 
  Calendar, 
  Filter, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { MPLADSWork } from '../../types';
import { RiskBadge } from '../common/RiskBadge';

interface DelayPredictionProps {
  works: MPLADSWork[];
  onSelectWork: (work: MPLADSWork) => void;
}

export const DelayPrediction: React.FC<DelayPredictionProps> = ({
  works,
  onSelectWork,
}) => {
  const [selectedRiskFactor, setSelectedRiskFactor] = useState<string>('ALL');

  // Filtered delayed works
  const delayedWorks = works.filter((w) => {
    if (selectedRiskFactor !== 'ALL' && w.delayRiskFactor !== selectedRiskFactor) return false;
    return w.predictedDelayMonths > 0 || w.status === 'STALLED';
  }).sort((a, b) => b.predictedDelayMonths - a.predictedDelayMonths);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
            AI Project Delay Early Warning & Timeline Predictor
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Predictive time-series model analyzing milestone velocity, seasonal lead times, contractor historical slippage, and material procurement cycles.
          </p>
        </div>

        {/* Filter */}
        <select
          value={selectedRiskFactor}
          onChange={(e) => setSelectedRiskFactor(e.target.value)}
          className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
        >
          <option value="ALL">All Delay Risk Profiles ({delayedWorks.length})</option>
          <option value="SEVERE">Critical Delay Risk (&gt; 6 Months)</option>
          <option value="MODERATE">Moderate Timeline Slip (2 - 5 Months)</option>
          <option value="NORMAL">Minor Variance (&lt; 2 Months)</option>
        </select>
      </div>

      {/* Overview Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-1">
          <span className="text-[10px] font-mono uppercase text-rose-400 font-semibold">Critical Delay Risk</span>
          <div className="text-2xl font-bold font-mono text-rose-300 tabular-nums">
            {works.filter(w => w.delayRiskFactor === 'SEVERE').length}
          </div>
          <p className="text-[11px] text-slate-400">&gt; 6 months past target deadline</p>
        </div>

        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 space-y-1">
          <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold">Moderate Slippage</span>
          <div className="text-2xl font-bold font-mono text-amber-300 tabular-nums">
            {works.filter(w => w.delayRiskFactor === 'MODERATE').length}
          </div>
          <p className="text-[11px] text-slate-400">Milestone velocity decelerating</p>
        </div>

        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-1">
          <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold">On Track / Nominal</span>
          <div className="text-2xl font-bold font-mono text-emerald-300 tabular-nums">
            {works.filter(w => w.delayRiskFactor === 'NORMAL' && w.status !== 'STALLED').length}
          </div>
          <p className="text-[11px] text-slate-400">Milestones adhering to timeline</p>
        </div>
      </div>

      {/* Delay Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {delayedWorks.slice(0, 20).map((work) => {
          const expectedProgress = Math.min(100, Math.round(work.physicalProgress + work.predictedDelayMonths * 12));
          const progressGap = Math.max(0, expectedProgress - work.physicalProgress);

          return (
            <div
              key={work.id}
              onClick={() => onSelectWork(work)}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer space-y-4 shadow-lg group"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400 group-hover:underline">
                      {work.workCode}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-xs text-slate-400">{work.district}, {work.state}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-100 group-hover:text-white line-clamp-1 mt-1">
                    {work.title}
                  </h3>
                </div>

                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border whitespace-nowrap ${
                  work.delayRiskFactor === 'SEVERE'
                    ? 'bg-rose-950/60 text-rose-300 border-rose-800'
                    : 'bg-amber-950/60 text-amber-300 border-amber-800'
                }`}>
                  +{work.predictedDelayMonths} Months Slip
                </span>
              </div>

              {/* Progress Comparison Visual */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Actual Physical: {work.physicalProgress}%</span>
                  <span className="text-cyan-300">Expected by Target: {expectedProgress}%</span>
                </div>

                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
                  <div 
                    className="h-full bg-emerald-400 rounded-full" 
                    style={{ width: `${work.physicalProgress}%` }} 
                  />
                  <div 
                    className="h-full bg-rose-500/60" 
                    style={{ width: `${progressGap}%` }} 
                  />
                </div>
              </div>

              {/* Dates & Agency */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                <div>Target Date: {work.targetCompletionDate}</div>
                <div className="text-right text-slate-300">{work.implementingAgency.slice(0, 24)}...</div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
