import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Play, 
  Pause, 
  Radio, 
  Zap, 
  Bell, 
  CheckCircle2, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { MPLADSWork } from '../../types';

interface RealtimeTelemetryBarProps {
  onSimulateEvent: (eventText: string, workCode?: string) => void;
  onSelectWorkCode?: (workCode: string) => void;
}

const LIVE_EVENT_TEMPLATES = [
  { text: 'DPO Pune uploaded Geo-Tagged Drone Survey for MP-10482', workCode: 'MP-10482', type: 'INSPECTION' },
  { text: 'Varanasi PHED electronic voucher #302 verified via PFMS', workCode: 'MP-10219', type: 'FINANCIAL' },
  { text: 'Barabanki DRDA submitted revised BoQ measurement sheet', workCode: 'MP-10871', type: 'EVIDENCE' },
  { text: 'Belagavi Sub-division Junior Engineer logged 35% pipeline milestone', workCode: 'MP-10654', type: 'PROGRESS' },
  { text: 'Jodhpur District Quality Monitor cross-checked Solar Mast GPS coords', workCode: 'MP-10933', type: 'GEOSPATIAL' },
  { text: 'Rajkot Medical Officer uploaded equipment installation certificate', workCode: 'MP-10512', type: 'EVIDENCE' },
  { text: 'Madurai Corporation issued notice for contractor tender concentration', workCode: 'MP-11044', type: 'AGENCY' },
  { text: 'Automated satellite SAR radar scan registered ground leveling at Haveli block', workCode: 'MP-10483', type: 'SATELLITE' }
];

export const RealtimeTelemetryBar: React.FC<RealtimeTelemetryBarProps> = ({
  onSimulateEvent,
  onSelectWorkCode,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [eventHistory, setEventHistory] = useState<typeof LIVE_EVENT_TEMPLATES[0][]>(() => [
    LIVE_EVENT_TEMPLATES[0],
    LIVE_EVENT_TEMPLATES[1]
  ]);
  const [expanded, setExpanded] = useState(false);

  // Automatic real-time simulation interval (every 9s)
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentEventIndex((prev) => {
        const nextIdx = (prev + 1) % LIVE_EVENT_TEMPLATES.length;
        const nextEv = LIVE_EVENT_TEMPLATES[nextIdx];
        setEventHistory((h) => [nextEv, ...h.slice(0, 10)]);
        onSimulateEvent(nextEv.text, nextEv.workCode);
        return nextIdx;
      });
    }, 9000);

    return () => clearInterval(interval);
  }, [isPlaying, onSimulateEvent]);

  const activeEvent = LIVE_EVENT_TEMPLATES[currentEventIndex];

  const handleManualInject = () => {
    const nextIdx = (currentEventIndex + 1) % LIVE_EVENT_TEMPLATES.length;
    setCurrentEventIndex(nextIdx);
    const nextEv = LIVE_EVENT_TEMPLATES[nextIdx];
    setEventHistory((h) => [nextEv, ...h.slice(0, 10)]);
    onSimulateEvent(nextEv.text, nextEv.workCode);
  };

  return (
    <div className="w-full bg-[#050811] border-b border-indigo-950/60 px-4 py-2">
      <div className="max-w-[1560px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Left: Live Ticker Indicator */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 font-mono text-[10px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold">REAL-TIME STREAM</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              title={isPlaying ? 'Pause Live Stream' : 'Resume Live Stream'}
            >
              {isPlaying ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
            </button>
            <button
              type="button"
              onClick={handleManualInject}
              className="px-2 py-0.5 rounded bg-indigo-600/30 border border-indigo-500/40 text-cyan-300 hover:bg-indigo-600 hover:text-white transition-colors text-[10px] font-mono flex items-center gap-1"
              title="Inject instant simulated field update"
            >
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>Simulate Telemetry Ping</span>
            </button>
          </div>
        </div>

        {/* Center: Live Streaming Marquee Message */}
        <div className="flex-1 max-w-2xl overflow-hidden text-center md:text-left flex items-center justify-center md:justify-start gap-2">
          <span className="text-[10px] font-mono text-slate-500 uppercase shrink-0">LATEST PING:</span>
          <div 
            key={currentEventIndex} 
            className="text-xs text-slate-200 font-medium truncate animate-in fade-in slide-in-from-right-4 duration-300 flex items-center gap-2"
          >
            <span>{activeEvent.text}</span>
            {activeEvent.workCode && onSelectWorkCode && (
              <button
                type="button"
                onClick={() => onSelectWorkCode(activeEvent.workCode!)}
                className="font-mono text-[11px] text-cyan-400 underline hover:text-cyan-300 ml-1 shrink-0"
              >
                Inspect {activeEvent.workCode}
              </button>
            )}
          </div>
        </div>

        {/* Right: Live Connection Telemetry */}
        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400 shrink-0">
          <span className="flex items-center gap-1 text-slate-300">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>Telemetry: 42 Active Nodes</span>
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-emerald-400">Latency: 48ms</span>
        </div>

      </div>
    </div>
  );
};
