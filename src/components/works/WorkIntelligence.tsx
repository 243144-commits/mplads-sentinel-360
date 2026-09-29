import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Building, 
  ArrowUpDown, 
  Eye, 
  CheckCircle2, 
  Clock, 
  SlidersHorizontal,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { MPLADSWork, ProjectCategory, ProjectStatus, RiskLevel } from '../../types';
import { RiskBadge } from '../common/RiskBadge';

interface WorkIntelligenceProps {
  works: MPLADSWork[];
  onSelectWork: (work: MPLADSWork) => void;
  initialFilter?: { status?: string; category?: string };
}

export const WorkIntelligence: React.FC<WorkIntelligenceProps> = ({
  works,
  onSelectWork,
  initialFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState(initialFilter?.category || 'ALL');
  const [selectedStatus, setSelectedStatus] = useState(initialFilter?.status || 'ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [selectedAgency, setSelectedAgency] = useState('ALL');
  const [sortBy, setSortBy] = useState<'PRIORITY' | 'AMOUNT_DESC' | 'PROGRESS_ASC' | 'PROGRESS_DESC'>('PRIORITY');
  const [viewMode, setViewMode] = useState<'TABLE' | 'CARDS'>('TABLE');

  // Filter options lists
  const statesList = useMemo(() => Array.from(new Set(works.map(w => w.state))).sort(), [works]);
  const categoriesList = useMemo(() => Array.from(new Set(works.map(w => w.category))).sort(), [works]);
  const agenciesList = useMemo(() => Array.from(new Set(works.map(w => w.implementingAgency))).sort(), [works]);

  // Filtered & Sorted Works
  const filteredWorks = useMemo(() => {
    return works.filter(w => {
      if (selectedState !== 'ALL' && w.state !== selectedState) return false;
      if (selectedCategory !== 'ALL' && w.category !== selectedCategory) return false;
      if (selectedStatus !== 'ALL' && w.status !== selectedStatus) return false;
      if (selectedRisk !== 'ALL' && w.riskLevel !== selectedRisk) return false;
      if (selectedAgency !== 'ALL' && w.implementingAgency !== selectedAgency) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          w.workCode.toLowerCase().includes(q) ||
          w.title.toLowerCase().includes(q) ||
          w.district.toLowerCase().includes(q) ||
          w.implementingAgency.toLowerCase().includes(q) ||
          w.mpName.toLowerCase().includes(q)
        );
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'PRIORITY') return b.reviewPriorityScore - a.reviewPriorityScore;
      if (sortBy === 'AMOUNT_DESC') return b.sanctionedAmount - a.sanctionedAmount;
      if (sortBy === 'PROGRESS_ASC') return a.physicalProgress - b.physicalProgress;
      if (sortBy === 'PROGRESS_DESC') return b.physicalProgress - a.physicalProgress;
      return 0;
    });
  }, [works, selectedState, selectedCategory, selectedStatus, selectedRisk, selectedAgency, searchQuery, sortBy]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
            Work Intelligence & Project Registry
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Master database of {works.length} monitored public development projects under MPLADS.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setViewMode('TABLE')}
              className={`px-3 py-1 rounded transition-colors ${
                viewMode === 'TABLE' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Data Table
            </button>
            <button
              onClick={() => setViewMode('CARDS')}
              className={`px-3 py-1 rounded transition-colors ${
                viewMode === 'CARDS' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Card View
            </button>
          </div>
        </div>
      </div>

      {/* Filter Matrix */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search query */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search code, title, district, agency..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* State */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All States ({statesList.length})</option>
            {statesList.map(st => <option key={st} value={st}>{st}</option>)}
          </select>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Categories ({categoriesList.length})</option>
            {categoriesList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Execution Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="UNDER_VERIFICATION">Under Verification</option>
            <option value="STALLED">Stalled / Delayed</option>
            <option value="SANCTIONED">Sanctioned (New)</option>
          </select>
        </div>

        {/* Secondary filter & sorting row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-xs text-slate-300 focus:outline-none"
            >
              <option value="PRIORITY">Review Priority Score (Highest)</option>
              <option value="AMOUNT_DESC">Sanctioned Amount (Highest)</option>
              <option value="PROGRESS_ASC">Physical Progress (Lowest)</option>
              <option value="PROGRESS_DESC">Physical Progress (Highest)</option>
            </select>
          </div>

          <div className="text-slate-400 font-mono text-[11px]">
            Showing <strong className="text-white">{filteredWorks.length}</strong> of {works.length} works
          </div>
        </div>
      </div>

      {/* Main Table / Grid View */}
      {filteredWorks.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-slate-900/40 border border-slate-800 p-8 space-y-3">
          <p className="text-sm font-semibold text-white">No works matching selected filters</p>
          <p className="text-xs text-slate-400">Clear filters to view all monitored records.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedState('ALL');
              setSelectedCategory('ALL');
              setSelectedStatus('ALL');
              setSelectedRisk('ALL');
              setSelectedAgency('ALL');
            }}
            className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-medium"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'TABLE' ? (
        <div className="overflow-x-auto rounded-2xl bg-slate-900/80 border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400">
              <tr>
                <th className="py-3 px-4">Work Code</th>
                <th className="py-3 px-4">Title & Location</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Sanctioned</th>
                <th className="py-3 px-4 text-right">Expenditure</th>
                <th className="py-3 px-4 text-right">Physical %</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Priority</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredWorks.slice(0, 50).map((work) => (
                <tr
                  key={work.id}
                  onClick={() => onSelectWork(work)}
                  className="hover:bg-slate-850/60 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                    {work.workCode}
                  </td>
                  <td className="py-3 px-4 max-w-sm">
                    <span className="font-medium text-slate-200 block truncate">{work.title}</span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {work.district}, {work.state}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                    {work.category}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-200 tabular-nums">
                    ₹{work.sanctionedAmount}L
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-cyan-300 tabular-nums">
                    ₹{work.totalExpenditure}L
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums">
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="text-white">{work.physicalProgress}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      work.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      work.status === 'UNDER_VERIFICATION' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      work.status === 'STALLED' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {work.status}
                    </span>
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

          {filteredWorks.length > 50 && (
            <div className="p-3 text-center text-xs text-slate-400 border-t border-slate-800 font-mono">
              Displaying first 50 results of {filteredWorks.length}. Refine filters for more specific queries.
            </div>
          )}
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWorks.slice(0, 30).map((work) => (
            <div
              key={work.id}
              onClick={() => onSelectWork(work)}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer space-y-3 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-xs font-bold text-cyan-400">
                    {work.workCode}
                  </span>
                  <h3 className="text-xs font-medium text-slate-200 group-hover:text-white line-clamp-2 mt-1">
                    {work.title}
                  </h3>
                </div>
                <RiskBadge score={work.reviewPriorityScore} size="sm" showLabel={false} />
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-500" />
                <span>{work.district}, {work.state}</span>
                <span className="text-slate-600">·</span>
                <span>{work.category}</span>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between font-mono text-[11px]">
                <span className="text-slate-300">Sanction: ₹{work.sanctionedAmount}L</span>
                <span className="text-emerald-400">{work.physicalProgress}% Completed</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
