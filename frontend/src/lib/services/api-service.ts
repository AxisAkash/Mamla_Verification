import type { Case, TrafficNotice } from '@/types/case';
import type { Evidence } from '@/types/legal';
import type {
  ExtractedInformation,
  NoticeFact,
  NoticeFactKey,
  ResolvedVerificationResult,
  VerificationInputType,
} from '@/types/verification';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api').replace(/\/$/, '');

interface ApiErrorBody {
  error?: { code?: string; message?: string };
}

interface BackendCaseResponse {
  case: {
    id: string;
    reference: string;
    title: string;
    createdAt: string;
    updatedAt?: string;
    inputType: VerificationInputType;
    sourceLabel: string;
    status: Case['status'];
    summary: string;
    isDemo: boolean;
  };
  notice: {
    noticeType: string;
    noticeNumber: string;
    issuingAuthority: string;
    issuedAt: string;
    location: string;
    violationDescription: string;
    penaltyAmount?: string;
    vehicle: {
      registrationNumber: string;
      type: string;
      make?: string;
      model?: string;
      color?: string;
    };
  };
  status: Case['status'];
  version: number;
}

interface BackendEvidence {
  id: string;
  kind: Evidence['kind'];
  title: string;
  description: string;
  source: string;
  capturedAt: string;
  excerpt?: string;
  isDemo: boolean;
  originalFilename?: string;
  mediaType?: string;
  sizeBytes?: number;
  sha256?: string;
  processingStatus: string;
  extractionError?: string;
  uploadedAt?: string;
  processedAt?: string;
}

interface BackendFactsResponse {
  caseId: string;
  evidenceId?: string;
  status: string;
  overallConfidence: number;
  facts: BackendFact[];
  error?: string;
}

interface BackendFact {
  key: NoticeFactKey;
  label: string;
  value: string;
  extractedValue?: string;
  confirmedValue?: string;
  confidence?: number;
  evidenceIds?: string[];
  sourceReference?: string;
  sourceText?: string;
  isUserConfirmed: boolean;
}

interface BackendResult {
  schemaVersion: 1;
  id: string;
  caseId: string;
  status: Case['status'];
  headline: string;
  claim: string;
  summary: string;
  reasoning: string[];
  limitations: string[];
  comparison: ResolvedVerificationResult['comparison'];
  provisionIds: string[];
  citationIds: string[];
  evidenceIds: string[];
  generatedAt: string;
  confidence: number;
  nextSteps: ResolvedVerificationResult['nextSteps'];
}

interface BackendResultEnvelope {
  result: BackendResult;
}

interface BackendEvidenceList {
  items: BackendEvidence[];
}

interface BackendExtractedFacts {
  caseId: string;
  evidenceId: string;
  status: string;
  overallConfidence: number;
  facts: BackendFact[];
  error?: string;
}

interface BackendOCR {
  rawText?: string;
  normalizedText?: string;
}

interface BackendUpload {
  caseId: string;
  evidenceId: string;
  originalFilename: string;
  mediaType: string;
  sizeBytes: number;
  sha256: string;
  processingStatus: string;
  isDuplicate: boolean;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
    throw new Error(body?.error?.message ?? `The API request failed (${response.status}).`);
  }

  return (await response.json()) as T;
}

function mapNotice(notice: BackendCaseResponse['notice']): TrafficNotice {
  return {
    noticeType: notice.noticeType === 'traffic' ? 'traffic' : 'traffic',
    noticeNumber: notice.noticeNumber,
    issuingAuthority: notice.issuingAuthority,
    issuedAt: notice.issuedAt,
    location: notice.location,
    violationDescription: notice.violationDescription,
    penaltyAmount: notice.penaltyAmount,
    vehicle: notice.vehicle,
  };
}

function mapCase(payload: BackendCaseResponse): Case {
  return {
    ...payload.case,
    notice: mapNotice(payload.notice),
    status: payload.status,
  };
}

function mapFact(fact: BackendFact): NoticeFact {
  return {
    key: fact.key,
    label: fact.label,
    value: fact.value,
    extractedValue: fact.extractedValue,
    confirmedValue: fact.confirmedValue,
    confidence: fact.confidence,
    evidenceIds: fact.evidenceIds,
    sourceReference: fact.sourceReference,
    sourceText: fact.sourceText,
    isUserConfirmed: fact.isUserConfirmed,
  };
}

function mapEvidence(item: BackendEvidence): Evidence {
  return {
    id: item.id,
    kind: item.kind,
    title: item.originalFilename ?? item.title,
    description: item.description,
    source: item.source,
    capturedAt: item.capturedAt,
    excerpt: item.excerpt,
    isDemo: item.isDemo,
  };
}

export async function createApiCase(input: {
  inputType: VerificationInputType;
  sourceLabel: string;
}): Promise<Case> {
  const payload = await request<BackendCaseResponse>('/cases', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ inputType: input.inputType, sourceLabel: input.sourceLabel }),
  });
  return mapCase(payload);
}

export async function uploadApiEvidence(caseId: string, file: File): Promise<BackendUpload> {
  const body = new FormData();
  body.append('file', file, file.name);
  return request<BackendUpload>(`/cases/${encodeURIComponent(caseId)}/evidence`, {
    method: 'POST',
    body,
  });
}

export async function extractApiEvidence(caseId: string, evidenceId: string): Promise<ExtractedInformation & { status: string; evidenceId: string; error?: string }> {
  const payload = await request<BackendExtractedFacts>(
    `/cases/${encodeURIComponent(caseId)}/evidence/${encodeURIComponent(evidenceId)}/extract`,
    { method: 'POST' },
  );
  const ocr = await request<BackendOCR>(`/cases/${encodeURIComponent(caseId)}/evidence/${encodeURIComponent(evidenceId)}/ocr`);
  return {
    fields: payload.facts.map(mapFact),
    overallConfidence: payload.overallConfidence,
    sourceLabel: 'Uploaded notice',
    status: payload.status,
    evidenceId: payload.evidenceId,
    error: payload.error,
    rawText: ocr.rawText,
    normalizedText: ocr.normalizedText,
  };
}

export async function updateApiFacts(caseId: string, facts: NoticeFact[]): Promise<NoticeFact[]> {
  const payload = await request<{ facts: BackendFact[] }>(`/cases/${encodeURIComponent(caseId)}/facts`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      facts: facts.map((fact) => ({
        key: fact.key,
        label: fact.label,
        value: fact.value,
        isUserConfirmed: true,
      })),
    }),
  });
  return payload.facts.map(mapFact);
}

export async function getApiFacts(caseId: string): Promise<ExtractedInformation & { status: string; evidenceId?: string; error?: string }> {
  const payload = await request<BackendFactsResponse>(`/cases/${encodeURIComponent(caseId)}/facts`);
  const ocr = payload.evidenceId
    ? await request<BackendOCR>(`/cases/${encodeURIComponent(caseId)}/evidence/${encodeURIComponent(payload.evidenceId)}/ocr`)
    : null;
  return {
    fields: payload.facts.map(mapFact),
    overallConfidence: payload.overallConfidence,
    sourceLabel: 'Uploaded notice',
    status: payload.status,
    evidenceId: payload.evidenceId,
    error: payload.error,
    rawText: ocr?.rawText,
    normalizedText: ocr?.normalizedText,
  };
}

export async function getApiCase(caseId: string): Promise<Case> {
  return mapCase(await request<BackendCaseResponse>(`/cases/${encodeURIComponent(caseId)}`));
}

export async function getApiEvidence(caseId: string): Promise<Evidence[]> {
  const payload = await request<BackendEvidenceList>(`/cases/${encodeURIComponent(caseId)}/evidence`);
  return payload.items.map(mapEvidence);
}

export async function verifyApiCase(caseId: string, evidence: Evidence[]): Promise<ResolvedVerificationResult> {
  const payload = await request<BackendResultEnvelope>(`/cases/${encodeURIComponent(caseId)}/verify`, {
    method: 'POST',
  });
  return mapResult(payload.result, evidence);
}

function mapResult(result: BackendResult, evidence: Evidence[]): ResolvedVerificationResult {
  return {
    schemaVersion: result.schemaVersion,
    id: result.id,
    caseId: result.caseId,
    status: result.status,
    headline: result.headline,
    claim: result.claim,
    summary: result.summary,
    reasoning: result.reasoning,
    limitations: result.limitations,
    comparison: result.comparison,
    generatedAt: result.generatedAt,
    confidence: result.confidence,
    nextSteps: result.nextSteps,
    provisions: [],
    citations: [],
    evidence,
  };
}

export async function getApiCaseReport(caseId: string): Promise<{ caseRecord: Case; result: ResolvedVerificationResult }> {
  const [caseRecord, evidence] = await Promise.all([getApiCase(caseId), getApiEvidence(caseId)]);
  const envelope = await request<BackendResultEnvelope>(`/cases/${encodeURIComponent(caseId)}/result`);
  const result = mapResult(envelope.result, evidence);
  return { caseRecord, result };
}
