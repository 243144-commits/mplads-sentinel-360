import React, { useState } from 'react';
import { 
  Building, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  ShieldAlert, 
  IndianRupee, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { MPLADSWork } from '../../types';

interface AgencyNetworkProps {
  works: MPLADSWork[];
  onSelectWork: (work: MPLADSWork) => void;
}

export const AgencyNetwork: React.FC<AgencyNetworkProps> = ({
  works,
  onSelectWork,
}) => {
  const [selectedAgency, setSelectedAgency] = useState<string>('ALL');

  // Group by agency
  const agencyStats: Record<string, {
    totalBudget: number;
    worksCount: number;
    anomaliesCount: number;
    contractors: Set<string>;
    districts: Set<string>;
    sampleWorks: MPLADSWork[];
  }> = {};

  works.forEach((w) => {
    if (!agencyStats[w.implementingAgency]) {
      agencyStats[w.implementingAgency] = {
        totalBudget: 0,
        worksCount: 0,
        anomaliesCount: 0,
        contractors: new Set(),
        districts: new Set(),
        sampleWorks: []
      };
    }
    const stat = agencyStats[w.implementingAgency];
    stat.totalBudget += w.sanctionedAmount;
    stat.worksCount++;
    if (w.requiresVerification) stat.anomaliesCount++;
    if (w.contractorName) stat.contractors.add(w.contractorName);
    stat.districts.add(w.district);
    if (stat.sampleWorks.length < 3) stat.sampleWorks.push(w);
  });

  const sortedAgencies = Object.entries(agencyStats)
    .sort((a, b) => b[1].anomaliesCount - a[1].anomaliesCount);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
            Implementing Agency & Contractor Network
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Tender concentration monitoring, single-bidder cluster detection, and cross-district contractor nexus analytics.
          </p>
        </div>
      </div>

      {/* Overview Highlight Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-900/40 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <span className="font-semibold text-white">
            Algorithmic Concentration Threshold:
          </span>
          <p className="text-slate-300 leading-relaxed">
            Agencies or contractors with &gt; 35% concentration of district works within a single 60-day window trigger mandatory procurement pattern review under SIH26102 vigilance guidelines.
          </p>
        </div>
      </div>

      {/* Agency Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedAgencies.map(([agencyName, stats]) => {
          const concentrationRisk = stats.anomaliesCount >= 4;
          return (
            <div
              key={agencyName}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-indigo-500/50 transition-all space-y-4 shadow-lg group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center">
                    <Building className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {agencyName}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Operating in {stats.districts.size} Districts · {stats.contractors.size} Mapped Contractors
                    </span>
                  </div>
                </div>

                {concentrationRisk && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800 whitespace-nowrap">
                    Concentration Alert
                  </span>
                )}
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800 font-mono text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] block">TOTAL BUDGET</span>
                  <span className="text-slate-200 font-semibold">₹{(stats.totalBudget / 100).toFixed(1)} Cr</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">ASSIGNED WORKS</span>
                  <span className="text-slate-200 font-semibold">{stats.worksCount} Works</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">ANOMALY FLAGS</span>
                  <span className={`font-semibold ${stats.anomaliesCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {stats.anomaliesCount} Cases
                  </span>
                </div>
              </div>

              {/* Sample Works */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono uppercase text-slate-500">
                  Recent High-Priority Assignments:
                </span>
                <div className="space-y-1">
                  {stats.sampleWorks.map((work) => (
                    <div
                      key={work.id}
                      onClick={() => onSelectWork(work)}
                      className="p-2 rounded-lg bg-slate-950/40 hover:bg-slate-800 border border-slate-800/60 flex items-center justify-between text-xs cursor-pointer"
                    >
                      <span className="font-mono text-cyan-400 font-semibold">{work.workCode}</span>
                      <span className="text-slate-300 truncate max-w-xs">{work.title}</span>
                      <span className="font-mono text-slate-400">₹{work.sanctionedAmount}L</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
