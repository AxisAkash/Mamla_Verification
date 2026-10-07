import type { Citation, Evidence, LegalProvision } from "./legal";

export const VERIFICATION_STATUS = {
  CONFORMS: "CONFORMS_TO_RETAINED_LEGAL_PROVISIONS",
  POTENTIALLY_NONCOMPLIANT: "POTENTIALLY_NONCOMPLIANT",
  INSUFFICIENT_INFORMATION: "INSUFFICIENT_INFORMATION",
  MANUAL_LEGAL_REVIEW_NEEDED: "MANUAL_LEGAL_REVIEW_NEEDED",
} as const;

export type VerificationStatus =
  (typeof VERIFICATION_STATUS)[keyof typeof VERIFICATION_STATUS];

export type VerificationInputType = "image" | "document" | "url" | "text";

export type VerificationStage =
  | "input"
  | "processing"
  | "extracted"
  | "conversation";

export type MessageAuthor = "applicant" | "advisor" | "system";

export interface VerificationMessage {
  id: string;
  author: MessageAuthor;
  content: string;
  sentAt: string;
  citationIds?: string[];
  evidenceIds?: string[];
}

export interface ExtractedField {
  label: string;
  value: string;
  confidence?: number;
}

export interface ExtractedInformation {
  fields: ExtractedField[];
  overallConfidence: number;
  sourceLabel: string;
}

export interface NextStep {
  id: string;
  label: string;
  description: string;
  href?: string;
  tone?: "default" | "attention" | "quiet";
}

export interface VerificationResult {
  id: string;
  caseId: string;
  status: VerificationStatus;
  headline: string;
  claim: string;
  summary: string;
  reasoning: string[];
  limitations: string[];
  provisionIds: string[];
  citationIds: string[];
  evidenceIds: string[];
  generatedAt: string;
  confidence: number;
  nextSteps: NextStep[];
}

export interface ResolvedVerificationResult
  extends Omit<
    VerificationResult,
    "provisionIds" | "citationIds" | "evidenceIds"
  > {
  provisions: LegalProvision[];
  citations: Citation[];
  evidence: Evidence[];
}
