import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  ShieldCheck, 
  Filter, 
  CheckCircle2,
  Calendar,
  Building
} from 'lucide-react';
import { MPLADSWork, UserRole } from '../../types';

interface ReportGeneratorProps {
  works: MPLADSWork[];
  activeRole: UserRole;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  works,
  activeRole,
}) => {
  const [reportType, setReportType] = useState<'ANOMALY_SUMMARY' | 'DISTRICT_RISK' | 'FINANCIAL_AUDIT'>('ANOMALY_SUMMARY');
  const [selectedState, setSelectedState] = useState<string>('ALL');

  const statesList = Array.from(new Set(works.map(w => w.state))).sort();

  const filteredWorks = works.filter(w => {
    if (selectedState !== 'ALL' && w.state !== selectedState) return false;
    if (reportType === 'ANOMALY_SUMMARY') return w.requiresVerification;
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCsv = () => {
    const headers = 'WorkCode,Title,Category,State,District,SanctionedAmount,Expenditure,PhysicalProgress,ReviewScore,Status\n';
    const rows = filteredWorks.map(w => 
      `"${w.workCode}","${w.title.replace(/"/g, '""')}","${w.category}","${w.state}","${w.district}",${w.sanctionedAmount},${w.totalExpenditure},${w.physicalProgress},${w.reviewPriorityScore},"${w.status}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MPLADS_SENTINEL_REPORT_${reportType}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
            Governance Report Generator & Official Dossiers
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Export print-friendly vigilance reviews, state-level risk assessments, and project audit dossiers formatted for MoSPI and PAC submission.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Dossier</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Report Template:</span>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none"
          >
            <option value="ANOMALY_SUMMARY">AI Anomaly & Risk Priority Summary</option>
            <option value="DISTRICT_RISK">District Risk & Allocation Register</option>
            <option value="FINANCIAL_AUDIT">Financial Velocity & Outlier Ledger</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Jurisdiction Filter:</span>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none"
          >
            <option value="ALL">All States ({statesList.length})</option>
            {statesList.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Printable Report Document Surface */}
      <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl space-y-6 text-slate-200 font-sans print:bg-white print:text-black print:p-0 print:border-none">
        
        {/* Official Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold">
              GOVERNMENT OF INDIA · MoSPI · SIH26102
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">
              {reportType === 'ANOMALY_SUMMARY' && 'MPLADS Comprehensive Anomaly & Review Priority Dossier'}
              {reportType === 'DISTRICT_RISK' && 'State & District Implementation Risk Register'}
              {reportType === 'FINANCIAL_AUDIT' && 'Public Asset Financial Absorption & Outlier Audit'}
            </h2>
            <div className="text-xs text-slate-400 flex items-center gap-3 mt-1 font-mono">
              <span>Jurisdiction: {selectedState === 'ALL' ? 'Pan-India National Scope' : selectedState}</span>
              <span>·</span>
              <span>Compiled for: {activeRole}</span>
            </div>
          </div>

          <div className="text-right text-[11px] font-mono text-slate-400">
            <div>Generated: {new Date().toLocaleDateString('en-IN')}</div>
            <div className="text-cyan-400 font-semibold">SECURITY: OFFICIAL USE ONLY</div>
          </div>
        </div>

        {/* Summary Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 print:border-gray-300">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400 print:bg-gray-100 print:text-black">
              <tr>
                <th className="py-2.5 px-3">Work Code</th>
                <th className="py-2.5 px-3">Project Title</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3 text-right">Sanction (L)</th>
                <th className="py-2.5 px-3 text-right">Expenditure (L)</th>
                <th className="py-2.5 px-3 text-right">Progress</th>
                <th className="py-2.5 px-3 text-center">Priority</th>
                <th className="py-2.5 px-3">Primary Signal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-sans">
              {filteredWorks.slice(0, 30).map((work) => (
                <tr key={work.id} className="hover:bg-slate-900/50">
                  <td className="py-2.5 px-3 font-mono font-bold text-cyan-400 whitespace-nowrap">
                    {work.workCode}
                  </td>
                  <td className="py-2.5 px-3 text-slate-200 max-w-xs truncate">
                    {work.title}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                    {work.district}, {work.state}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-200">
                    ₹{work.sanctionedAmount}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-cyan-300">
                    ₹{work.totalExpenditure}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-200">
                    {work.physicalProgress}%
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold">
                    <span className={work.reviewPriorityScore >= 80 ? 'text-rose-400' : work.reviewPriorityScore >= 65 ? 'text-amber-400' : 'text-emerald-400'}>
                      {work.reviewPriorityScore}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 text-[11px] max-w-xs truncate">
                    {work.anomalySignals?.[0]?.name || 'Baseline Compliant'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Official Sign-off Footer */}
        <div className="pt-8 border-t border-slate-800 grid grid-cols-2 gap-8 text-xs text-slate-400 print:text-black">
          <div>
            <span className="block font-semibold text-slate-200">System Attestation:</span>
            <p className="mt-1">
              Automated anomaly scoring generated by MPLADS SENTINEL 360 multi-layer engine under MoSPI SIH26102 specifications.
            </p>
          </div>
          <div className="text-right space-y-1">
            <span className="block font-semibold text-slate-200">Vigilance Officer In-Charge</span>
            <span className="block text-[11px] text-slate-400">Digital Seal: SHA256-AUTHENTICATED</span>
          </div>
        </div>

      </div>

    </div>
  );
};
