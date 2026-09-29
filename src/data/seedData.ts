import { MPLADSWork, ProjectCategory, RiskLevel, AnomalyType, ProjectStatus, EvidenceItem, PaymentMilestone, RiskSignal } from '../types';

export const CATEGORIES: ProjectCategory[] = [
  'Drinking Water',
  'Rural Roads & CC Roads',
  'Sanitation & Community Halls',
  'Education & Anganwadi',
  'Public Health & Dispensaries',
  'Irrigation & Check Dams',
  'Solar & Street Lighting',
  'Sports Infrastructure',
];

export const STATES_DISTRICTS: Record<string, string[]> = {
  'Maharashtra': ['Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur'],
  'Uttar Pradesh': ['Varanasi', 'Lucknow', 'Gorakhpur', 'Barabanki', 'Prayagraj', 'Kanpur'],
  'Karnataka': ['Bengaluru Rural', 'Mysuru', 'Dharwad', 'Belagavi', 'Shivamogga'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
  'Bihar': ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga'],
  'Tamil Nadu': ['Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Thanjavur'],
  'West Bengal': ['Kolkata Outer', 'Howrah', 'Hooghly', 'North 24 Parganas', 'Burdwan'],
};

export const IMPLEMENTING_AGENCIES = [
  'Public Works Department (PWD)',
  'Zilla Parishad Rural Engineering Cell',
  'District Rural Development Agency (DRDA)',
  'Minor Irrigation Division',
  'Public Health Engineering Dept (PHED)',
  'Maharashtra Jeevan Pradhikaran',
  'Municipal Corporation Infrastructure Cell',
  'Rural Water Supply & Sanitation Board',
];

export const MP_NAMES = [
  'Shri Rajeshwar Rao, MP (Lok Sabha)',
  'Smt. Meenakshi Sundaram, MP (Lok Sabha)',
  'Shri Anirudh Pratap Singh, MP (Lok Sabha)',
  'Dr. Sunita Deshmukh, MP (Rajya Sabha)',
  'Shri Arvind K. Patil, MP (Lok Sabha)',
  'Smt. Fatima Begum, MP (Rajya Sabha)',
  'Shri Hemant Soren, MP (Lok Sabha)',
  'Shri Devendra Bhattacharya, MP (Lok Sabha)',
];

// District baseline lat/long
const DISTRICT_COORDS: Record<string, { lat: number; lng: number }> = {
  'Pune': { lat: 18.5204, lng: 73.8567 },
  'Nagpur': { lat: 21.1458, lng: 79.0882 },
  'Nashik': { lat: 19.9975, lng: 73.7898 },
  'Aurangabad': { lat: 19.8762, lng: 75.3433 },
  'Solapur': { lat: 17.6599, lng: 75.9064 },
  'Kolhapur': { lat: 16.7050, lng: 74.2433 },
  'Varanasi': { lat: 25.3176, lng: 82.9739 },
  'Lucknow': { lat: 26.8467, lng: 80.9462 },
  'Gorakhpur': { lat: 26.7606, lng: 83.3732 },
  'Barabanki': { lat: 26.9272, lng: 81.1843 },
  'Prayagraj': { lat: 25.4358, lng: 81.8463 },
  'Kanpur': { lat: 26.4499, lng: 80.3319 },
  'Bengaluru Rural': { lat: 13.2324, lng: 77.5684 },
  'Mysuru': { lat: 12.2958, lng: 76.6394 },
  'Dharwad': { lat: 15.4589, lng: 75.0078 },
  'Belagavi': { lat: 15.8497, lng: 74.4977 },
  'Shivamogga': { lat: 13.9299, lng: 75.5681 },
  'Jaipur': { lat: 26.9124, lng: 75.7873 },
  'Jodhpur': { lat: 26.2389, lng: 73.0243 },
  'Udaipur': { lat: 24.5854, lng: 73.7125 },
  'Kota': { lat: 25.2138, lng: 75.8648 },
  'Ajmer': { lat: 26.4499, lng: 74.6399 },
  'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'Surat': { lat: 21.1702, lng: 72.8311 },
  'Vadodara': { lat: 22.3072, lng: 73.1812 },
  'Rajkot': { lat: 22.3039, lng: 70.8022 },
  'Bhavnagar': { lat: 21.7645, lng: 72.1519 },
  'Patna': { lat: 25.5941, lng: 85.1376 },
  'Gaya': { lat: 24.7955, lng: 85.0002 },
  'Muzaffarpur': { lat: 26.1209, lng: 85.3647 },
  'Bhagalpur': { lat: 25.2425, lng: 86.9842 },
  'Darbhanga': { lat: 26.1542, lng: 85.8918 },
  'Coimbatore': { lat: 11.0168, lng: 76.9558 },
  'Madurai': { lat: 9.9252, lng: 78.1198 },
  'Tiruchirappalli': { lat: 10.7905, lng: 78.7047 },
  'Salem': { lat: 11.6643, lng: 78.1460 },
  'Thanjavur': { lat: 10.7870, lng: 79.1378 },
  'Kolkata Outer': { lat: 22.5726, lng: 88.3639 },
  'Howrah': { lat: 22.5958, lng: 88.2636 },
  'Hooghly': { lat: 22.9038, lng: 88.3966 },
  'North 24 Parganas': { lat: 22.7214, lng: 88.4815 },
  'Burdwan': { lat: 23.2324, lng: 87.8615 },
};

// Seed 7 Planted Major Anomalies for immediate discovery
const PLANTED_ANOMALIES: Partial<MPLADSWork>[] = [
  {
    id: 'work-10482',
    workCode: 'MP-10482',
    title: 'Construction of Cement Concrete Road from Hanuman Mandir to ZP School, Shindewadi',
    category: 'Rural Roads & CC Roads',
    state: 'Maharashtra',
    district: 'Pune',
    block: 'Haveli',
    constituency: 'Pune Rural (LS-34)',
    mpName: 'Shri Rajeshwar Rao, MP (Lok Sabha)',
    sanctionYear: '2024-25',
    estimatedCost: 35.0,
    sanctionedAmount: 34.5,
    totalExpenditure: 32.8,
    sanctionDate: '2024-04-12',
    commencementDate: '2024-05-10',
    targetCompletionDate: '2024-11-30',
    physicalProgress: 88,
    financialProgress: 95.1,
    status: 'UNDER_VERIFICATION',
    implementingAgency: 'Zilla Parishad Rural Engineering Cell',
    contractorName: 'Shinde Brothers Infra Pvt Ltd',
    agencyContact: 'EE-Pune Division (020-2567812)',
    latitude: 18.5204 + 0.012,
    longitude: 73.8567 + 0.015,
    locationName: 'Shindewadi Gram Panchayat, Pune',
    reviewPriorityScore: 94,
    riskLevel: 'CRITICAL',
    requiresVerification: true,
    anomalyTypes: ['DUPLICATE_WORK', 'GEO_PROXIMITY'],
    similarWorkId: 'work-10483',
    similarityScore: 94,
    similarityReason: '94% lexical and geographic match with MP-10483. Distance between coordinates is 140 meters. Identical road stretch sanctioned under twin recommendations.',
    anomalySignals: [
      {
        name: 'High NLP Similarity with Existing Sanction',
        category: 'Similarity',
        severity: 'CRITICAL',
        scoreContribution: 42,
        description: '94% textual similarity with work MP-10483 sanctioned 38 days prior by the same nodal authority.',
        evidence: 'Token overlap on road stretch "Hanuman Mandir to ZP School" and identical start/end geo-markers.',
        baseline: 'Average similarity between independent works in same district is < 18%.'
      },
      {
        name: 'Geospatial Proximity Anomaly (< 150m)',
        category: 'Geographic',
        severity: 'CRITICAL',
        scoreContribution: 32,
        description: 'Coordinates placed within 140 meters of existing road asset registered under MP-10483.',
        evidence: 'GIS centroid distance = 0.14 km. Aerial satellite overlay indicates single physical road corridor.',
        baseline: 'Independent rural CC roads typically maintain > 1.2 km spatial separation.'
      },
      {
        name: 'Disproportionate Payment Velocity',
        category: 'Financial',
        severity: 'MEDIUM',
        scoreContribution: 20,
        description: 'Final tranche disbursed before mandatory joint inspection note uploaded.',
        evidence: 'Voucher V-2024/891 released 14 days after tender award.',
        baseline: 'Standard milestone payment schedule requires minimum 60-day audit cycle.'
      }
    ],
    predictedDelayMonths: 1,
    delayRiskFactor: 'NORMAL',
    evidenceList: [
      { id: 'ev-1', type: 'SANCTION_ORDER', title: 'District Sanction Order #412/2024', documentRef: 'DSO-PUN-2024-412.pdf', uploadedDate: '2024-04-14', uploadedBy: 'DPO Pune', status: 'VERIFIED' },
      { id: 'ev-2', type: 'MB_RECORD', title: 'Measurement Book #MB-109', documentRef: 'MB-109-Pages-12-18.pdf', uploadedDate: '2024-09-10', uploadedBy: 'Junior Engineer PWD', status: 'INCONSISTENT', notes: 'Cross-sections match exact measurements of MP-10483.' },
      { id: 'ev-3', type: 'GEO_PHOTO', title: 'Site Photo Stage-2 with GPS Tag', documentRef: 'IMG_20240905_1142.jpg', uploadedDate: '2024-09-06', uploadedBy: 'Agency Supervisor', status: 'PENDING' },
    ],
    payments: [
      { id: 'pm-1', installmentNumber: 1, amount: 10.35, disbursementDate: '2024-05-15', voucherNumber: 'V-2024/104', physicalProgressClaimed: 30, status: 'DISBURSED' },
      { id: 'pm-2', installmentNumber: 2, amount: 13.80, disbursementDate: '2024-08-02', voucherNumber: 'V-2024/491', physicalProgressClaimed: 65, status: 'DISBURSED' },
      { id: 'pm-3', installmentNumber: 3, amount: 8.65, disbursementDate: '2024-10-18', voucherNumber: 'V-2024/891', physicalProgressClaimed: 88, status: 'DISBURSED' },
    ]
  },
  {
    id: 'work-10483',
    workCode: 'MP-10483',
    title: 'Construction of CC Road connecting Main Mandir Chowk to Village Primary School, Shindewadi',
    category: 'Rural Roads & CC Roads',
    state: 'Maharashtra',
    district: 'Pune',
    block: 'Haveli',
    constituency: 'Pune Rural (LS-34)',
    mpName: 'Shri Rajeshwar Rao, MP (Lok Sabha)',
    sanctionYear: '2024-25',
    estimatedCost: 36.2,
    sanctionedAmount: 35.0,
    totalExpenditure: 31.5,
    sanctionDate: '2024-03-05',
    commencementDate: '2024-04-01',
    targetCompletionDate: '2024-10-15',
    physicalProgress: 92,
    financialProgress: 90.0,
    status: 'UNDER_VERIFICATION',
    implementingAgency: 'Public Works Department (PWD)',
    contractorName: 'Shinde Brothers Infra Pvt Ltd',
    agencyContact: 'EE-PWD Haveli Division',
    latitude: 18.5204 + 0.013,
    longitude: 73.8567 + 0.016,
    locationName: 'Shindewadi Village Centre, Pune',
    reviewPriorityScore: 91,
    riskLevel: 'CRITICAL',
    requiresVerification: true,
    anomalyTypes: ['DUPLICATE_WORK', 'GEO_PROXIMITY'],
    similarWorkId: 'work-10482',
    similarityScore: 94,
    similarityReason: 'Paired duplicate candidate. Dual funding allocation identified for virtually identical road segment.',
    anomalySignals: [
      {
        name: 'High Similarity Score (94%)',
        category: 'Similarity',
        severity: 'CRITICAL',
        scoreContribution: 45,
        description: 'Exact destination match (Village School) and overlapping geometry with MP-10482.',
        evidence: 'Tender specification documents share 89% identical clause text.',
        baseline: 'Normal category variation index is > 65%.'
      },
      {
        name: 'Same Contractor & Common Vendor Nexus',
        category: 'Agency',
        severity: 'HIGH',
        scoreContribution: 30,
        description: 'Both projects executed by Shinde Brothers Infra Pvt Ltd under two separate divisions.',
        evidence: 'GSTIN 27AABCS1429E1Z8 mapped to both work orders.',
        baseline: 'Independent bidding across distinct departmental jurisdictions.'
      }
    ],
    predictedDelayMonths: 0,
    delayRiskFactor: 'NORMAL',
    evidenceList: [
      { id: 'ev-4', type: 'SANCTION_ORDER', title: 'District Sanction Order #298/2024', documentRef: 'DSO-PUN-2024-298.pdf', uploadedDate: '2024-03-08', uploadedBy: 'DPO Pune', status: 'VERIFIED' },
      { id: 'ev-5', type: 'COMPLETION_CERT', title: 'Stage Completion Certificate', documentRef: 'SCC-Haveli-04.pdf', uploadedDate: '2024-10-20', uploadedBy: 'EE PWD Haveli', status: 'INCONSISTENT' }
    ],
    payments: [
      { id: 'pm-4', installmentNumber: 1, amount: 15.0, disbursementDate: '2024-04-10', voucherNumber: 'V-2024/044', physicalProgressClaimed: 40, status: 'DISBURSED' },
      { id: 'pm-5', installmentNumber: 2, amount: 16.5, disbursementDate: '2024-07-22', voucherNumber: 'V-2024/318', physicalProgressClaimed: 85, status: 'DISBURSED' }
    ]
  },
  {
    id: 'work-10219',
    workCode: 'MP-10219',
    title: 'Installation of Community RO Drinking Water Plant and Distribution Kiosk, Khaga',
    category: 'Drinking Water',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    block: 'Kashi Vidyapeeth',
    constituency: 'Varanasi (LS-57)',
    mpName: 'Shri Anirudh Pratap Singh, MP (Lok Sabha)',
    sanctionYear: '2023-24',
    estimatedCost: 38.5,
    sanctionedAmount: 38.5,
    totalExpenditure: 36.2,
    sanctionDate: '2023-08-15',
    commencementDate: '2023-09-20',
    targetCompletionDate: '2024-03-31',
    physicalProgress: 22,
    financialProgress: 94.0,
    status: 'UNDER_VERIFICATION',
    implementingAgency: 'Public Health Engineering Dept (PHED)',
    contractorName: 'Ganga Jal Tech Solutions',
    agencyContact: 'AE-PHED Varanasi North',
    latitude: 25.3176 + 0.024,
    longitude: 82.9739 - 0.018,
    locationName: 'Khaga Gram Panchayat, Varanasi',
    reviewPriorityScore: 96,
    riskLevel: 'CRITICAL',
    requiresVerification: true,
    anomalyTypes: ['EXPENDITURE_MISMATCH', 'TIMELINE_DELAY', 'PAYMENT_ANOMALY'],
    anomalySignals: [
      {
        name: 'Severe Expenditure vs Physical Progress Divergence',
        category: 'Financial',
        severity: 'CRITICAL',
        scoreContribution: 48,
        description: '94% of sanctioned fund (₹36.2L) withdrawn while site physical inspection records only 22% completion.',
        evidence: 'Cumulative disbursement ₹36.2 Lakhs; ground status: boundary wall constructed, no RO machinery or piping installed.',
        baseline: 'At 22% physical completion, permissible cumulative disbursement cap is 25-30%.'
      },
      {
        name: 'Extended Timeline Slip (> 10 Months)',
        category: 'Timeline',
        severity: 'HIGH',
        scoreContribution: 28,
        description: 'Target completion was March 2024. Project has stalled for over 310 days without time extension approval.',
        evidence: 'Last site log dated 14 Feb 2024 with zero progress notes thereafter.',
        baseline: 'Standard execution window for RO kiosk is 6 months.'
      },
      {
        name: 'Missing Equipment Delivery Vouchers',
        category: 'Evidence',
        severity: 'HIGH',
        scoreContribution: 20,
        description: 'No manufacturer invoice or technical commissioning certificate uploaded for ₹24L equipment component.',
        evidence: 'Mandatory technical verification sign-off from Executive Engineer PHED is missing.',
        baseline: 'All machinery procurements above ₹10L mandate third-party quality testing cert.'
      }
    ],
    predictedDelayMonths: 14,
    delayRiskFactor: 'SEVERE',
    evidenceList: [
      { id: 'ev-6', type: 'SANCTION_ORDER', title: 'Administrative Sanction Letter', documentRef: 'AS-VNS-2023-991.pdf', uploadedDate: '2023-08-20', uploadedBy: 'Collectorate Varanasi', status: 'VERIFIED' },
      { id: 'ev-7', type: 'GEO_PHOTO', title: 'Site Ground Reality Photo (Stalled Foundation)', documentRef: 'VNS_RO_Ground_Stalled.jpg', uploadedDate: '2024-08-12', uploadedBy: 'District Vigilance Inspector', status: 'INCONSISTENT', notes: 'Shows bare concrete slab with rusted reinforcement bars; no plant installed.' },
      { id: 'ev-8', type: 'MB_RECORD', title: 'Stage 1 MB Record', documentRef: 'MB-VNS-2023-14.pdf', uploadedDate: '2023-11-05', uploadedBy: 'Junior Engineer PHED', status: 'VERIFIED' }
    ],
    payments: [
      { id: 'pm-6', installmentNumber: 1, amount: 15.0, disbursementDate: '2023-10-01', voucherNumber: 'VNS/PHED/081', physicalProgressClaimed: 15, status: 'DISBURSED' },
      { id: 'pm-7', installmentNumber: 2, amount: 12.0, disbursementDate: '2023-12-14', voucherNumber: 'VNS/PHED/194', physicalProgressClaimed: 22, status: 'DISBURSED' },
      { id: 'pm-8', installmentNumber: 3, amount: 9.2, disbursementDate: '2024-02-28', voucherNumber: 'VNS/PHED/302', physicalProgressClaimed: 22, status: 'DISBURSED', remarks: 'Advanced without field verification certificate.' }
    ]
  },
  {
    id: 'work-10871',
    workCode: 'MP-10871',
    title: 'Construction of Multi-Purpose Rural Community Hall (1,200 sq.ft) at Haidergarh',
    category: 'Sanitation & Community Halls',
    state: 'Uttar Pradesh',
    district: 'Barabanki',
    block: 'Haidergarh',
    constituency: 'Barabanki (LS-53)',
    mpName: 'Shri Anirudh Pratap Singh, MP (Lok Sabha)',
    sanctionYear: '2024-25',
    estimatedCost: 98.0,
    sanctionedAmount: 98.0,
    totalExpenditure: 74.5,
    sanctionDate: '2024-02-18',
    commencementDate: '2024-03-25',
    targetCompletionDate: '2024-12-31',
    physicalProgress: 60,
    financialProgress: 76.0,
    status: 'UNDER_VERIFICATION',
    implementingAgency: 'District Rural Development Agency (DRDA)',
    contractorName: 'Awadh Constructions Consortium',
    agencyContact: 'Project Director DRDA Barabanki',
    latitude: 26.9272 + 0.035,
    longitude: 81.1843 - 0.022,
    locationName: 'Haidergarh Block Headquarters, Barabanki',
    reviewPriorityScore: 89,
    riskLevel: 'HIGH',
    requiresVerification: true,
    anomalyTypes: ['COST_OUTLIER', 'COMPLIANCE_SIGNAL'],
    anomalySignals: [
      {
        name: 'Severe Statistical Cost Outlier (+201% of Peer Group)',
        category: 'Financial',
        severity: 'CRITICAL',
        scoreContribution: 52,
        description: 'Sanctioned rate of ₹8,166 per sq.ft is 3.1x higher than standard PWD Schedule of Rates (SOR) for rural community centers in Uttar Pradesh.',
        evidence: 'Sanctioned ₹98.0 Lakhs for 1,200 sq.ft hall. State standard norm: ₹30-35 Lakhs.',
        baseline: 'District median cost for 1,200 sq.ft community halls is ₹32.5 Lakhs (IQR: ₹28.0L - ₹36.4L).'
      },
      {
        name: 'Item Rate Markup in Non-Standard BoQ',
        category: 'Compliance',
        severity: 'HIGH',
        scoreContribution: 24,
        description: 'Bill of Quantities includes non-standard luxury finishes and decorative facade items not permissible under MPLADS operational guidelines.',
        evidence: 'Acoustic panelling, Italian marble flooring items budgeted in rural facility.',
        baseline: 'MPLADS guidelines section 3.2 restrict community halls to functional durable public assets.'
      },
      {
        name: 'Isolation Forest Anomaly Score: 0.91',
        category: 'Financial',
        severity: 'MEDIUM',
        scoreContribution: 13,
        description: 'High multidimensional outlier distance in feature space (cost per sq ft, steel tonnage ratio, cement ratio).',
        evidence: 'Z-score = +3.84 against state-wide building project baseline.',
        baseline: 'Normative Z-score distribution bounds: -1.96 to +1.96.'
      }
    ],
    predictedDelayMonths: 4,
    delayRiskFactor: 'MODERATE',
    evidenceList: [
      { id: 'ev-9', type: 'ESTIMATE_DOC', title: 'Detailed Project Estimate & BoQ', documentRef: 'DPR-BBK-2024-871.pdf', uploadedDate: '2024-02-22', uploadedBy: 'DRDA Barabanki', status: 'INCONSISTENT', notes: 'Contains items exceeding standard district schedule of rates.' },
      { id: 'ev-10', type: 'SANCTION_ORDER', title: 'Sanction Order by DM Barabanki', documentRef: 'SO-BBK-2024-44.pdf', uploadedDate: '2024-02-25', uploadedBy: 'DPO Barabanki', status: 'VERIFIED' },
      { id: 'ev-11', type: 'MB_RECORD', title: 'Measurement Book #MB-88', documentRef: 'MB-88-Record.pdf', uploadedDate: '2024-07-15', uploadedBy: 'Assistant Engineer DRDA', status: 'PENDING' }
    ],
    payments: [
      { id: 'pm-9', installmentNumber: 1, amount: 29.4, disbursementDate: '2024-03-30', voucherNumber: 'BBK/DRDA/021', physicalProgressClaimed: 25, status: 'DISBURSED' },
      { id: 'pm-10', installmentNumber: 2, amount: 45.1, disbursementDate: '2024-07-20', voucherNumber: 'BBK/DRDA/155', physicalProgressClaimed: 60, status: 'DISBURSED' }
    ]
  },
  {
    id: 'work-10654',
    workCode: 'MP-10654',
    title: 'Perennial Lift Irrigation & Pipeline Distribution Scheme for Farmers Cluster, Indi',
    category: 'Irrigation & Check Dams',
    state: 'Karnataka',
    district: 'Belagavi',
    block: 'Athani',
    constituency: 'Belagavi (LS-02)',
    mpName: 'Shri Arvind K. Patil, MP (Lok Sabha)',
    sanctionYear: '2023-24',
    estimatedCost: 75.0,
    sanctionedAmount: 75.0,
    totalExpenditure: 58.2,
    sanctionDate: '2023-05-10',
    commencementDate: '2023-06-15',
    targetCompletionDate: '2024-02-28',
    physicalProgress: 35,
    financialProgress: 77.6,
    status: 'STALLED',
    implementingAgency: 'Minor Irrigation Division',
    contractorName: 'Krishna Valley Pump & Tube Ltd',
    agencyContact: 'EE Minor Irrigation Belagavi',
    latitude: 15.8497 + 0.045,
    longitude: 74.4977 + 0.038,
    locationName: 'Athani Rural Basin, Belagavi',
    reviewPriorityScore: 92,
    riskLevel: 'CRITICAL',
    requiresVerification: true,
    anomalyTypes: ['TIMELINE_DELAY', 'EXPENDITURE_MISMATCH', 'COMPLIANCE_SIGNAL'],
    anomalySignals: [
      {
        name: 'Critical Timeline Stagnation (> 18 Months Stalled)',
        category: 'Timeline',
        severity: 'CRITICAL',
        scoreContribution: 45,
        description: 'Project is 578 days past sanction date. Physical progress has remained at 35% for over 11 months.',
        evidence: 'No physical activity reported since November 2023 despite 77.6% fund release.',
        baseline: 'Average completion time for lift irrigation works in Belagavi is 9 months.'
      },
      {
        name: 'Unsubstantiated Material Advance',
        category: 'Financial',
        severity: 'HIGH',
        scoreContribution: 30,
        description: 'Tranche released for PVC pipes and pump sets without storage verification or on-site delivery proof.',
        evidence: 'Voucher BLG-MI-401 for ₹28.5L issued under material advance category without bank guarantee.',
        baseline: 'MPLADS guidelines forbid unsecured advances to contractors.'
      },
      {
        name: 'Missing Right-of-Way NoC',
        category: 'Evidence',
        severity: 'MEDIUM',
        scoreContribution: 17,
        description: 'Pipeline alignment disputed by local landholders; statutory forest & revenue clearings absent.',
        evidence: 'Formal representation filed by Gram Sabha regarding route encroachment.',
        baseline: 'Prior land clearance mandatory before administrative sanction.'
      }
    ],
    predictedDelayMonths: 20,
    delayRiskFactor: 'SEVERE',
    evidenceList: [
      { id: 'ev-12', type: 'SANCTION_ORDER', title: 'Sanction Order Belagavi Nodal Agency', documentRef: 'SO-BLG-2023-71.pdf', uploadedDate: '2023-05-12', uploadedBy: 'DC Belagavi', status: 'VERIFIED' },
      { id: 'ev-13', type: 'MB_RECORD', title: 'Stage 1 MB Record for Pump House Foundation', documentRef: 'MB-BLG-44.pdf', uploadedDate: '2023-09-02', uploadedBy: 'AEE Irrigation', status: 'VERIFIED' },
      { id: 'ev-14', type: 'COMPLETION_CERT', title: 'Pipeline Laying Stage Certificate', documentRef: 'Not_Available.pdf', uploadedDate: '2024-01-01', uploadedBy: 'System', status: 'MISSING' }
    ],
    payments: [
      { id: 'pm-11', installmentNumber: 1, amount: 22.5, disbursementDate: '2023-06-25', voucherNumber: 'BLG/MI/014', physicalProgressClaimed: 20, status: 'DISBURSED' },
      { id: 'pm-12', installmentNumber: 2, amount: 35.7, disbursementDate: '2023-11-18', voucherNumber: 'BLG/MI/401', physicalProgressClaimed: 35, status: 'DISBURSED' }
    ]
  },
  {
    id: 'work-10933',
    workCode: 'MP-10933',
    title: 'Installation of High Mast Solar Street Lights (24 Units) at Major Intersections, Barmer Highway',
    category: 'Solar & Street Lighting',
    state: 'Rajasthan',
    district: 'Jodhpur',
    block: 'Luni',
    constituency: 'Jodhpur (LS-13)',
    mpName: 'Smt. Fatima Begum, MP (Rajya Sabha)',
    sanctionYear: '2024-25',
    estimatedCost: 48.0,
    sanctionedAmount: 48.0,
    totalExpenditure: 48.0,
    sanctionDate: '2024-01-10',
    commencementDate: '2024-02-01',
    targetCompletionDate: '2024-06-30',
    actualCompletionDate: '2024-07-15',
    physicalProgress: 100,
    financialProgress: 100.0,
    status: 'COMPLETED',
    implementingAgency: 'District Rural Development Agency (DRDA)',
    contractorName: 'Surya Kiran Renewables LLP',
    agencyContact: 'Executive Engineer DRDA Jodhpur',
    latitude: 26.2389 - 0.028,
    longitude: 73.0243 + 0.042,
    locationName: 'Luni Junction & Surrounding Gram Panchayats',
    reviewPriorityScore: 87,
    riskLevel: 'HIGH',
    requiresVerification: true,
    anomalyTypes: ['GEO_PROXIMITY', 'COMPLIANCE_SIGNAL', 'COMPLIANCE_SIGNAL'],
    anomalySignals: [
      {
        name: 'Conflicting GPS EXIF Metadata on Completion Photos',
        category: 'Geographic',
        severity: 'CRITICAL',
        scoreContribution: 42,
        description: 'Uploaded completion photo geotags map to coordinates 44 km away in an adjacent uninhabited wildlife sanctuary.',
        evidence: 'EXIF Lat: 25.892, Lon: 72.781 vs Sanctioned Site Lat: 26.210, Lon: 73.066.',
        baseline: 'Permissible geotag GPS drift threshold is < 300 meters from sanctioned centroid.'
      },
      {
        name: '100% Closure Without Joint Inspection Sign-off',
        category: 'Evidence',
        severity: 'HIGH',
        scoreContribution: 30,
        description: 'Completion Certificate signed unilaterally by contractor representative without Gram Pradhan counter-signature.',
        evidence: 'CC-JDH-2024-09 lacks mandatory seal of Block Development Officer (BDO).',
        baseline: 'Joint verification protocol requires signatures from AE, BDO, and Gram Panchayat.'
      },
      {
        name: 'Rapid Final Payment Release',
        category: 'Financial',
        severity: 'MEDIUM',
        scoreContribution: 15,
        description: '100% funds released 3 days after submission of doubtful completion documents.',
        evidence: 'Full voucher payment V-2024-912 cleared on 18 July 2024.',
        baseline: 'Mandatory 10% retention money must be held for 12 months warranty period.'
      }
    ],
    predictedDelayMonths: 0,
    delayRiskFactor: 'NORMAL',
    evidenceList: [
      { id: 'ev-15', type: 'SANCTION_ORDER', title: 'Sanction Order Jodhpur Collectorate', documentRef: 'SO-JDH-2024-11.pdf', uploadedDate: '2024-01-12', uploadedBy: 'DPO Jodhpur', status: 'VERIFIED' },
      { id: 'ev-16', type: 'GEO_PHOTO', title: 'High Mast Light Geo-Tagged Installation Photo', documentRef: 'JODH_SOLAR_EXIF_ERR.jpg', uploadedDate: '2024-07-16', uploadedBy: 'Surya Kiran Agency', status: 'INCONSISTENT', notes: 'GPS metadata indicates photo taken 44km away in Desert National Park buffer zone.' },
      { id: 'ev-17', type: 'COMPLETION_CERT', title: 'Formal Asset Handover Letter', documentRef: 'CC-JDH-2024-09.pdf', uploadedDate: '2024-07-17', uploadedBy: 'Surya Kiran Agency', status: 'INCONSISTENT' }
    ],
    payments: [
      { id: 'pm-13', installmentNumber: 1, amount: 24.0, disbursementDate: '2024-02-15', voucherNumber: 'JDH/SOL/001', physicalProgressClaimed: 50, status: 'DISBURSED' },
      { id: 'pm-14', installmentNumber: 2, amount: 24.0, disbursementDate: '2024-07-18', voucherNumber: 'JDH/SOL/912', physicalProgressClaimed: 100, status: 'DISBURSED' }
    ]
  },
  {
    id: 'work-11044',
    workCode: 'MP-11044',
    title: 'Construction of Boundary Wall & Playground Leveling at Govt High School, Madurai North',
    category: 'Sports Infrastructure',
    state: 'Tamil Nadu',
    district: 'Madurai',
    block: 'Madurai North',
    constituency: 'Madurai (LS-32)',
    mpName: 'Smt. Meenakshi Sundaram, MP (Lok Sabha)',
    sanctionYear: '2024-25',
    estimatedCost: 26.5,
    sanctionedAmount: 26.5,
    totalExpenditure: 21.0,
    sanctionDate: '2024-05-02',
    commencementDate: '2024-05-28',
    targetCompletionDate: '2024-10-31',
    physicalProgress: 75,
    financialProgress: 79.2,
    status: 'IN_PROGRESS',
    implementingAgency: 'Municipal Corporation Infrastructure Cell',
    contractorName: 'Apex Infra Ventures Pvt Ltd',
    agencyContact: 'City Engineer Madurai Corp',
    latitude: 9.9252 + 0.021,
    longitude: 78.1198 - 0.015,
    locationName: 'Govt Higher Secondary School Campus, Madurai',
    reviewPriorityScore: 84,
    riskLevel: 'HIGH',
    requiresVerification: true,
    anomalyTypes: ['AGENCY_CONCENTRATION', 'COMPLIANCE_SIGNAL'],
    anomalySignals: [
      {
        name: 'Severe Implementing Agency / Vendor Concentration',
        category: 'Agency',
        severity: 'CRITICAL',
        scoreContribution: 46,
        description: 'Single contractor "Apex Infra Ventures Pvt Ltd" awarded 14 high-value works (total ₹4.2 Crore) in Madurai district within 60 days.',
        evidence: 'Concentration ratio: 41% of all sports & school infrastructure tenders in 2024 awarded to same entity.',
        baseline: 'Fair competition threshold limits single vendor concentration to < 15% of annual works.'
      },
      {
        name: 'Single Bidder Tender Process',
        category: 'Compliance',
        severity: 'HIGH',
        scoreContribution: 26,
        description: 'Tender floated with 7-day shortened notice period; single qualifying technical bid accepted without re-tender.',
        evidence: 'Tender evaluation minute sheet #MDU-2024-33 indicates solitary bidder.',
        baseline: 'Central Vigilance Commission (CVC) guidelines mandate minimum 3 valid bids or mandatory re-call.'
      },
      {
        name: 'Sub-Contracting Pattern Anomaly',
        category: 'Agency',
        severity: 'MEDIUM',
        scoreContribution: 12,
        description: 'Field inspection confirms execution sub-contracted to unregistered local party without prior approval.',
        evidence: 'Site signboard lists secondary firm not named in official sanction.',
        baseline: 'Sub-letting of MPLADS works strictly prohibited under Rule 4.3.'
      }
    ],
    predictedDelayMonths: 2,
    delayRiskFactor: 'MODERATE',
    evidenceList: [
      { id: 'ev-18', type: 'SANCTION_ORDER', title: 'Administrative Sanction Madurai', documentRef: 'AS-MDU-2024-118.pdf', uploadedDate: '2024-05-05', uploadedBy: 'Collector Madurai', status: 'VERIFIED' },
      { id: 'ev-19', type: 'MB_RECORD', title: 'MB Extract for Boundary Foundation', documentRef: 'MB-MDU-77.pdf', uploadedDate: '2024-07-28', uploadedBy: 'Assistant Engineer Corp', status: 'VERIFIED' },
      { id: 'ev-20', type: 'GEO_PHOTO', title: 'Site Photo showing sub-contractor banner', documentRef: 'MDU_SITE_FLAGGED.jpg', uploadedDate: '2024-08-15', uploadedBy: 'District Quality Monitor', status: 'PENDING' }
    ],
    payments: [
      { id: 'pm-15', installmentNumber: 1, amount: 10.6, disbursementDate: '2024-06-10', voucherNumber: 'MDU/CORP/101', physicalProgressClaimed: 35, status: 'DISBURSED' },
      { id: 'pm-16', installmentNumber: 2, amount: 10.4, disbursementDate: '2024-08-30', voucherNumber: 'MDU/CORP/344', physicalProgressClaimed: 75, status: 'DISBURSED' }
    ]
  },
  {
    id: 'work-10512',
    workCode: 'MP-10512',
    title: 'Upgradation and Medical Equipment Supply for Primary Health Centre (PHC), Rajkot Rural',
    category: 'Public Health & Dispensaries',
    state: 'Gujarat',
    district: 'Rajkot',
    block: 'Lodhika',
    constituency: 'Rajkot (LS-10)',
    mpName: 'Shri Devendra Bhattacharya, MP (Lok Sabha)',
    sanctionYear: '2024-25',
    estimatedCost: 50.0,
    sanctionedAmount: 50.0,
    totalExpenditure: 50.0,
    sanctionDate: '2024-06-01',
    commencementDate: '2024-06-10',
    targetCompletionDate: '2024-11-30',
    physicalProgress: 40,
    financialProgress: 100.0,
    status: 'UNDER_VERIFICATION',
    implementingAgency: 'Public Health Engineering Dept (PHED)',
    contractorName: 'MediLife Devices & Systems Ltd',
    agencyContact: 'Chief District Health Officer Rajkot',
    latitude: 22.3039 + 0.015,
    longitude: 70.8022 - 0.025,
    locationName: 'Lodhika PHC Compound, Rajkot',
    reviewPriorityScore: 93,
    riskLevel: 'CRITICAL',
    requiresVerification: true,
    anomalyTypes: ['PAYMENT_ANOMALY', 'EXPENDITURE_MISMATCH'],
    anomalySignals: [
      {
        name: 'Rapid Payment Velocity (100% Release in 12 Days)',
        category: 'Financial',
        severity: 'CRITICAL',
        scoreContribution: 50,
        description: 'Entire sanctioned amount of ₹50.0 Lakhs cleared in three rapid vouchers within 12 days of sanction.',
        evidence: 'Vouchers #RJK-01, #RJK-02, #RJK-03 disbursed consecutively between 12 June and 24 June 2024.',
        baseline: 'Typical milestone progression for medical works spans 90-180 days with stagewise physical sign-off.'
      },
      {
        name: 'Delivery Verification Pending for High-Value Equipment',
        category: 'Evidence',
        severity: 'HIGH',
        scoreContribution: 28,
        description: 'Payment released for Ultrasound and X-Ray unit before equipment delivery confirmation by PHC Medical Officer.',
        evidence: 'Stock register entry and installation commissioning certificate marked missing in audit check.',
        baseline: '100% payment release requires physical equipment serial numbers logged in Government asset registry.'
      },
      {
        name: 'Unusual Expenditure Curve',
        category: 'Financial',
        severity: 'MEDIUM',
        scoreContribution: 15,
        description: 'Zero gap between administrative sanction and final disbursement.',
        evidence: 'Time-to-disburse velocity index: 9.8 (outlier threshold > 3.0).',
        baseline: 'Standard administrative lead time from sanction to full payment: 140 days.'
      }
    ],
    predictedDelayMonths: 5,
    delayRiskFactor: 'MODERATE',
    evidenceList: [
      { id: 'ev-21', type: 'SANCTION_ORDER', title: 'Sanction Order Rajkot', documentRef: 'SO-RJK-2024-91.pdf', uploadedDate: '2024-06-03', uploadedBy: 'DPO Rajkot', status: 'VERIFIED' },
      { id: 'ev-22', type: 'PAYMENT_VOUCHER', title: 'Consolidated Disbursement Note', documentRef: 'VOUCHER-RJK-BUNDLE.pdf', uploadedDate: '2024-06-25', uploadedBy: 'Treasury Officer Rajkot', status: 'INCONSISTENT', notes: 'Released without Medical Officer installation certificate.' },
      { id: 'ev-23', type: 'COMPLETION_CERT', title: 'Medical Equipment Commissioning Cert', documentRef: 'Not_Issued.pdf', uploadedDate: '2024-07-01', uploadedBy: 'System', status: 'MISSING' }
    ],
    payments: [
      { id: 'pm-17', installmentNumber: 1, amount: 20.0, disbursementDate: '2024-06-12', voucherNumber: 'RJK/HLT/01', physicalProgressClaimed: 20, status: 'DISBURSED' },
      { id: 'pm-18', installmentNumber: 2, amount: 15.0, disbursementDate: '2024-06-18', voucherNumber: 'RJK/HLT/02', physicalProgressClaimed: 30, status: 'DISBURSED' },
      { id: 'pm-19', installmentNumber: 3, amount: 15.0, disbursementDate: '2024-06-24', voucherNumber: 'RJK/HLT/03', physicalProgressClaimed: 40, status: 'DISBURSED' }
    ]
  }
];

// Helper to generate deterministic synthetic dataset up to 520 works
export function generateSeedDataset(): MPLADSWork[] {
  const works: MPLADSWork[] = [...(PLANTED_ANOMALIES as MPLADSWork[])];
  let currentId = 10001;

  const states = Object.keys(STATES_DISTRICTS);

  // Road title generators
  const roadTemplates = [
    'Construction of CC Road from {origin} to {dest}',
    'Improvement and Asphalting of Link Road connecting {origin} and {dest}',
    'Construction of Concrete Paver Block Road at {origin}',
    'Widening and Drainage for Village Approach Road at {origin}'
  ];
  
  // Water title generators
  const waterTemplates = [
    'Drilling of Deep Borewell with Solar Submersible Pump at {origin}',
    'Augmentation of Piped Drinking Water Supply Network in {origin}',
    'Installation of RO Water Purification Kiosk near {origin}',
    'Construction of Overhead Water Reservoir (50,000 Litres) at {origin}'
  ];

  // Community & Hall templates
  const hallTemplates = [
    'Construction of Multi-Purpose Community Hall for Scheduled Caste Colony at {origin}',
    'Construction of Public Toilet Complex & Sanitation Facility at {origin}',
    'Construction of Gram Panchayat Citizen Service Centre at {origin}',
    'Renovation of Community Gathering Hall at {origin}'
  ];

  // School templates
  const schoolTemplates = [
    'Construction of Additional Classrooms (2 Units) at Zilla Parishad School, {origin}',
    'Construction of Science Laboratory and Library Hall at Govt Higher Secondary School, {origin}',
    'Construction of Anganwadi Centre Building with Child-Friendly Sanitation at {origin}',
    'Installation of Smart Classroom Equipment and Solar Inverter at {origin}'
  ];

  // Solar & Lighting templates
  const solarTemplates = [
    'Installation of Solar High Mast Light (9m) at Main Village Chowk, {origin}',
    'Installation of 30 Nos. LED Street Lights along Main Road at {origin}',
    'Installation of 5kW Solar Rooftop Power System at Primary Health Centre, {origin}'
  ];

  // Irrigation templates
  const irrigationTemplates = [
    'Construction of Cement Check Dam across Nala near {origin}',
    'Desiltation and Deepening of Community Percolation Tank at {origin}',
    'Construction of Lift Irrigation Feeder Channel at {origin}'
  ];

  const locationsList = [
    'Shivaji Nagar', 'Gandhi Chowk', 'Kalyanpur', 'Rampur', 'Madhopur', 'Ganeshpur',
    'Ambedkar Basti', 'Sardar Patel Nagar', 'Hanuman Nagar', 'Krishna Vihar',
    'Subhash Marg', 'Nehru Colony', 'Sundarpur', 'Raja Garden', 'Adarsh Gram',
    'Bhim Nagar', 'Gokul Dham', 'Vijay Nagar', 'Indira Colony', 'Tilak Nagar'
  ];

  for (let i = 0; i < 513; i++) {
    const idNum = currentId++;
    const workCode = `MP-${idNum}`;
    const state = states[i % states.length];
    const districts = STATES_DISTRICTS[state];
    const district = districts[i % districts.length];
    const baseCoords = DISTRICT_COORDS[district] || { lat: 20.5937, lng: 78.9629 };
    
    // Add jitter within ~8-12km of district centre
    const latJitter = ((i * 17) % 100 - 50) * 0.0022;
    const lngJitter = ((i * 31) % 100 - 50) * 0.0024;
    const latitude = Number((baseCoords.lat + latJitter).toFixed(6));
    const longitude = Number((baseCoords.lng + lngJitter).toFixed(6));

    const category = CATEGORIES[i % CATEGORIES.length];
    const agency = IMPLEMENTING_AGENCIES[i % IMPLEMENTING_AGENCIES.length];
    const mp = MP_NAMES[i % MP_NAMES.length];

    const loc1 = locationsList[(i * 3) % locationsList.length];
    const loc2 = locationsList[(i * 7 + 1) % locationsList.length];

    let title = '';
    if (category === 'Rural Roads & CC Roads') {
      title = roadTemplates[i % roadTemplates.length].replace('{origin}', loc1).replace('{dest}', loc2);
    } else if (category === 'Drinking Water') {
      title = waterTemplates[i % waterTemplates.length].replace('{origin}', loc1);
    } else if (category === 'Sanitation & Community Halls') {
      title = hallTemplates[i % hallTemplates.length].replace('{origin}', loc1);
    } else if (category === 'Education & Anganwadi') {
      title = schoolTemplates[i % schoolTemplates.length].replace('{origin}', loc1);
    } else if (category === 'Solar & Street Lighting') {
      title = solarTemplates[i % solarTemplates.length].replace('{origin}', loc1);
    } else if (category === 'Irrigation & Check Dams') {
      title = irrigationTemplates[i % irrigationTemplates.length].replace('{origin}', loc1);
    } else {
      title = `Development of Public Sports & Recreation Facility at ${loc1}, ${district}`;
    }

    // Realistic financial numbers (₹5 Lakhs to ₹60 Lakhs)
    const baseAmount = 10 + ((i * 13) % 45); // 10 to 55 Lakhs
    const estimatedCost = Number((baseAmount * 1.04).toFixed(1));
    const sanctionedAmount = Number(baseAmount.toFixed(1));

    // Determine completion status deterministically
    let status: ProjectStatus = 'COMPLETED';
    let physicalProgress = 100;
    let financialProgress = 100;
    let totalExpenditure = sanctionedAmount;
    let delayMonths = 0;
    let delayFactor: 'NORMAL' | 'MODERATE' | 'SEVERE' = 'NORMAL';

    const patternType = i % 10;
    if (patternType === 1 || patternType === 4 || patternType === 7) {
      status = 'IN_PROGRESS';
      physicalProgress = 30 + ((i * 11) % 65);
      financialProgress = Math.min(100, Math.round(physicalProgress * (0.9 + ((i % 5) * 0.05))));
      totalExpenditure = Number(((sanctionedAmount * financialProgress) / 100).toFixed(1));
      delayMonths = (i % 6);
      delayFactor = delayMonths > 3 ? 'MODERATE' : 'NORMAL';
    } else if (patternType === 9) {
      status = 'SANCTIONED';
      physicalProgress = 0;
      financialProgress = 0;
      totalExpenditure = 0;
    } else if (patternType === 8 && i % 4 === 0) {
      // Small statistical delay
      status = 'STALLED';
      physicalProgress = 45;
      financialProgress = 62;
      totalExpenditure = Number(((sanctionedAmount * 0.62)).toFixed(1));
      delayMonths = 8;
      delayFactor = 'SEVERE';
    }

    // Check for minor realistic signals
    const signals: RiskSignal[] = [];
    const anomalyTypes: AnomalyType[] = [];
    let reviewScore = 12 + ((i * 7) % 35); // baseline nominal score (12 - 47)
    let requiresVerification = false;

    // Introduce realistic minor anomaly in ~12% of items for statistical depth
    if (i % 8 === 0 && status !== 'COMPLETED') {
      reviewScore += 25;
      requiresVerification = true;
      anomalyTypes.push('TIMELINE_DELAY');
      signals.push({
        name: 'Milestone Execution Delay',
        category: 'Timeline',
        severity: 'MEDIUM',
        scoreContribution: 22,
        description: `Project is running ${delayMonths + 2} months behind statutory milestone schedule.`,
        evidence: 'Quarterly review sheet indicates material supply chain interruption.',
        baseline: 'Median duration for similar works: 6.2 months.'
      });
    }

    if (i % 15 === 0 && status === 'IN_PROGRESS') {
      reviewScore += 20;
      requiresVerification = true;
      anomalyTypes.push('EXPENDITURE_MISMATCH');
      signals.push({
        name: 'Expenditure Velocity Higher Than Progress',
        category: 'Financial',
        severity: 'MEDIUM',
        scoreContribution: 18,
        description: `Financial disbursement (${financialProgress}%) outpaces physical progress (${physicalProgress}%) by > 15 points.`,
        evidence: 'Voucher released before Stage-2 physical inspection upload.',
        baseline: 'Permissible disbursement variance: ±10%.'
      });
    }

    if (i % 23 === 0) {
      reviewScore += 18;
      requiresVerification = true;
      anomalyTypes.push('COST_OUTLIER');
      signals.push({
        name: 'Peer Group Cost Variance (+28%)',
        category: 'Financial',
        severity: 'MEDIUM',
        scoreContribution: 19,
        description: 'Estimated unit cost is 28% higher than median peer group works in the same district.',
        evidence: 'BoQ item unit rates exceed standard Schedule of Rates (SOR).',
        baseline: 'District peer group median: ₹' + (sanctionedAmount * 0.78).toFixed(1) + ' Lakhs.'
      });
    }

    reviewScore = Math.min(99, Math.max(8, reviewScore));
    let riskLevel: RiskLevel = 'LOW';
    if (reviewScore >= 80) riskLevel = 'CRITICAL';
    else if (reviewScore >= 65) riskLevel = 'HIGH';
    else if (reviewScore >= 45) riskLevel = 'MEDIUM';

    const work: MPLADSWork = {
      id: `work-${idNum}`,
      workCode,
      title,
      category,
      state,
      district,
      block: `${district} Rural Block-${(i % 4) + 1}`,
      constituency: `${district} (LS-${(i % 50) + 1})`,
      mpName: mp,
      sanctionYear: i % 2 === 0 ? '2024-25' : '2023-24',
      estimatedCost,
      sanctionedAmount,
      totalExpenditure,
      sanctionDate: `2024-0${(i % 8) + 1}-15`,
      commencementDate: `2024-0${(i % 8) + 2}-01`,
      targetCompletionDate: `2024-1${(i % 2) + 1}-30`,
      actualCompletionDate: status === 'COMPLETED' ? `2024-11-20` : undefined,
      physicalProgress,
      financialProgress: Number(financialProgress.toFixed(1)),
      status,
      implementingAgency: agency,
      contractorName: `Regional Infra Builder ${((i * 13) % 20) + 1} Ltd`,
      agencyContact: `EE-${agency.slice(0, 12)} (${district})`,
      latitude,
      longitude,
      locationName: `${loc1}, ${district}`,
      reviewPriorityScore: reviewScore,
      riskLevel,
      requiresVerification,
      anomalyTypes,
      anomalySignals: signals,
      predictedDelayMonths: delayMonths,
      delayRiskFactor: delayFactor,
      evidenceList: [
        {
          id: `ev-${idNum}-1`,
          type: 'SANCTION_ORDER',
          title: `Sanction Order #${idNum}/2024`,
          documentRef: `SO-${district.slice(0, 3).toUpperCase()}-${idNum}.pdf`,
          uploadedDate: `2024-02-15`,
          uploadedBy: `DPO ${district}`,
          status: 'VERIFIED'
        },
        {
          id: `ev-${idNum}-2`,
          type: 'MB_RECORD',
          title: `Measurement Book MB-${(idNum % 200) + 10}`,
          documentRef: `MB-${idNum}.pdf`,
          uploadedDate: `2024-06-18`,
          uploadedBy: `Junior Engineer`,
          status: status === 'COMPLETED' ? 'VERIFIED' : 'PENDING'
        }
      ],
      payments: [
        {
          id: `pm-${idNum}-1`,
          installmentNumber: 1,
          amount: Number((sanctionedAmount * 0.4).toFixed(1)),
          disbursementDate: `2024-03-10`,
          voucherNumber: `V-${idNum}-01`,
          physicalProgressClaimed: 40,
          status: 'DISBURSED'
        },
        {
          id: `pm-${idNum}-2`,
          installmentNumber: 2,
          amount: Number((totalExpenditure - (sanctionedAmount * 0.4)).toFixed(1)),
          disbursementDate: `2024-07-25`,
          voucherNumber: `V-${idNum}-02`,
          physicalProgressClaimed: physicalProgress,
          status: totalExpenditure > (sanctionedAmount * 0.4) ? 'DISBURSED' : 'PENDING'
        }
      ]
    };

    works.push(work);
  }

  return works;
}

export const INITIAL_AUDIT_TRAIL = [
  {
    id: 'audit-001',
    workId: 'work-10482',
    workCode: 'MP-10482',
    timestamp: '2026-09-29 09:15:22 IST',
    userRole: 'MINISTRY_OFFICIAL' as const,
    userName: 'Director MoSPI Vigilance',
    action: 'ALERT_GENERATED' as const,
    details: 'AI Engine flagged Duplicate Work Anomaly (94% NLP Similarity) with MP-10483.',
    verificationHash: 'SHA256:4a8b29f0e1d2c3b4a5...'
  },
  {
    id: 'audit-002',
    workId: 'work-10219',
    workCode: 'MP-10219',
    timestamp: '2026-09-29 08:42:10 IST',
    userRole: 'VIGILANCE_AUDITOR' as const,
    userName: 'State Technical Auditor UP',
    action: 'INSPECTION_SCHEDULED' as const,
    details: 'Scheduled field physical audit for Khaga RO plant due to 94% fund outflow with 22% progress.',
    verificationHash: 'SHA256:7f1c9983de01b2a4...'
  },
  {
    id: 'audit-003',
    workId: 'work-10871',
    workCode: 'MP-10871',
    timestamp: '2026-09-28 17:30:45 IST',
    userRole: 'DISTRICT_COLLECTOR' as const,
    userName: 'District Magistrate Barabanki',
    action: 'EVIDENCE_UPLOADED' as const,
    details: 'Requested re-verification of DPR and BoQ from Executive Engineer DRDA.',
    verificationHash: 'SHA256:9c0e4412ad88f123...'
  },
  {
    id: 'audit-004',
    workId: 'work-10933',
    workCode: 'MP-10933',
    timestamp: '2026-09-28 14:12:00 IST',
    userRole: 'STATE_NODAL_OFFICER' as const,
    userName: 'State Nodal Officer Rajasthan',
    action: 'STATUS_UPDATED' as const,
    details: 'Moved status to UNDER_VERIFICATION pending re-submission of geo-stamped site imagery.',
    verificationHash: 'SHA256:1b3d5e7f9a2c4e68...'
  },
  {
    id: 'audit-005',
    workId: 'work-10512',
    workCode: 'MP-10512',
    timestamp: '2026-09-28 11:05:19 IST',
    userRole: 'VIGILANCE_AUDITOR' as const,
    userName: 'Comptroller Inspection Team',
    action: 'ALERT_VIEWED' as const,
    details: 'Flagged rapid payment velocity (100% fund disbursement in 12 days) for expedited verification.',
    verificationHash: 'SHA256:3a6f8b0d2e4c1a99...'
  }
];
