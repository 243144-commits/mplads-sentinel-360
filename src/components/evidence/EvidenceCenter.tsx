import React, { useState } from 'react';
import { 
  FileCheck, 
  FileWarning, 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Filter, 
  ExternalLink 
} from 'lucide-react';
import { MPLADSWork, EvidenceStatus, EvidenceItem } from '../../types';

interface EvidenceCenterProps {
  works: MPLADSWork[];
  onSelectWork: (work: MPLADSWork) => void;
}

export const EvidenceCenter: React.FC<EvidenceCenterProps> = ({
  works,
  onSelectWork,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  // Flatten evidence items across works
  const allEvidences = React.useMemo(() => {
    const list: { evidence: EvidenceItem; work: MPLADSWork }[] = [];
    works.forEach(w => {
      w.evidenceList.forEach(ev => {
        list.push({ evidence: ev, work: w });
      });
    });
    return list;
  }, [works]);

  const filtered = allEvidences.filter(({ evidence }) => {
    if (selectedStatus !== 'ALL' && evidence.status !== selectedStatus) return false;
    if (selectedType !== 'ALL' && evidence.type !== selectedType) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
              Evidence Fusion & Document Verification Center
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-800 text-indigo-300">
              {allEvidences.length} Registered Records
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Unified repository of Detailed Project Reports (DPR), Measurement Books (MB), GPS-tagged site photographs, and statutory Completion Certificates.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Evidence Statuses</option>
            <option value="INCONSISTENT">Inconsistent / Discrepancy Flag</option>
            <option value="MISSING">Missing Mandatory Document</option>
            <option value="PENDING">Pending Officer Review</option>
            <option value="VERIFIED">Officially Verified</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Document Types</option>
            <option value="SANCTION_ORDER">Sanction Orders</option>
            <option value="MB_RECORD">Measurement Books (MB)</option>
            <option value="GEO_PHOTO">Geo-Tagged Site Imagery</option>
            <option value="COMPLETION_CERT">Completion Certificates</option>
          </select>
        </div>
      </div>

      {/* Grid of Evidence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(({ evidence, work }) => (
          <div
            key={evidence.id}
            onClick={() => onSelectWork(work)}
            className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all space-y-3 shadow-lg group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <h3 className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {evidence.title}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400 block">{evidence.documentRef}</span>
                </div>
              </div>

              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border whitespace-nowrap ${
                evidence.status === 'VERIFIED'
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                  : evidence.status === 'INCONSISTENT'
                  ? 'bg-rose-950/60 text-rose-300 border-rose-800 animate-pulse'
                  : evidence.status === 'MISSING'
                  ? 'bg-amber-950/60 text-amber-300 border-amber-800'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {evidence.status}
              </span>
            </div>

            {/* Work reference */}
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-cyan-400">{work.workCode}</span>
                <span className="text-[10px] text-slate-500">{work.district}</span>
              </div>
              <p className="text-[11px] text-slate-300 line-clamp-1">{work.title}</p>
            </div>

            {evidence.notes && (
              <p className="text-[11px] text-amber-300/90 bg-amber-950/30 p-2 rounded border border-amber-900/40">
                Audit Note: {evidence.notes}
              </p>
            )}

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800">
              <span>By: {evidence.uploadedBy}</span>
              <span>{evidence.uploadedDate}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
