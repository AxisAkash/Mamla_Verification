export type EvidenceKind = "image" | "document" | "url" | "text";

export interface Evidence {
  id: string;
  kind: EvidenceKind;
  title: string;
  description: string;
  source: string;
  capturedAt: string;
  excerpt?: string;
  isDemo: boolean;
}

export interface LegalProvision {
  id: string;
  act: string;
  section: string;
  violationType: string;
  conditions: string[];
  penalty: string;
  source: string;
  sourceNote?: string;
  isDemo: boolean;
}

export interface Citation {
  id: string;
  reference: string;
  source: string;
  note: string;
  isDemo: boolean;
}
