export enum VerificationStatus {
  Verified = 'Verified',
  False = 'False',
  Misleading = 'Misleading',
  Pending = 'Pending'
}

export enum City {
  All = 'All India',
  Mumbai = 'Mumbai',
  Coimbatore = 'Coimbatore',
  Cochin = 'Cochin'
}

export interface Claim {
  id: string;
  text: string;
  source: string;
  city: City | string; // Allow string to accommodate CSV values
  area: string;
  status: VerificationStatus;
  timestamp: number;
  explanation?: string;
  confidenceScore?: number;
  attachmentType?: 'image' | 'audio';
  attachmentName?: string;
  // Specific fields for Sheet CSV
  truthEnglish?: string;
  debunkNative?: string;
  // Field for debugging raw N8N response
  rawAnalysis?: any;
}

export interface DashboardStats {
  totalClaims: number;
  verified: number;
  falseInfo: number;
  pending: number;
  accuracy: number;
}