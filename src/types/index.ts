export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type AnomalyType = 
  | 'COST_OUTLIER'
  | 'DUPLICATE_WORK'
  | 'EXPENDITURE_MISMATCH'
  | 'TIMELINE_DELAY'
  | 'AGENCY_CONCENTRATION'
  | 'PAYMENT_ANOMALY'
  | 'GEO_PROXIMITY'
  | 'COMPLIANCE_SIGNAL';

export type ProjectStatus = 
  | 'SANCTIONED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'STALLED'
  | 'UNDER_VERIFICATION';

export type ProjectCategory = 
  | 'Drinking Water'
  | 'Rural Roads & CC Roads'
  | 'Sanitation & Community Halls'
  | 'Education & Anganwadi'
  | 'Public Health & Dispensaries'
  | 'Irrigation & Check Dams'
  | 'Solar & Street Lighting'
  | 'Sports Infrastructure';

export type EvidenceStatus = 'VERIFIED' | 'PENDING' | 'MISSING' | 'INCONSISTENT';

export interface EvidenceItem {
  id: string;
  type: 'ESTIMATE_DOC' | 'SANCTION_ORDER' | 'MB_RECORD' | 'GEO_PHOTO' | 'COMPLETION_CERT' | 'PAYMENT_VOUCHER';
  title: string;
  documentRef: string;
  uploadedDate: string;
  uploadedBy: string;
  status: EvidenceStatus;
  notes?: string;
  thumbnailUrl?: string;
}

export interface PaymentMilestone {
  id: string;
  installmentNumber: number;
  amount: number; // in INR Lakhs
  disbursementDate: string;
  voucherNumber: string;
  physicalProgressClaimed: number; // percentage
  status: 'DISBURSED' | 'PENDING' | 'ON_HOLD';
  remarks?: string;
}

export interface RiskSignal {
  name: string;
  category: 'Financial' | 'Timeline' | 'Physical' | 'Similarity' | 'Agency' | 'Geographic' | 'Evidence' | 'Compliance';
  severity: RiskLevel;
  scoreContribution: number; // 0-100 scale impact
  description: string;
  evidence: string;
  baseline: string;
}

export interface MPLADSWork {
  id: string;
  workCode: string;
  title: string;
  category: ProjectCategory;
  state: string;
  district: string;
  block: string;
  constituency: string; // Lok Sabha / Rajya Sabha
  mpName: string;
  sanctionYear: string;
  
  // Financials in Lakhs (INR)
  estimatedCost: number;
  sanctionedAmount: number;
  totalExpenditure: number;
  
  // Timeline
  sanctionDate: string;
  commencementDate: string;
  targetCompletionDate: string;
  actualCompletionDate?: string;
  
  // Progress
  physicalProgress: number; // 0-100%
  financialProgress: number; // (totalExpenditure / sanctionedAmount) * 100
  status: ProjectStatus;
  
  // Implementing Agency
  implementingAgency: string;
  contractorName?: string;
  agencyContact?: string;
  
  // Geospatial
  latitude: number;
  longitude: number;
  locationName: string;
  
  // Risk & Anomaly Attributes
  reviewPriorityScore: number; // 0 - 100
  riskLevel: RiskLevel;
  requiresVerification: boolean;
  anomalyTypes: AnomalyType[];
  anomalySignals: RiskSignal[];
  
  // Delay prediction
  predictedDelayMonths: number;
  delayRiskFactor: 'NORMAL' | 'MODERATE' | 'SEVERE';
  
  // Evidences & Payments
  evidenceList: EvidenceItem[];
  payments: PaymentMilestone[];
  
  // NLP / Duplicate links
  similarWorkId?: string;
  similarityScore?: number; // 0 - 100
  similarityReason?: string;
}

export interface AuditLogEntry {
  id: string;
  workId: string;
  workCode: string;
  timestamp: string;
  userRole: UserRole;
  userName: string;
  action: 'ALERT_GENERATED' | 'ALERT_VIEWED' | 'ASSIGNED_OFFICER' | 'INSPECTION_SCHEDULED' | 'EVIDENCE_UPLOADED' | 'STATUS_UPDATED' | 'COMMENT_ADDED' | 'VERIFICATION_RESOLVED';
  details: string;
  verificationHash: string;
}

export type UserRole = 
  | 'MINISTRY_OFFICIAL' 
  | 'STATE_NODAL_OFFICER' 
  | 'DISTRICT_COLLECTOR' 
  | 'VIGILANCE_AUDITOR';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  designation: string;
  jurisdiction: string;
  badge: string;
}

export interface FilterState {
  searchQuery: string;
  state: string;
  district: string;
  category: string;
  status: string;
  riskLevel: string;
  anomalyType: string;
  agency: string;
}
