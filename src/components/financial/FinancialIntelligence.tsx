import React, { useState } from 'react';
import { 
  IndianRupee, 
  TrendingUp, 
  AlertTriangle, 
  BarChart3, 
  SlidersHorizontal,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { MPLADSWork } from '../../types';
import { RiskBadge } from '../common/RiskBadge';

interface FinancialIntelligenceProps {
  works: MPLADSWork[];
  onSelectWork: (work: MPLADSWork) => void;
}

export const FinancialIntelligence: React.FC<FinancialIntelligenceProps> = ({
  works,
  onSelectWork,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Filtered dataset
  const filtered = selectedCategory === 'ALL' 
    ? works 
    : works.filter(w => w.category === selectedCategory);

  // Category aggregates
  const categoryStats: Record<string, { totalSanction: number; totalExpenditure: number; count: number; outliersCount: number }> = {};
  works.forEach(w => {
    if (!categoryStats[w.category]) {
      categoryStats[w.category] = { totalSanction: 0, totalExpenditure: 0, count: 0, outliersCount: 0 };
    }
    categoryStats[w.category].totalSanction += w.sanctionedAmount;
    categoryStats[w.category].totalExpenditure += w.totalExpenditure;
    categoryStats[w.category].count++;
    if (w.anomalyTypes.includes('COST_OUTLIER') || w.anomalyTypes.includes('EXPENDITURE_MISMATCH')) {
      categoryStats[w.category].outliersCount++;
    }
  });

  // Outlier works sorted by cost deviation
  const costOutliers = [...works]
    .filter(w => w.anomalyTypes.includes('COST_OUTLIER') || w.anomalyTypes.includes('EXPENDITURE_MISMATCH'))
    .sort((a, b) => b.sanctionedAmount - a.sanctionedAmount)
    .slice(0, 6);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
            Financial Intelligence & Peer-Group Benchmarking
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Statistical unit-cost analysis, expenditure velocity tracking, and peer group dispersion models.
          </p>
        </div>

        {/* Category filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
        >
          <option value="ALL">All Categories</option>
          {Object.keys(categoryStats).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Total Sanctions</span>
          <div className="text-xl font-bold font-mono text-white tabular-nums">
            ₹{(works.reduce((s, w) => s + w.sanctionedAmount, 0) / 100).toFixed(2)} Cr
          </div>
          <p className="text-[11px] text-slate-400">Total authorized capital</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Released Expenditure</span>
          <div className="text-xl font-bold font-mono text-cyan-300 tabular-nums">
            ₹{(works.reduce((s, w) => s + w.totalExpenditure, 0) / 100).toFixed(2)} Cr
          </div>
          <p className="text-[11px] text-slate-400">Disbursed through state treasuries</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-rose-400 uppercase font-semibold">Cost Outliers Flagged</span>
          <div className="text-xl font-bold font-mono text-rose-300 tabular-nums">
            {works.filter(w => w.anomalyTypes.includes('COST_OUTLIER')).length}
          </div>
          <p className="text-[11px] text-slate-400">&gt; +60% above peer-group median</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold">Velocity Divergences</span>
          <div className="text-xl font-bold font-mono text-amber-300 tabular-nums">
            {works.filter(w => w.anomalyTypes.includes('EXPENDITURE_MISMATCH')).length}
          </div>
          <p className="text-[11px] text-slate-400">Financial outpacing physical &gt; 25%</p>
        </div>
      </div>

      {/* Main Analysis: Category Financial Velocity & Dispersion */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Category Bar Comparisons */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Sanctioned Budget vs Actual Expenditure by Category
              </h2>
              <p className="text-xs text-slate-400">
                Visualizing fund absorption and outlier concentration across development sectors
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(categoryStats).map(([cat, stats]) => {
              const utilPct = ((stats.totalExpenditure / (stats.totalSanction || 1)) * 100).toFixed(0);
              return (
                <div key={cat} className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-200 font-medium">{cat}</span>
                    <span className="font-mono text-slate-400">
                      ₹{(stats.totalExpenditure / 100).toFixed(1)}Cr / ₹{(stats.totalSanction / 100).toFixed(1)}Cr ({utilPct}%)
                    </span>
                  </div>

                  {/* Dual comparison bar */}
                  <div className="w-full h-3 bg-slate-950 rounded-md overflow-hidden p-0.5 border border-slate-800/80">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-sm"
                      style={{ width: `${Math.min(100, Number(utilPct))}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{stats.count} monitored works</span>
                    {stats.outliersCount > 0 ? (
                      <span className="text-amber-400">{stats.outliersCount} cost / velocity flags</span>
                    ) : (
                      <span className="text-emerald-400">Baseline compliant</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Outlier Focus Dossier Cards */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-white">
              Highest Financial Discrepancy Cases
            </h2>
            <p className="text-xs text-slate-400">
              Works flagged by statistical peer-group or expenditure velocity rules
            </p>
          </div>

          <div className="space-y-3">
            {costOutliers.map((work) => (
              <div
                key={work.id}
                onClick={() => onSelectWork(work)}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-indigo-500/50 cursor-pointer transition-all space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-400 group-hover:underline">
                    {work.workCode}
                  </span>
                  <RiskBadge score={work.reviewPriorityScore} size="sm" showLabel={false} />
                </div>

                <h4 className="text-xs font-medium text-slate-200 line-clamp-1">
                  {work.title}
                </h4>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                  <span>Sanction: ₹{work.sanctionedAmount}L</span>
                  <span>Physical: {work.physicalProgress}%</span>
                  <span className="text-rose-400 font-semibold">Disbursed: {work.financialProgress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
