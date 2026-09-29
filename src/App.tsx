import React, { useState, useMemo } from 'react';
import { 
  MPLADSWork, 
  AuditLogEntry, 
  UserRole, 
  ProjectStatus 
} from './types';
import { generateSeedDataset, INITIAL_AUDIT_TRAIL } from './data/seedData';
import { Header, ActiveTab } from './components/common/Header';
import { CustomCursor } from './components/common/CustomCursor';
import { QuickSearchModal } from './components/common/QuickSearchModal';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { AnomalyCenter } from './components/anomalies/AnomalyCenter';
import { WorkIntelligence } from './components/works/WorkIntelligence';
import { WorkDetailView } from './components/works/WorkDetailView';
import { DuplicateDetector } from './components/duplicate/DuplicateDetector';
import { FinancialIntelligence } from './components/financial/FinancialIntelligence';
import { GeoIntelligence } from './components/geo/GeoIntelligence';
import { DelayPrediction } from './components/delay/DelayPrediction';
import { AgencyNetwork } from './components/agencies/AgencyNetwork';
import { EvidenceCenter } from './components/evidence/EvidenceCenter';
import { ReportGenerator } from './components/reports/ReportGenerator';
import { AuditTrailView } from './components/audit/AuditTrailView';
import { DataIngestion } from './components/ingestion/DataIngestion';
import { RealtimeTelemetryBar } from './components/common/RealtimeTelemetryBar';
import { ShieldAlert, ArrowRight, CheckCircle2, UserCheck, Sparkles } from 'lucide-react';

export default function App() {
  // Master state
  const [works, setWorks] = useState<MPLADSWork[]>(() => generateSeedDataset());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => INITIAL_AUDIT_TRAIL);
  
  // Navigation & Role
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [activeRole, setActiveRole] = useState<UserRole>('MINISTRY_OFFICIAL');
  const [selectedWork, setSelectedWork] = useState<MPLADSWork | null>(null);
  const [activeFilterParam, setActiveFilterParam] = useState<any>(null);
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);
  const [hasDismissedWelcome, setHasDismissedWelcome] = useState(false);

  // Number of active anomalies
  const totalAnomaliesCount = useMemo(() => {
    return works.filter((w) => w.requiresVerification).length;
  }, [works]);

  // Navigate to tab with optional query/filters
  const handleNavigateTab = (tab: ActiveTab, filter?: any) => {
    setSelectedWork(null);
    setActiveFilterParam(filter || null);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectWork = (work: MPLADSWork) => {
    setSelectedWork(work);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromWorkDetail = () => {
    setSelectedWork(null);
  };

  const handleAddAuditLog = (workId: string, workCode: string, action: any, details: string) => {
    const newEntry: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      workId,
      workCode,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      userRole: activeRole,
      userName: activeRole === 'MINISTRY_OFFICIAL' ? 'Director MoSPI Vigilance'
        : activeRole === 'STATE_NODAL_OFFICER' ? 'State Nodal Officer'
        : activeRole === 'DISTRICT_COLLECTOR' ? 'District Magistrate'
        : 'Chief Technical Auditor',
      action,
      details,
      verificationHash: `SHA256:${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}...`
    };

    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  const handleUpdateWorkStatus = (workId: string, newStatus: ProjectStatus) => {
    setWorks((prev) =>
      prev.map((w) => {
        if (w.id === workId) {
          const updated = { ...w, status: newStatus };
          if (newStatus === 'COMPLETED') {
            updated.requiresVerification = false;
            updated.reviewPriorityScore = Math.max(10, w.reviewPriorityScore - 35);
          }
          return updated;
        }
        return w;
      })
    );
    if (selectedWork && selectedWork.id === workId) {
      setSelectedWork((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleIngestNewWorks = (newWorks: MPLADSWork[]) => {
    setWorks((prev) => [...newWorks, ...prev]);
    handleAddAuditLog(
      newWorks[0]?.id || 'batch-ingest',
      newWorks[0]?.workCode || 'BATCH-INGEST',
      'ALERT_GENERATED',
      `Ingested ${newWorks.length} new project records via CSV upload. AI Anomaly Engine generated risk scores.`
    );
    setActiveTab('works');
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col font-sans selection:bg-indigo-600/30 selection:text-cyan-200">
      
      {/* Subtle Custom Interactive Cursor */}
      <CustomCursor />

      {/* Top Bar Header following 3-Zone Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        totalAnomaliesCount={totalAnomaliesCount}
        onOpenQuickSearch={() => setQuickSearchOpen(true)}
      />

      {/* Real-Time Live Telemetry Bar */}
      <RealtimeTelemetryBar
        onSimulateEvent={(eventText, workCode) => {
          if (workCode) {
            handleAddAuditLog(workCode, workCode, 'COMMENT_ADDED', `Live Telemetry: ${eventText}`);
          }
        }}
        onSelectWorkCode={(code) => {
          const match = works.find(w => w.workCode === code);
          if (match) handleSelectWork(match);
        }}
      />

      {/* Quick Search Modal */}
      <QuickSearchModal
        isOpen={quickSearchOpen}
        onClose={() => setQuickSearchOpen(false)}
        works={works}
        onSelectWork={handleSelectWork}
      />

      {/* Role Banner Context Notice */}
      <div className="bg-indigo-950/30 border-b border-indigo-900/30 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-[1560px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-cyan-300">Current Scope:</span>
            <span className="font-medium text-slate-200">
              {activeRole === 'MINISTRY_OFFICIAL' && 'Ministry of Statistics & Programme Implementation (MoSPI) · National Vigilance'}
              {activeRole === 'STATE_NODAL_OFFICER' && 'State Nodal Authority · Multi-District Oversight'}
              {activeRole === 'DISTRICT_COLLECTOR' && 'District Magistrate / Collectorate · Ground Execution & Verification'}
              {activeRole === 'VIGILANCE_AUDITOR' && 'Vigilance & Technical Audit Wing · Compliance & Evidence Verification'}
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            520 Monitored Works · SIH26102
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1560px] w-full mx-auto px-4 sm:px-6 py-6">
        
        {/* If a specific work is selected, render the WorkDetailView */}
        {selectedWork ? (
          <WorkDetailView
            work={selectedWork}
            onBack={handleBackFromWorkDetail}
            activeRole={activeRole}
            onAddAuditLog={handleAddAuditLog}
            onUpdateWorkStatus={handleUpdateWorkStatus}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <ExecutiveDashboard
                works={works}
                onSelectWork={handleSelectWork}
                onNavigateTab={handleNavigateTab}
                activeRole={activeRole}
              />
            )}

            {activeTab === 'anomalies' && (
              <AnomalyCenter
                works={works}
                onSelectWork={handleSelectWork}
                activeRole={activeRole}
                initialFilter={activeFilterParam}
              />
            )}

            {activeTab === 'works' && (
              <WorkIntelligence
                works={works}
                onSelectWork={handleSelectWork}
                initialFilter={activeFilterParam}
              />
            )}

            {activeTab === 'duplicates' && (
              <DuplicateDetector
                works={works}
                onSelectWork={handleSelectWork}
              />
            )}

            {activeTab === 'financial' && (
              <FinancialIntelligence
                works={works}
                onSelectWork={handleSelectWork}
              />
            )}

            {activeTab === 'geo' && (
              <GeoIntelligence
                works={works}
                onSelectWork={handleSelectWork}
              />
            )}

            {activeTab === 'delay' && (
              <DelayPrediction
                works={works}
                onSelectWork={handleSelectWork}
              />
            )}

            {activeTab === 'agencies' && (
              <AgencyNetwork
                works={works}
                onSelectWork={handleSelectWork}
              />
            )}

            {activeTab === 'evidence' && (
              <EvidenceCenter
                works={works}
                onSelectWork={handleSelectWork}
              />
            )}

            {activeTab === 'reports' && (
              <ReportGenerator
                works={works}
                activeRole={activeRole}
              />
            )}

            {activeTab === 'audit' && (
              <AuditTrailView
                logs={auditLogs}
                onSelectWorkCode={(code) => {
                  const target = works.find((w) => w.workCode === code);
                  if (target) handleSelectWork(target);
                }}
              />
            )}

            {activeTab === 'ingest' && (
              <DataIngestion
                onIngestNewWorks={handleIngestNewWorks}
                existingWorks={works}
              />
            )}
          </>
        )}

      </main>

      {/* Official Footer with SIH26102 and MoSPI compliance attribution */}
      <footer className="border-t border-slate-900 bg-[#04060c] text-slate-400 py-6 text-xs font-mono">
        <div className="max-w-[1560px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-slate-300 font-semibold">MPLADS SENTINEL 360</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">Smart India Hackathon 2026 (SIH26102 by MoSPI)</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Verify the signal</span>
            <span>·</span>
            <span>Understand the risk</span>
            <span>·</span>
            <span>Prioritize the review</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
