import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  UserCheck, 
  ChevronDown, 
  UploadCloud,
  FileSpreadsheet
} from 'lucide-react';
import { UserRole } from '../../types';

export type ActiveTab = 
  | 'dashboard' 
  | 'anomalies' 
  | 'works' 
  | 'duplicates' 
  | 'financial' 
  | 'geo' 
  | 'delay'
  | 'agencies' 
  | 'evidence' 
  | 'reports' 
  | 'audit' 
  | 'ingest';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  totalAnomaliesCount: number;
  onOpenQuickSearch: () => void;
}

const ROLES: { role: UserRole; label: string; badge: string }[] = [
  { role: 'MINISTRY_OFFICIAL', label: 'Ministry Official (MoSPI)', badge: 'National View' },
  { role: 'STATE_NODAL_OFFICER', label: 'State Nodal Officer', badge: 'State View' },
  { role: 'DISTRICT_COLLECTOR', label: 'District Magistrate', badge: 'District View' },
  { role: 'VIGILANCE_AUDITOR', label: 'Vigilance & Audit Officer', badge: 'Audit View' }
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeRole,
  setActiveRole,
  totalAnomaliesCount,
  onOpenQuickSearch,
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const navItems: { id: ActiveTab; label: string; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'anomalies', label: 'AI Anomalies', badge: totalAnomaliesCount },
    { id: 'works', label: 'Works' },
    { id: 'duplicates', label: 'Duplicates' },
    { id: 'financial', label: 'Financial' },
    { id: 'geo', label: 'Geo Intel' },
    { id: 'agencies', label: 'Agencies' },
    { id: 'evidence', label: 'Evidence' },
    { id: 'reports', label: 'Reports' },
    { id: 'audit', label: 'Audit Trail' }
  ];

  const currentRoleInfo = ROLES.find(r => r.role === activeRole) || ROLES[0];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#060913]/90 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Single text element wordmark with brand identity */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 text-left group"
            data-cursor-action="HOME"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#060913] rounded-[7px] flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                MPLADS SENTINEL 360
                <span className="text-[10px] font-mono font-medium text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
                  SIH26102
                </span>
              </span>
              <p className="text-[11px] text-slate-400 hidden lg:block -mt-0.5">
                From project data to explainable risk intelligence
              </p>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (single line, clean typography) */}
        <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                data-cursor-action={item.label}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/60'
                    : 'text-slate-300 hover:text-white hover:bg-slate-850/60'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions (Search, Ingestion, Role Switcher) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick Search Trigger */}
          <button
            onClick={onOpenQuickSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors text-xs"
            title="Search works, anomalies, districts, agencies"
            data-cursor-action="SEARCH"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden md:inline text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
              ⌘K
            </kbd>
          </button>

          {/* Ingest CSV Data Trigger */}
          <button
            onClick={() => setActiveTab('ingest')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              activeTab === 'ingest'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white hover:border-slate-700'
            }`}
            data-cursor-action="INGEST"
          >
            <UploadCloud className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Data Ingestion</span>
          </button>

          {/* Role-Based Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-slate-900 to-indigo-950/60 border border-indigo-900/40 text-slate-200 hover:border-indigo-500/50 transition-colors text-xs font-medium"
              data-cursor-action="ROLE"
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
              <div className="text-left hidden md:block">
                <span className="block text-[11px] leading-tight font-semibold text-slate-200">
                  {currentRoleInfo.label.split(' ')[0]}
                </span>
                <span className="block text-[9px] leading-none text-slate-400">
                  {currentRoleInfo.badge}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-slate-800 text-[11px] text-slate-400 font-medium">
                  Switch Active Governance Role:
                </div>
                {ROLES.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => {
                      setActiveRole(r.role);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                      activeRole === r.role
                        ? 'bg-indigo-600/20 text-cyan-300 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <span>{r.label}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {r.badge}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Mobile Nav for small screens */}
      <div className="xl:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 border-t border-slate-800/60 bg-[#070b16]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-2.5 py-1 rounded text-[11px] whitespace-nowrap transition-colors flex items-center gap-1 ${
              activeTab === item.id
                ? 'bg-slate-800 text-cyan-300 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="text-[9px] px-1 rounded-full bg-rose-500/20 text-rose-300">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </header>
  );
};
