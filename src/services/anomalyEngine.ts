import { MPLADSWork, AnomalyType, RiskSignal, RiskLevel } from '../types';

/**
 * Calculates Haversine distance in meters between two lat/lng pairs
 */
export function calculateGeoDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Token-based Jaccard and Levenshtein title similarity (0 - 100)
 */
export function calculateTitleSimilarity(title1: string, title2: string): number {
  const clean1 = title1.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  const clean2 = title2.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

  if (clean1 === clean2) return 100;

  const words1 = new Set(clean1.split(/\s+/));
  const words2 = new Set(clean2.split(/\s+/));

  let intersectionCount = 0;
  words1.forEach(w => {
    if (words2.has(w)) intersectionCount++;
  });

  const unionCount = new Set([...words1, ...words2]).size;
  if (unionCount === 0) return 0;

  const jaccard = (intersectionCount / unionCount) * 100;
  return Math.round(jaccard);
}

/**
 * Calculates Peer Group Cost Distribution per category
 */
export function calculatePeerGroupStats(works: MPLADSWork[], category: string) {
  const matching = works.filter(w => w.category === category);
  if (matching.length === 0) return { median: 25, mean: 25, stdDev: 5, q1: 15, q3: 35 };

  const costs = matching.map(w => w.sanctionedAmount).sort((a, b) => a - b);
  const n = costs.length;
  const median = n % 2 === 0 ? (costs[n / 2 - 1] + costs[n / 2]) / 2 : costs[Math.floor(n / 2)];
  const q1 = costs[Math.floor(n * 0.25)];
  const q3 = costs[Math.floor(n * 0.75)];
  
  const mean = costs.reduce((sum, c) => sum + c, 0) / n;
  const variance = costs.reduce((sum, c) => sum + Math.pow(c - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);

  return { median: Number(median.toFixed(1)), mean: Number(mean.toFixed(1)), stdDev: Number(stdDev.toFixed(1)), q1: Number(q1.toFixed(1)), q3: Number(q3.toFixed(1)) };
}

/**
 * Evaluates an ingested or existing work across the multi-layer anomaly engine
 */
export function evaluateWorkAnomalies(work: MPLADSWork, allWorks: MPLADSWork[]): {
  score: number;
  riskLevel: RiskLevel;
  requiresVerification: boolean;
  anomalyTypes: AnomalyType[];
  signals: RiskSignal[];
} {
  const signals: RiskSignal[] = [...(work.anomalySignals || [])];
  const anomalyTypes = new Set<AnomalyType>(work.anomalyTypes || []);
  let score = work.reviewPriorityScore || 15;

  // 1. Rule: Severe Financial Mismatch (Disbursement > Progress by > 30%)
  if (work.financialProgress - work.physicalProgress > 30 && work.sanctionedAmount > 15) {
    anomalyTypes.add('EXPENDITURE_MISMATCH');
    if (!signals.some(s => s.category === 'Financial' && s.name.includes('Divergence'))) {
      signals.push({
        name: 'Expenditure / Progress Divergence Anomaly',
        category: 'Financial',
        severity: 'CRITICAL',
        scoreContribution: 40,
        description: `Financial release (${work.financialProgress}%) outpaces physical progress (${work.physicalProgress}%) by ${Math.round(work.financialProgress - work.physicalProgress)} points.`,
        evidence: `Cumulative payment ₹${work.totalExpenditure}L released against verified physical status of ${work.physicalProgress}%.`,
        baseline: 'Permissible disbursement variance cap is ±15% of verified stage.'
      });
      score = Math.max(score, 88);
    }
  }

  // 2. Rule: Statistical Cost Outlier vs Peer Group
  const peerStats = calculatePeerGroupStats(allWorks, work.category);
  const costDeviation = ((work.sanctionedAmount - peerStats.median) / peerStats.median) * 100;
  if (costDeviation > 60 && work.sanctionedAmount > 30) {
    anomalyTypes.add('COST_OUTLIER');
    if (!signals.some(s => s.name.includes('Cost Outlier') || s.name.includes('Cost Variance'))) {
      signals.push({
        name: `Statistical Unit Cost Outlier (+${Math.round(costDeviation)}% vs Category Median)`,
        category: 'Financial',
        severity: costDeviation > 100 ? 'CRITICAL' : 'HIGH',
        scoreContribution: costDeviation > 100 ? 45 : 30,
        description: `Sanctioned amount (₹${work.sanctionedAmount}L) is ${Math.round(costDeviation)}% higher than district/category median (₹${peerStats.median}L).`,
        evidence: `Standard deviation index Z = +${((work.sanctionedAmount - peerStats.mean) / (peerStats.stdDev || 1)).toFixed(2)}.`,
        baseline: `Category benchmark median: ₹${peerStats.median} Lakhs (IQR ₹${peerStats.q1}L - ₹${peerStats.q3}L).`
      });
      score = Math.max(score, 78);
    }
  }

  // 3. Rule: Timeline Stagnation
  if (work.status === 'STALLED' || (work.predictedDelayMonths > 8 && work.physicalProgress < 50)) {
    anomalyTypes.add('TIMELINE_DELAY');
    if (!signals.some(s => s.category === 'Timeline')) {
      signals.push({
        name: 'Critical Timeline Slip (> 8 Months Overdue)',
        category: 'Timeline',
        severity: 'HIGH',
        scoreContribution: 32,
        description: `Target deadline exceeded with progress stalled at ${work.physicalProgress}%.`,
        evidence: `Projected delay: ${work.predictedDelayMonths} months past statutory completion date.`,
        baseline: 'Standard project timeline: 6 to 9 months.'
      });
      score = Math.max(score, 75);
    }
  }

  // 4. Rule: Evidence Missing / Inconsistent
  const hasInconsistentEvidence = work.evidenceList.some(e => e.status === 'INCONSISTENT');
  const hasMissingCert = work.status === 'COMPLETED' && work.evidenceList.some(e => e.type === 'COMPLETION_CERT' && e.status === 'MISSING');
  if (hasInconsistentEvidence || hasMissingCert) {
    anomalyTypes.add('COMPLIANCE_SIGNAL');
    if (!signals.some(s => s.category === 'Evidence')) {
      signals.push({
        name: hasInconsistentEvidence ? 'Evidence Document Inconsistency Detected' : 'Missing Mandatory Completion Certificate',
        category: 'Evidence',
        severity: 'HIGH',
        scoreContribution: 28,
        description: hasInconsistentEvidence ? 'Geotag or measurement records show metadata mismatch with sanction register.' : 'Asset logged as 100% closed without final technical completion sign-off.',
        evidence: 'System audit validation flags uploaded document status as INCONSISTENT.',
        baseline: 'Every completed asset requires dual sign-off from Junior Engineer and Gram Panchayat.'
      });
      score = Math.max(score, 72);
    }
  }

  score = Math.min(99, Math.max(10, score));
  let riskLevel: RiskLevel = 'LOW';
  if (score >= 80) riskLevel = 'CRITICAL';
  else if (score >= 65) riskLevel = 'HIGH';
  else if (score >= 45) riskLevel = 'MEDIUM';

  return {
    score,
    riskLevel,
    requiresVerification: score >= 50 || anomalyTypes.size > 0,
    anomalyTypes: Array.from(anomalyTypes),
    signals
  };
}
