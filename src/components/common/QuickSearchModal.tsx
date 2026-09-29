import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, AlertTriangle, Building, MapPin } from 'lucide-react';
import { MPLADSWork } from '../../types';
import { RiskBadge } from './RiskBadge';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  works: MPLADSWork[];
  onSelectWork: (work: MPLADSWork) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  works,
  onSelectWork,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = works
    .filter((w) => {
      const q = query.toLowerCase().trim();
      if (!q) return w.requiresVerification;
      return (
        w.workCode.toLowerCase().includes(q) ||
        w.title.toLowerCase().includes(q) ||
        w.district.toLowerCase().includes(q) ||
        w.state.toLowerCase().includes(q) ||
        w.implementingAgency.toLowerCase().includes(q) ||
        w.mpName.toLowerCase().includes(q)
      );
    })
    .slice(0, 8);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800">
          <Search className="w-5 h-5 text-indigo-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search work code, project name, district, agency, or MP..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-200 p-1 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-800 border border-slate-700 font-mono"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-slate-800/60">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No matching works found for "{query}". Try searching by state, district, or MP code.
            </div>
          ) : (
            filtered.map((work) => (
              <button
                key={work.id}
                onClick={() => {
                  onSelectWork(work);
                  onClose();
                }}
                className="w-full p-3 rounded-lg hover:bg-slate-800/60 transition-colors text-left flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">
                      {work.workCode}
                    </span>
                    <span className="text-slate-500">·</span>
                    <span className="text-xs text-slate-400">{work.category}</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {work.district}, {work.state}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-200 group-hover:text-white line-clamp-1">
                    {work.title}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                    <span>Sanction: ₹{work.sanctionedAmount}L</span>
                    <span>·</span>
                    <span>Physical: {work.physicalProgress}%</span>
                    <span>·</span>
                    <span>Agency: {work.implementingAgency.slice(0, 24)}...</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <RiskBadge score={work.reviewPriorityScore} size="sm" showLabel={false} />
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800/60 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Tip: Filter by district (e.g. Pune, Varanasi, Belagavi) or anomaly signals</span>
          <span className="font-mono">{filtered.length} matches shown</span>
        </div>
      </div>
    </div>
  );
};
