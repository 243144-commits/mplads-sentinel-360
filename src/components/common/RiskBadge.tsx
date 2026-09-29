import React from 'react';
import { RiskLevel } from '../../types';

interface RiskBadgeProps {
  score: number;
  level?: RiskLevel;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  score,
  level,
  showLabel = true,
  size = 'md',
}) => {
  const resolvedLevel: RiskLevel =
    level || (score >= 80 ? 'CRITICAL' : score >= 65 ? 'HIGH' : score >= 45 ? 'MEDIUM' : 'LOW');

  let colorClasses = 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40';
  let dotColor = 'bg-emerald-400';
  let labelText = 'Low Review Priority';

  if (resolvedLevel === 'CRITICAL') {
    colorClasses = 'text-rose-400 bg-rose-950/40 border-rose-800/50';
    dotColor = 'bg-rose-500';
    labelText = 'Critical Review Priority';
  } else if (resolvedLevel === 'HIGH') {
    colorClasses = 'text-amber-400 bg-amber-950/40 border-amber-800/50';
    dotColor = 'bg-amber-400';
    labelText = 'High Review Priority';
  } else if (resolvedLevel === 'MEDIUM') {
    colorClasses = 'text-cyan-400 bg-cyan-950/40 border-cyan-800/40';
    dotColor = 'bg-cyan-400';
    labelText = 'Medium Review Priority';
  }

  const sizeClasses =
    size === 'sm'
      ? 'text-[11px] px-2 py-0.5'
      : size === 'lg'
      ? 'text-sm px-3.5 py-1.5'
      : 'text-xs px-2.5 py-1';

  return (
    <div
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${colorClasses} ${sizeClasses} tabular-nums`}
      title="Review Priority Score (0-100). Higher score indicates cases requiring official field and documentary verification."
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} ${resolvedLevel === 'CRITICAL' ? 'animate-pulse' : ''}`} />
      <span className="font-mono font-semibold">{score}</span>
      {showLabel && (
        <span className="text-[11px] font-normal opacity-90">
          / 100 {labelText}
        </span>
      )}
    </div>
  );
};
