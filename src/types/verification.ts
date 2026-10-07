import type { Citation, Evidence, LegalProvision } from './legal';

export const VERIFICATION_STATUS = {
  CONFORMS: 'CONFORMS',
  POTENTIALLY_NONCOMPLIANT: 'POTENTIALLY_NONCOMPLIANT',
  INSUFFICIENT_INFORMATION: 'INSUFFICIENT_INFORMATION',
  MANUAL_LEGAL_REVIEW: 'MANUAL_LEGAL_REVIEW',
} as const;

export type VerificationStatus =
  (typeof VERIFICATION_STATUS)[keyof typeof VERIFICATION_STATUS];

export type VerificationInputType = 'image' | 'document' | 'url' | 'text';

export type NoticeFactKey =
  | 'noticeNumber'
  | 'issuingAuthority'
  | 'issuedAt'
  | 'location'
  | 'violation'
  | 'vehicleRegistration'
  | 'vehicleType'
  | 'penaltyAmount';

export type ConfidenceScore = number;

export type VerificationStage =
  | 'input'
  | 'processing'
  | 'extracted'
  | 'conversation';

export type MessageAuthor = 'applicant' | 'advisor' | 'system';

export interface VerificationMessage {
  id: string;
  author: MessageAuthor;
  content: string;
  sentAt: string;
  citationIds?: string[];
  evidenceIds?: string[];
}

/**
 * A single fact read from a notice. The key is the stable machine identifier
 * a backend can bind to; the label is display text only.
 */
export interface NoticeFact {
  key: NoticeFactKey;
  label: string;
  value: string;
  confidence?: ConfidenceScore;
  evidenceIds?: string[];
  isUserConfirmed?: boolean;
}

export interface ExtractedInformation {
  fields: NoticeFact[];
  overallConfidence: ConfidenceScore;
  sourceLabel: string;
}

/**
 * One row of the Notice vs Law comparison — the core trust model.
 */
export interface NoticeLawComparisonRow {
  label: string;
  noticeSays: string;
  lawSays: string;
}

export interface NextStep {
  id: string;
  label: string;
  description: string;
  href?: string;
  tone?: 'default' | 'attention' | 'quiet';
  action?:
    | 'review-evidence'
    | 'add-information'
    | 'manual-review'
    | 'review-source'
    | 'start-over';
}

export interface VerificationResult {
  schemaVersion: 1;
  id: string;
  caseId: string;
  status: VerificationStatus;
  headline: string;
  claim: string;
  summary: string;
  reasoning: string[];
  limitations: string[];
  comparison: NoticeLawComparisonRow[];
  provisionIds: string[];
  citationIds: string[];
  evidenceIds: string[];
  generatedAt: string;
  confidence: ConfidenceScore;
  nextSteps: NextStep[];
}

export interface ResolvedVerificationResult
  extends Omit<
    VerificationResult,
    'provisionIds' | 'citationIds' | 'evidenceIds'
  > {
  provisions: LegalProvision[];
  citations: Citation[];
  evidence: Evidence[];
}
