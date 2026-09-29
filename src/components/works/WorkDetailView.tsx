import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Building, 
  User, 
  IndianRupee, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Send, 
  ShieldCheck, 
  Printer, 
  ExternalLink,
  HelpCircle,
  FileCheck2,
  FileWarning
} from 'lucide-react';
import { MPLADSWork, UserRole, EvidenceItem, ProjectStatus } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { AIAssistantDossier } from '../ai/AIAssistantDossier';

interface WorkDetailViewProps {
  work: MPLADSWork;
  onBack: () => void;
  activeRole: UserRole;
  onAddAuditLog: (workId: string, workCode: string, action: any, details: string) => void;
  onUpdateWorkStatus?: (workId: string, newStatus: ProjectStatus) => void;
}

export const WorkDetailView: React.FC<WorkDetailViewProps> = ({
  work,
  onBack,
  activeRole,
  onAddAuditLog,
  onUpdateWorkStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'AI_INVESTIGATION' | 'SIGNALS' | 'PAYMENTS' | 'EVIDENCE' | 'AUDIT'>('OVERVIEW');
  const [auditComment, setAuditComment] = useState('');
  const [statusUpdatedToast, setStatusUpdatedToast] = useState<string | null>(null);

  // Financial calculations
  const expenditurePercentage = work.sanctionedAmount > 0 
    ? ((work.totalExpenditure / work.sanctionedAmount) * 100).toFixed(1)
    : '0';

  const handlePostAuditComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditComment.trim()) return;

    onAddAuditLog(work.id, work.workCode, 'COMMENT_ADDED', auditComment.trim());
    setAuditComment('');
    setStatusUpdatedToast('Audit note logged to official immutable ledger.');
    setTimeout(() => setStatusUpdatedToast(null), 3000);
  };

  const handleMarkVerification = (status: ProjectStatus) => {
    if (onUpdateWorkStatus) {
      onUpdateWorkStatus(work.id, status);
    }
    onAddAuditLog(
      work.id, 
      work.workCode, 
      'STATUS_UPDATED', 
      `Verification status adjusted to ${status} by ${activeRole}.`
    );
    setStatusUpdatedToast(`Project updated to ${status}.`);
    setTimeout(() => setStatusUpdatedToast(null), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top action navigation */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to List</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier</span>
          </button>

          {/* Quick status actions for officers */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => handleMarkVerification('UNDER_VERIFICATION')}
              className="px-2.5 py-1 rounded bg-amber-600/20 text-amber-300 hover:bg-amber-600/30 transition-colors"
            >
              Mark for Field Inspection
            </button>
            <button
              onClick={() => handleMarkVerification('COMPLETED')}
              className="px-2.5 py-1 rounded bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 transition-colors"
            >
              Verify & Close
            </button>
          </div>
        </div>
      </div>

      {statusUpdatedToast && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{statusUpdatedToast}</span>
        </div>
      )}

      {/* Main Project Header Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-[#070b16] border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-mono font-bold text-base text-cyan-400">
                {work.workCode}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-300 font-medium">{work.category}</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {work.locationName}
              </span>
              <span className="text-slate-600">·</span>
              <span className="font-mono text-slate-400">Year {work.sanctionYear}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {work.title}
            </h1>

            <p className="text-xs text-slate-400 flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span>Recommended by: <strong>{work.mpName}</strong></span>
              <span className="text-slate-600">·</span>
              <span>Constituency: {work.constituency}</span>
            </p>
          </div>

          {/* Review Priority Score Card */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 shrink-0 text-right space-y-1">
            <div className="text-[10px] font-mono uppercase text-slate-400">
              Review Priority Index
            </div>
            <div className="flex items-center justify-end gap-2">
              <RiskBadge score={work.reviewPriorityScore} size="lg" />
            </div>
            <p className="text-[11px] text-slate-400">
              {work.requiresVerification ? 'Requires Official Verification' : 'Standard Routine Monitoring'}
            </p>
          </div>
        </div>

        {/* Progress & Financial Snapshot Bars */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 font-mono text-xs">
          <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/60">
            <span className="text-slate-500 text-[10px] block">SANCTIONED BUDGET</span>
            <span className="text-base font-bold text-white">₹{work.sanctionedAmount} Lakhs</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Est: ₹{work.estimatedCost}L</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/60">
            <span className="text-slate-500 text-[10px] block">TOTAL EXPENDITURE</span>
            <span className="text-base font-bold text-cyan-300">₹{work.totalExpenditure} Lakhs</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">{expenditurePercentage}% of budget</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/60">
            <span className="text-slate-500 text-[10px] block">PHYSICAL PROGRESS</span>
            <span className="text-base font-bold text-emerald-300">{work.physicalProgress}%</span>
            <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${work.physicalProgress}%` }} />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/60">
            <span className="text-slate-500 text-[10px] block">CURRENT STATUS</span>
            <span className="text-xs font-bold text-indigo-300 block mt-0.5">{work.status}</span>
            <span className="text-[10px] text-slate-400 block">
              {work.predictedDelayMonths > 0 ? `+${work.predictedDelayMonths} mo projected delay` : 'On Timeline'}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation for Detailed Sections */}
      <div className="flex items-center gap-1 border-b border-slate-800 overflow-x-auto">
        {[
          { id: 'OVERVIEW', label: 'Overview & Agency' },
          { id: 'AI_INVESTIGATION', label: '✦ Live Gemini AI Analysis' },
          { id: 'SIGNALS', label: 'AI Anomaly Signals (' + (work.anomalySignals?.length || 0) + ')' },
          { id: 'PAYMENTS', label: 'Payment Milestones' },
          { id: 'EVIDENCE', label: 'Evidence & Documents (' + work.evidenceList.length + ')' },
          { id: 'AUDIT', label: 'Audit Trail & Notes' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-indigo-500 text-cyan-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Live AI Investigation Tab */}
      {activeTab === 'AI_INVESTIGATION' && (
        <AIAssistantDossier work={work} />
      )}

      {/* Tab 1: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Implementing Agency & Timeline */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-400" />
                Implementing Agency & Contractor Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Nodal Implementing Agency:</span>
                  <span className="text-slate-200 font-medium">{work.implementingAgency}</span>
                </div>

                <div>
                  <span className="text-slate-500 block">Assigned Contractor / Vendor:</span>
                  <span className="text-slate-200 font-medium">{work.contractorName || 'Departmental Execution'}</span>
                </div>

                <div>
                  <span className="text-slate-500 block">Department Contact / Division:</span>
                  <span className="text-slate-200 font-mono">{work.agencyContact || 'Superintending Engineer'}</span>
                </div>

                <div>
                  <span className="text-slate-500 block">Geographic Centroid (GPS):</span>
                  <span className="text-cyan-400 font-mono">{work.latitude}, {work.longitude}</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                Milestone Execution Timeline
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">SANCTION DATE</span>
                  <span className="text-slate-200">{work.sanctionDate}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">WORK COMMENCEMENT</span>
                  <span className="text-slate-200">{work.commencementDate}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">TARGET COMPLETION</span>
                  <span className="text-amber-300">{work.targetCompletionDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: "Risk DNA" multidimensional breakdown */}
          <div className="lg:col-span-5 p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Multidimensional "Risk DNA"
              </h2>
              <p className="text-xs text-slate-400">
                Attribution vectors contributing to review priority score
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {[
                { 
                  name: 'Financial & Cost Deviation', 
                  score: work.anomalyTypes.includes('COST_OUTLIER') ? 85 : work.anomalyTypes.includes('EXPENDITURE_MISMATCH') ? 78 : 20,
                  level: work.anomalyTypes.includes('COST_OUTLIER') ? 'HIGH' : 'LOW'
                },
                { 
                  name: 'Milestone Timeline Slip', 
                  score: work.predictedDelayMonths > 6 ? 90 : work.predictedDelayMonths > 2 ? 60 : 15,
                  level: work.predictedDelayMonths > 6 ? 'CRITICAL' : 'LOW'
                },
                { 
                  name: 'Duplicate & Similarity Signal', 
                  score: work.similarityScore || 10,
                  level: (work.similarityScore || 0) > 80 ? 'CRITICAL' : 'LOW'
                },
                { 
                  name: 'Agency Concentration Index', 
                  score: work.anomalyTypes.includes('AGENCY_CONCENTRATION') ? 82 : 25,
                  level: work.anomalyTypes.includes('AGENCY_CONCENTRATION') ? 'HIGH' : 'LOW'
                },
                { 
                  name: 'Geospatial & GPS Integrity', 
                  score: work.anomalyTypes.includes('GEO_PROXIMITY') ? 88 : 18,
                  level: work.anomalyTypes.includes('GEO_PROXIMITY') ? 'HIGH' : 'LOW'
                },
                { 
                  name: 'Evidence & Document Completeness', 
                  score: work.evidenceList.some(e => e.status === 'INCONSISTENT' || e.status === 'MISSING') ? 80 : 12,
                  level: work.evidenceList.some(e => e.status === 'INCONSISTENT') ? 'HIGH' : 'LOW'
                }
              ].map((dim) => (
                <div key={dim.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{dim.name}</span>
                    <span className="font-mono text-slate-400">{dim.score} / 100</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        dim.score > 75 ? 'bg-rose-500' : dim.score > 45 ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${dim.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                Explainability Notice:
              </span>
              <p>
                Scores reflect automated algorithmic prioritization. No determination of non-compliance is definitive until physical inspection and audit verification.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: ANOMALY SIGNALS ("WHY WAS THIS FLAGGED?") */}
      {activeTab === 'SIGNALS' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Detailed Anomaly Explanations & Evidence Fusion
              </h2>
              <p className="text-xs text-slate-400">
                Transparent feature contributions behind why this work was placed in the verification priority queue.
              </p>
            </div>
            <span className="text-xs font-mono text-indigo-300 px-2.5 py-1 rounded bg-indigo-950/50 border border-indigo-800">
              {work.anomalySignals?.length || 0} Signals Detected
            </span>
          </div>

          {(!work.anomalySignals || work.anomalySignals.length === 0) ? (
            <div className="py-12 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
              No anomaly signals recorded. This project maintains nominal status within standard peer-group baselines.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {work.anomalySignals.map((signal, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-950 text-cyan-300 border border-indigo-800">
                        Signal {idx + 1}: {signal.category}
                      </span>
                      <h3 className="text-sm font-semibold text-white">
                        {signal.name}
                      </h3>
                    </div>

                    <span className="text-xs font-mono font-semibold text-rose-400 bg-rose-950/30 px-2 py-0.5 rounded border border-rose-900/40">
                      +{signal.scoreContribution} Priority Pts
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed">
                    {signal.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                      <span className="text-slate-500 block text-[11px]">DOCUMENTED EVIDENCE</span>
                      <span className="text-slate-300 font-mono">{signal.evidence}</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                      <span className="text-slate-500 block text-[11px]">COMPARISON BASELINE</span>
                      <span className="text-slate-300 font-mono">{signal.baseline}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                    <span className="text-cyan-400 font-medium">Recommended Next Verification Step:</span>
                    <span className="text-slate-300">
                      Physical site inspection & cross-verification with Measurement Book #MB-{work.workCode.slice(3)}.
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: PAYMENT MILESTONES */}
      {activeTab === 'PAYMENTS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Disbursement Ledger & Payment Vouchers
              </h2>
              <p className="text-xs text-slate-400">
                Tranche release history mapped to physical progress claims
              </p>
            </div>
            <span className="font-mono text-xs text-slate-300">
              Total Disbursed: ₹{work.totalExpenditure}L / ₹{work.sanctionedAmount}L
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl bg-slate-900/80 border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400">
                <tr>
                  <th className="py-3 px-4">Installment</th>
                  <th className="py-3 px-4">Voucher No.</th>
                  <th className="py-3 px-4">Disbursement Date</th>
                  <th className="py-3 px-4 text-right">Amount (Lakhs)</th>
                  <th className="py-3 px-4 text-right">Claimed Progress</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Audit Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {work.payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-850/60">
                    <td className="py-3 px-4 font-mono font-medium text-slate-300">
                      Tranche #{p.installmentNumber}
                    </td>
                    <td className="py-3 px-4 font-mono text-cyan-400">
                      {p.voucherNumber}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {p.disbursementDate}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white tabular-nums">
                      ₹{p.amount.toFixed(2)}L
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-300 tabular-nums">
                      {p.physicalProgressClaimed}%
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        p.status === 'DISBURSED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {p.remarks || 'Standard electronic fund transfer through PFMS.'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: EVIDENCE CENTER FOR THIS WORK */}
      {activeTab === 'EVIDENCE' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Project Evidence & Verification Documents
              </h2>
              <p className="text-xs text-slate-400">
                Uploaded DPR, Measurement Books, Geotagged Photographs, and Completion Certificates
              </p>
            </div>
            <button
              onClick={() => {
                setStatusUpdatedToast('Uploaded supplemental field verification report.');
                setTimeout(() => setStatusUpdatedToast(null), 3000);
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
            >
              Upload Supplemental Document
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {work.evidenceList.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <h3 className="text-xs font-semibold text-white">{item.title}</h3>
                      <span className="text-[10px] font-mono text-slate-400 block">{item.documentRef}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    item.status === 'VERIFIED'
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                      : item.status === 'INCONSISTENT'
                      ? 'bg-rose-950/60 text-rose-300 border-rose-800 animate-pulse'
                      : item.status === 'MISSING'
                      ? 'bg-amber-950/60 text-amber-300 border-amber-800'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {item.status}
                  </span>
                </div>

                {item.notes && (
                  <p className="text-xs text-amber-300/90 bg-amber-950/30 p-2 rounded border border-amber-900/40">
                    Flag Note: {item.notes}
                  </p>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800 font-mono">
                  <span>Uploaded by: {item.uploadedBy}</span>
                  <span>Date: {item.uploadedDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: AUDIT TRAIL & OFFICIAL NOTES */}
      {activeTab === 'AUDIT' && (
        <div className="space-y-6">
          {/* Post official note */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Log Official Vigilance & Audit Remark
            </h2>
            <p className="text-xs text-slate-400">
              Remarks posted here become part of the immutable chronological audit ledger with cryptographic verification hash.
            </p>

            <form onSubmit={handlePostAuditComment} className="space-y-3">
              <textarea
                value={auditComment}
                onChange={(e) => setAuditComment(e.target.value)}
                placeholder="Enter field observation note, physical verification inquiry, or recommendation for technical audit..."
                rows={3}
                className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!auditComment.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Commit Official Note</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
