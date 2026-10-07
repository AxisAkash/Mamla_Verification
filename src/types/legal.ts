export type EvidenceKind = 'image' | 'document' | 'url' | 'text';

export interface Evidence {
  id: string;
  kind: EvidenceKind;
  title: string;
  description: string;
  source: string;
  capturedAt: string;
  excerpt?: string;
  caseId?: string;
  isDemo: boolean;
}

/**
 * A retained legal provision as surfaced from a legal knowledge base.
 * All current fixtures are illustrative demo entries — never authoritative.
 */
export interface LegalProvision {
  id: string;
  document: string;
  section: string;
  ruleIdentifier: string;
  violationType: string;
  conditions: string[];
  penalty: string;
  location: string;
  origin: string;
  timeframe: string;
  source: string;
  sourceNote?: string;
  isDemo: boolean;
}

export interface Citation {
  id: string;
  reference: string;
  source: string;
  note: string;
  targetType: 'case' | 'notice' | 'evidence' | 'provision';
  targetId: string;
  isDemo: boolean;
}
