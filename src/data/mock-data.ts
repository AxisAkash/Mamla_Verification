import type { Case } from "@/types/case";
import type { Citation, Evidence, LegalProvision } from "@/types/legal";
import type {
  ExtractedInformation,
  ResolvedVerificationResult,
  VerificationMessage,
  VerificationResult,
} from "@/types/verification";

export const DEMO_FLAG_NOTE =
  "Demonstration data. Not legal advice and not an official record.";

export const demoProvisions: LegalProvision[] = [
  {
    id: "prov-signal",
    act: "Road Transport Act, 2018",
    section: "Section entry · illustrative",
    violationType: "Alleged signal non-compliance",
    conditions: [
      "The notice must identify a specific intersection and timestamp.",
      "Signal state at the recorded time must be corroborating evidence.",
      "The issuing authority and notice number must be verifiable.",
    ],
    penalty: "Illustrative entry — no penalty is asserted by this demo.",
    source: "Official Legal Provision",
    sourceNote:
      "Section reference is illustrative for interface demonstration only.",
    isDemo: true,
  },
  {
    id: "prov-notice-validity",
    act: "Road Transport Act, 2018",
    section: "Section entry · illustrative",
    violationType: "Alleged notice validity and record-keeping",
    conditions: [
      "A notice must carry a legible notice number and issuing authority.",
      "Vehicle identification must match a registered record.",
      "Material ambiguity triggers manual legal review.",
    ],
    penalty: "Illustrative entry — no penalty is asserted by this demo.",
    source: "Official Legal Provision",
    sourceNote:
      "Section reference is illustrative for interface demonstration only.",
    isDemo: true,
  },
];

export const demoCitations: Citation[] = [
  {
    id: "cite-provision",
    reference: "Road Transport Act, 2018 · illustrative section entry",
    source: "Official Legal Provision",
    note: "Frames the signal-compliance comparison used in this run.",
    isDemo: true,
  },
  {
    id: "cite-notice",
    reference: "Notice DT-2026-4471 · submitted image",
    source: "Applicant evidence",
    note: "Primary source for the alleged time, location, and violation.",
    isDemo: true,
  },
  {
    id: "cite-record",
    reference: "Structured case record MV-2026-0417",
    source: "Extraction output",
    note: "Field-by-field structure produced during processing.",
    isDemo: true,
  },
];

export const demoEvidence: Evidence[] = [
  {
    id: "ev-photo",
    kind: "image",
    title: "Notice photograph",
    description:
      "Photo of the printed notice submitted at the start of the case.",
    source: "Uploaded by applicant",
    capturedAt: "2026-01-14T09:10:00+06:00",
    excerpt: "DT-2026-4471 · Banani · 08:41 · signal non-compliance",
    isDemo: true,
  },
  {
    id: "ev-registration",
    kind: "document",
    title: "Vehicle registration extract",
    description: "Registration details used to match the vehicle on the notice.",
    source: "Uploaded by applicant",
    capturedAt: "2026-01-14T09:11:00+06:00",
    excerpt: "DHA-MET-4471 · private car · silver",
    isDemo: true,
  },
  {
    id: "ev-url",
    kind: "url",
    title: "Portal reference",
    description: "Link pasted alongside the notice for cross-checking.",
    source: "Pasted URL",
    capturedAt: "2026-01-14T09:11:00+06:00",
    excerpt: "https://example.invalid/notice/DT-2026-4471",
    isDemo: true,
  },
  {
    id: "ev-location-note",
    kind: "text",
    title: "Applicant note",
    description: "Statement provided by the applicant in plain text.",
    source: "Typed by applicant",
    capturedAt: "2026-01-14T09:12:00+06:00",
    excerpt: "The signal at that intersection was reportedly out of service.",
    isDemo: true,
  },
];

export const demoCases: Case[] = [
  {
    id: "MV-2026-0417",
    reference: "MV-2026-0417",
    title: "Alleged signal non-compliance — Banani (demo)",
    createdAt: "2026-01-14T09:12:00+06:00",
    inputType: "image",
    sourceLabel: "notice-photo.jpg",
    notice: {
      noticeNumber: "DT-2026-4471",
      issuingAuthority: "Metropolitan Traffic Division — demo issuer",
      issuedAt: "2026-01-14T08:41:00+06:00",
      location: "Banani, Dhaka — intersection 4 (demo location)",
      violationDescription: "Alleged crossing against a red signal",
      penaltyAmount: "৳500 (illustrative entry)",
      vehicle: {
        registrationNumber: "DHA-MET-4471",
        type: "Private car",
        make: "Toyota",
        model: "Axio",
        color: "Silver",
      },
    },
    status: "POTENTIALLY_NONCOMPLIANT",
    summary:
      "A notice image was submitted and structured. Comparison against illustrative provisions suggests a possible conflict that requires human confirmation.",
    isDemo: true,
  },
  {
    id: "MV-2026-0418",
    reference: "MV-2026-0418",
    title: "Parking notice without readable details (demo)",
    createdAt: "2026-01-15T17:05:00+06:00",
    inputType: "text",
    sourceLabel: "pasted notice text",
    notice: {
      noticeNumber: "Not legible in submitted text",
      issuingAuthority: "Not stated in submitted text",
      issuedAt: "2026-01-15T14:30:00+06:00",
      location: "Not stated in submitted text",
      violationDescription: "Alleged parking in a restricted zone",
      penaltyAmount: "Not stated in submitted text",
      vehicle: {
        registrationNumber: "Not stated in submitted text",
        type: "Not stated in submitted text",
      },
    },
    status: "INSUFFICIENT_INFORMATION",
    summary:
      "The pasted text does not carry a notice number, issuing authority, or location, so no comparison against provisions could be completed.",
    isDemo: true,
  },
];

export const demoResults: VerificationResult[] = [
  {
    id: "RES-0417",
    caseId: "MV-2026-0417",
    status: "POTENTIALLY_NONCOMPLIANT",
    headline: "Possible conflict with a cited provision — confirmation required",
    claim:
      "The notice alleges that the vehicle crossed an intersection against a red signal on 14 January 2026 at 08:41.",
    summary:
      "Submitted material and extracted fields were compared against illustrative retained provisions. The recorded details are internally consistent, but the central claim rests on a signal state that no submitted evidence corroborates.",
    reasoning: [
      "Notice number, timestamp, location, and vehicle registration were extracted with high confidence from the submitted image.",
      "The extracted violation type maps to an illustrative provision on signal non-compliance.",
      "No submitted evidence records the signal state at the stated time, so the allegation is neither confirmed nor dismissed.",
      "The classification therefore reports a potential conflict and routes the case toward human confirmation.",
    ],
    limitations: [
      "Section references in this demonstration are illustrative and must not be relied on as legal citations.",
      "No live legal database, government portal, or official record was consulted.",
      "Signal status, road conditions, and officer notes were not available as evidence.",
      "This output does not determine guilt and does not replace official appeals or legal advice.",
    ],
    provisionIds: ["prov-signal", "prov-notice-validity"],
    citationIds: ["cite-provision", "cite-notice", "cite-record"],
    evidenceIds: ["ev-photo", "ev-registration", "ev-url", "ev-location-note"],
    generatedAt: "2026-01-14T09:20:00+06:00",
    confidence: 68,
  },
  {
    id: "RES-0418",
    caseId: "MV-2026-0418",
    status: "INSUFFICIENT_INFORMATION",
    headline: "Not enough material to compare against provisions",
    claim:
      "A parking notice was pasted as plain text, alleging a violation in a restricted zone.",
    summary:
      "The submitted text is missing the notice number, issuing authority, and location. Without these fields, no provision comparison can be performed safely.",
    reasoning: [
      "Required fields (notice number, issuing authority, location) could not be extracted from the pasted text.",
      "Without a verifiable notice identity, no provision mapping can be attempted.",
      "The case is held as insufficient rather than guessed at.",
    ],
    limitations: [
      "No document image or portal link was provided to cross-check the claim.",
      "Section references in this demonstration are illustrative only.",
      "This output does not determine guilt and does not replace official appeals or legal advice.",
    ],
    provisionIds: [],
    citationIds: ["cite-record"],
    evidenceIds: ["ev-location-note"],
    generatedAt: "2026-01-15T17:12:00+06:00",
    confidence: 31,
  },
];

export const demoExtracted: ExtractedInformation = {
  overallConfidence: 89,
  sourceLabel: "notice-photo.jpg",
  fields: [
    { label: "Notice number", value: "DT-2026-4471", confidence: 96 },
    { label: "Issuing authority", value: "Metropolitan Traffic Division", confidence: 91 },
    { label: "Issue date & time", value: "14 Jan 2026 · 08:41", confidence: 94 },
    { label: "Location", value: "Banani, Dhaka — intersection 4", confidence: 88 },
    { label: "Alleged violation", value: "Signal non-compliance", confidence: 89 },
    { label: "Vehicle registration", value: "DHA-MET-4471", confidence: 97 },
    { label: "Penalty amount", value: "৳500 (illustrative)", confidence: 72 },
  ],
};

export const demoMessages: VerificationMessage[] = [
  {
    id: "msg-1",
    author: "system",
    content:
      "Case MV-2026-0417 opened from a submitted notice image. Structured fields are ready for review.",
    sentAt: "2026-01-14T09:12:00+06:00",
    citationIds: ["cite-record"],
    evidenceIds: ["ev-photo"],
  },
  {
    id: "msg-2",
    author: "advisor",
    content:
      "The notice records signal non-compliance at 08:41 near intersection 4. I retained an illustrative provision on signal compliance and one on notice validity for comparison.",
    sentAt: "2026-01-14T09:13:00+06:00",
    citationIds: ["cite-provision", "cite-notice"],
    evidenceIds: ["ev-photo", "ev-registration"],
  },
  {
    id: "msg-3",
    author: "applicant",
    content:
      "The signal at that intersection was reportedly out of service that morning. I do not have a photo of it.",
    sentAt: "2026-01-14T09:15:00+06:00",
    evidenceIds: ["ev-location-note"],
  },
  {
    id: "msg-4",
    author: "advisor",
    content:
      "That claim is recorded, but it is not supported by any submitted evidence. In this demonstration, unsupported claims are logged as gaps rather than treated as findings.",
    sentAt: "2026-01-14T09:16:00+06:00",
    citationIds: ["cite-provision"],
    evidenceIds: ["ev-url"],
  },
  {
    id: "msg-5",
    author: "system",
    content:
      "Verification report prepared: potentially noncompliant (demo). Open the report to review the claim, evidence, law, and limitations side by side.",
    sentAt: "2026-01-14T09:20:00+06:00",
    citationIds: ["cite-record"],
  },
];

const caseById = new Map(demoCases.map((entry) => [entry.id, entry]));
const resultByCaseId = new Map(
  demoResults.map((entry) => [entry.caseId, entry])
);
const provisionById = new Map(demoProvisions.map((entry) => [entry.id, entry]));
const citationById = new Map(demoCitations.map((entry) => [entry.id, entry]));
const evidenceById = new Map(demoEvidence.map((entry) => [entry.id, entry]));

export function getCaseById(id: string): Case | undefined {
  return caseById.get(id);
}

export function getResolvedResultByCaseId(
  id: string
): ResolvedVerificationResult | undefined {
  const result = resultByCaseId.get(id);
  if (!result) return undefined;

  return {
    ...result,
    provisions: result.provisionIds
      .map((provisionId) => provisionById.get(provisionId))
      .filter((entry): entry is LegalProvision => Boolean(entry)),
    citations: result.citationIds
      .map((citationId) => citationById.get(citationId))
      .filter((entry): entry is Citation => Boolean(entry)),
    evidence: result.evidenceIds
      .map((evidenceId) => evidenceById.get(evidenceId))
      .filter((entry): entry is Evidence => Boolean(entry)),
  };
}

export function getCitationsByIds(ids: string[] = []): Citation[] {
  return ids
    .map((citationId) => citationById.get(citationId))
    .filter((entry): entry is Citation => Boolean(entry));
}

export function getEvidenceByIds(ids: string[] = []): Evidence[] {
  return ids
    .map((evidenceId) => evidenceById.get(evidenceId))
    .filter((entry): entry is Evidence => Boolean(entry));
}
