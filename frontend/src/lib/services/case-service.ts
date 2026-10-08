import type { Case } from '@/types/case';
import type { Citation, Evidence } from '@/types/legal';
import type {
  ExtractedInformation,
  NoticeFact,
  ResolvedVerificationResult,
  VerificationInputType,
  VerificationMessage,
} from '@/types/verification';
import {
  demoCases,
  demoCitations,
  demoEvidence,
  demoExtractedByCase,
  demoMessages,
  demoProvisions,
  demoResults,
} from '@/data/mock-data';

/**
 * Case service boundary.
 *
 * UI components talk to this module, never to fixture internals. Today every
 * operation is backed by deterministic demo fixtures from src/data; a future
 * implementation can swap the internals for API calls without changing
 * component code.
 */

export interface CaseWorkflow {
  caseRecord: Case;
  extracted: ExtractedInformation;
  messages: VerificationMessage[];
  result: ResolvedVerificationResult;
}

export interface CreateCaseInput {
  inputType: VerificationInputType;
  sourceLabel: string;
}

const caseById = new Map(demoCases.map((entry) => [entry.id, entry]));
const resultByCaseId = new Map(
  demoResults.map((entry) => [entry.caseId, entry])
);
const provisionById = new Map(demoProvisions.map((entry) => [entry.id, entry]));
const citationById = new Map(demoCitations.map((entry) => [entry.id, entry]));
const evidenceById = new Map(demoEvidence.map((entry) => [entry.id, entry]));

export function listCases(): Case[] {
  return demoCases;
}

export function getCase(caseId: string): Case | undefined {
  return caseById.get(caseId);
}

export function getCaseResult(
  caseId: string
): ResolvedVerificationResult | undefined {
  const result = resultByCaseId.get(caseId);
  if (!result) return undefined;

  return {
    ...result,
    provisions: result.provisionIds
      .map((id) => provisionById.get(id))
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry)),
    citations: result.citationIds
      .map((id) => citationById.get(id))
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry)),
    evidence: result.evidenceIds
      .map((id) => evidenceById.get(id))
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry)),
  };
}

export function getCaseEvidence(evidenceIds: string[] = []): Evidence[] {
  return evidenceIds
    .map((id) => evidenceById.get(id))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
}

export function getCaseCitations(citationIds: string[] = []): Citation[] {
  return citationIds
    .map((id) => citationById.get(id))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
}

export function getCaseExtracted(
  caseId: string
): ExtractedInformation | undefined {
  return demoExtractedByCase[caseId];
}

/**
 * Mock-backed intake. The input is intentionally not persisted in the
 * frontend phase; it is kept here so a future API adapter has a stable seam.
 */
export function createCase(input: CreateCaseInput): Case {
  void input;
  return demoCases[0];
}

export function extractNotice(
  caseId: string
): ExtractedInformation | undefined {
  return getCaseExtracted(caseId);
}

/**
 * Mock-backed fact confirmation. The returned facts are a new array and are
 * marked as user-confirmed, ready for a future persistence implementation.
 */
export function updateCaseFacts(
  caseId: string,
  facts: NoticeFact[]
): NoticeFact[] | undefined {
  if (!getCase(caseId)) return undefined;

  return facts.map((fact) => ({ ...fact, isUserConfirmed: true }));
}

export function verifyCase(
  caseId: string
): ResolvedVerificationResult | undefined {
  return getCaseResult(caseId);
}

export function getDemoWorkflow(): CaseWorkflow {
  const caseRecord = demoCases[0];
  const result = getCaseResult(caseRecord.id);
  const extracted = getCaseExtracted(caseRecord.id);

  if (!result || !extracted) {
    throw new Error('Missing demo workflow fixture');
  }

  return {
    caseRecord,
    extracted,
    messages: demoMessages,
    result,
  };
}
