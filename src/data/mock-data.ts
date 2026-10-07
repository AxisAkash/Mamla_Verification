import type { Case } from '@/types/case';
import type { Citation, Evidence, LegalProvision } from '@/types/legal';
import type {
  ExtractedInformation,
  VerificationMessage,
  VerificationResult,
} from '@/types/verification';

/**
 * Deterministic demonstration fixtures.
 *
 * These records exist only to exercise the interface. They are illustrative,
 * not real legal data, and must never be presented as authoritative. Lookup
 * and retrieval logic lives in src/lib/services/case-service.ts.
 */

export const DEMO_FLAG_NOTE =
  'Demonstration data. Not legal advice and not an official record.';

export const demoProvisions: LegalProvision[] = [
  {
    id: 'prov-signal',
    document: 'Illustrative traffic statute',
    section: 'Section entry · illustrative',
    ruleIdentifier: 'DEMO-SIGNAL-001',
    violationType: 'Alleged signal non-compliance',
    conditions: [
      'The notice must identify a specific intersection and timestamp.',
      'Signal state at the recorded time must be corroborating evidence.',
      'The issuing authority and notice number must be verifiable.',
    ],
    penalty: 'Illustrative entry — no penalty is asserted by this demo.',
    location: 'Public intersections (demo scope note)',
    origin: 'Demo legal knowledge fixture',
    timeframe: 'Fixture current as of the demo period',
    source: 'Illustrative legal provision',
    sourceNote: 'This section reference is interface data only.',
    isDemo: true,
  },
  {
    id: 'prov-notice-validity',
    document: 'Illustrative traffic statute',
    section: 'Section entry · illustrative',
    ruleIdentifier: 'DEMO-NOTICE-001',
    violationType: 'Alleged notice validity and record-keeping',
    conditions: [
      'A notice must carry a legible notice number and issuing authority.',
      'Vehicle identification must match a registered record.',
      'Material ambiguity triggers manual legal review.',
    ],
    penalty: 'Illustrative entry — no penalty is asserted by this demo.',
    location: 'All covered road contexts (demo scope note)',
    origin: 'Demo legal knowledge fixture',
    timeframe: 'Fixture current as of the demo period',
    source: 'Illustrative legal provision',
    sourceNote: 'This section reference is interface data only.',
    isDemo: true,
  },
];

export const demoCitations: Citation[] = [
  {
    id: 'cite-provision',
    reference: 'Illustrative traffic statute · signal entry',
    source: 'Illustrative legal provision',
    note: 'Frames the comparison used in the 0417 demonstration.',
    targetType: 'provision',
    targetId: 'prov-signal',
    isDemo: true,
  },
  {
    id: 'cite-notice',
    reference: 'Notice DT-2026-4471 · submitted image',
    source: 'Applicant evidence',
    note: 'Primary source for the alleged time, location, and violation.',
    targetType: 'notice',
    targetId: 'MV-2026-0417',
    isDemo: true,
  },
  {
    id: 'cite-record',
    reference: 'Structured case record MV-2026-0417',
    source: 'Extraction output',
    note: 'Field-by-field structure produced during processing.',
    targetType: 'case',
    targetId: 'MV-2026-0417',
    isDemo: true,
  },
  {
    id: 'cite-record-0418',
    reference: 'Structured case record MV-2026-0418',
    source: 'Extraction output',
    note: 'Shows the missing fields retained by the demo.',
    targetType: 'case',
    targetId: 'MV-2026-0418',
    isDemo: true,
  },
  {
    id: 'cite-record-0419',
    reference: 'Structured case record MV-2026-0419',
    source: 'Extraction output',
    note: 'Shows the complete fields used in the demo comparison.',
    targetType: 'case',
    targetId: 'MV-2026-0419',
    isDemo: true,
  },
  {
    id: 'cite-record-0420',
    reference: 'Structured case record MV-2026-0420',
    source: 'Extraction output',
    note: 'Shows the conflicting context retained for manual review.',
    targetType: 'case',
    targetId: 'MV-2026-0420',
    isDemo: true,
  },
];

export const demoEvidence: Evidence[] = [
  {
    id: 'ev-photo',
    kind: 'image',
    title: 'Notice photograph',
    description: 'Photo of the printed notice submitted at the start of the case.',
    source: 'Uploaded by applicant',
    capturedAt: '2026-01-14T09:10:00+06:00',
    excerpt: 'DT-2026-4471 · Banani · 08:41 · signal non-compliance',
    isDemo: true,
  },
  {
    id: 'ev-registration',
    kind: 'document',
    title: 'Vehicle registration extract',
    description: 'Registration details used to match the vehicle on the notice.',
    source: 'Uploaded by applicant',
    capturedAt: '2026-01-14T09:11:00+06:00',
    excerpt: 'DHA-MET-4471 · private car · silver',
    isDemo: true,
  },
  {
    id: 'ev-url',
    kind: 'url',
    title: 'Portal reference',
    description: 'Link pasted alongside the notice for cross-checking.',
    source: 'Pasted URL',
    capturedAt: '2026-01-14T09:11:00+06:00',
    excerpt: 'https://example.invalid/notice/DT-2026-4471',
    isDemo: true,
  },
  {
    id: 'ev-location-note',
    kind: 'text',
    title: 'Applicant note',
    description: 'Statement provided by the applicant in plain text.',
    source: 'Typed by applicant',
    capturedAt: '2026-01-14T09:12:00+06:00',
    excerpt: 'The signal at that intersection was reportedly out of service.',
    isDemo: true,
  },
];

export const demoCases: Case[] = [
  {
    id: 'MV-2026-0417',
    reference: 'MV-2026-0417',
    title: 'Alleged signal non-compliance — Banani (demo)',
    createdAt: '2026-01-14T09:12:00+06:00',
    inputType: 'image',
    sourceLabel: 'notice-photo.jpg',
    notice: {
      noticeType: 'traffic',
      noticeNumber: 'DT-2026-4471',
      issuingAuthority: 'Metropolitan Traffic Division — demo issuer',
      issuedAt: '2026-01-14T08:41:00+06:00',
      location: 'Banani, Dhaka — intersection 4 (demo location)',
      violationDescription: 'Alleged crossing against a red signal',
      penaltyAmount: '৳500 (illustrative entry)',
      vehicle: {
        registrationNumber: 'DHA-MET-4471',
        type: 'Private car',
        make: 'Toyota',
        model: 'Axio',
        color: 'Silver',
      },
    },
    status: 'POTENTIALLY_NONCOMPLIANT',
    summary:
      'A notice image was submitted and structured. Comparison against illustrative provisions suggests a possible conflict that requires human confirmation.',
    isDemo: true,
  },
  {
    id: 'MV-2026-0418',
    reference: 'MV-2026-0418',
    title: 'Parking notice without readable details (demo)',
    createdAt: '2026-01-15T17:05:00+06:00',
    inputType: 'text',
    sourceLabel: 'pasted notice text',
    notice: {
      noticeType: 'traffic',
      noticeNumber: 'Not legible in submitted text',
      issuingAuthority: 'Not stated in submitted text',
      issuedAt: 'Not stated in submitted text',
      location: 'Not stated in submitted text',
      violationDescription: 'Alleged parking in a restricted zone',
      penaltyAmount: 'Not stated in submitted text',
      vehicle: {
        registrationNumber: 'Not stated in submitted text',
        type: 'Not stated in submitted text',
      },
    },
    status: 'INSUFFICIENT_INFORMATION',
    summary:
      'The pasted text does not carry a notice number, issuing authority, or location, so no comparison against provisions could be completed.',
    isDemo: true,
  },
  {
    id: 'MV-2026-0419',
    reference: 'MV-2026-0419',
    title: 'Illustrative speed notice with aligned details',
    createdAt: '2026-01-16T11:20:00+06:00',
    inputType: 'document',
    sourceLabel: 'speed-notice.pdf',
    notice: {
      noticeType: 'traffic',
      noticeNumber: 'DT-2026-4490',
      issuingAuthority: 'Metropolitan Traffic Division — demo issuer',
      issuedAt: '2026-01-16T10:05:00+06:00',
      location: 'Gulshan, Dhaka — road 12 (demo location)',
      violationDescription: 'Alleged speed above the posted limit',
      penaltyAmount: '৳1,500 (illustrative entry)',
      vehicle: {
        registrationNumber: 'DHA-MET-4490',
        type: 'Private car',
      },
    },
    status: 'CONFORMS',
    summary:
      'The visible notice details appear consistent with the illustrative conditions retained for comparison.',
    isDemo: true,
  },
  {
    id: 'MV-2026-0420',
    reference: 'MV-2026-0420',
    title: 'Complex lane-use notice requiring review',
    createdAt: '2026-01-17T13:40:00+06:00',
    inputType: 'image',
    sourceLabel: 'lane-notice.jpg',
    notice: {
      noticeType: 'traffic',
      noticeNumber: 'DT-2026-4502',
      issuingAuthority: 'Metropolitan Traffic Division — demo issuer',
      issuedAt: '2026-01-17T12:10:00+06:00',
      location: 'Airport Road — interchange (demo location)',
      violationDescription: 'Alleged lane-use violation with disputed signage',
      penaltyAmount: 'Not clear in submitted material',
      vehicle: {
        registrationNumber: 'DHA-MET-4502',
        type: 'Commercial vehicle',
      },
    },
    status: 'MANUAL_LEGAL_REVIEW',
    summary:
      'The notice includes conflicting visual details and context that this demonstration should not resolve automatically.',
    isDemo: true,
  },
];

const baseResult = {
  schemaVersion: 1 as const,
};

export const demoResults: VerificationResult[] = [
  {
    ...baseResult,
    id: 'RES-0417',
    caseId: 'MV-2026-0417',
    status: 'POTENTIALLY_NONCOMPLIANT',
    headline: 'Possible conflict with a cited provision — confirmation required',
    claim:
      'The notice alleges that the vehicle crossed an intersection against a red signal on 14 January 2026 at 08:41.',
    summary:
      'Submitted material and extracted fields were compared against illustrative retained provisions. The recorded details are internally consistent, but the central claim rests on a signal state that no submitted evidence corroborates.',
    reasoning: [
      'Notice number, timestamp, location, and vehicle registration were extracted with high confidence from the submitted image.',
      'The extracted violation type maps to an illustrative provision on signal non-compliance.',
      'No submitted evidence records the signal state at the stated time, so the allegation is neither confirmed nor dismissed.',
      'The classification therefore reports a potential conflict and routes the case toward human confirmation.',
    ],
    limitations: [
      'All provision fields in this demonstration are illustrative and must not be relied on as legal citations.',
      'No live legal database, government portal, or official record was consulted.',
      'Signal status, road conditions, and officer notes were not available as evidence.',
      'This output does not determine guilt and does not replace official appeals or legal advice.',
    ],
    comparison: [
      {
        label: 'Reported violation',
        noticeSays: 'Crossing against a red signal',
        lawSays: 'Signal state must be corroborated by evidence',
      },
      {
        label: 'Reported fine',
        noticeSays: '৳500 (illustrative entry)',
        lawSays: 'Illustrative penalty entry — compared, not asserted',
      },
      {
        label: 'Date & location',
        noticeSays: '14 Jan 2026 · Banani, intersection 4 · 08:41',
        lawSays: 'Specific intersection and timestamp are required',
      },
      {
        label: 'Supporting material',
        noticeSays: 'Notice photo; signal state not shown',
        lawSays: 'Signal-condition evidence is missing',
      },
    ],
    provisionIds: ['prov-signal', 'prov-notice-validity'],
    citationIds: ['cite-provision', 'cite-notice', 'cite-record'],
    evidenceIds: ['ev-photo', 'ev-registration', 'ev-url', 'ev-location-note'],
    generatedAt: '2026-01-14T09:20:00+06:00',
    confidence: 68,
    nextSteps: [
      {
        id: 'review-evidence',
        label: 'Review the missing signal evidence',
        description: 'Check whether a timestamped photo, video, or official record is available.',
        href: '#evidence',
        tone: 'attention',
        action: 'review-evidence',
      },
      {
        id: 'check-another',
        label: 'Check another notice',
        description: 'Start a fresh demonstration case with a different notice.',
        href: '/verify',
        action: 'start-over',
      },
      {
        id: 'legal-review',
        label: 'Consider legal review',
        description: 'A qualified professional can assess facts outside this demonstration.',
        href: '#limitations',
        tone: 'quiet',
        action: 'manual-review',
      },
    ],
  },
  {
    ...baseResult,
    id: 'RES-0418',
    caseId: 'MV-2026-0418',
    status: 'INSUFFICIENT_INFORMATION',
    headline: 'Not enough material to compare against provisions',
    claim: 'A parking notice was pasted as plain text, alleging a violation in a restricted zone.',
    summary:
      'The submitted text is missing the notice number, issuing authority, and location. Without these fields, no provision comparison can be performed safely.',
    reasoning: [
      'Required fields could not be extracted from the pasted text.',
      'Without a verifiable notice identity, no provision mapping can be attempted.',
      'The case is held as insufficient rather than guessed at.',
    ],
    limitations: [
      'No document image or portal link was provided to cross-check the claim.',
      'All provision fields in this demonstration are illustrative only.',
      'This output does not determine guilt and does not replace official appeals or legal advice.',
    ],
    comparison: [
      { label: 'Notice number', noticeSays: 'Not legible in submitted text', lawSays: 'Required before any comparison' },
      { label: 'Issuing authority', noticeSays: 'Not stated in submitted text', lawSays: 'Required before any comparison' },
      { label: 'Location', noticeSays: 'Not stated in submitted text', lawSays: 'Required before any comparison' },
    ],
    provisionIds: [],
    citationIds: ['cite-record-0418'],
    evidenceIds: ['ev-location-note'],
    generatedAt: '2026-01-15T17:12:00+06:00',
    confidence: 31,
    nextSteps: [
      {
        id: 'add-notice',
        label: 'Add the notice image or number',
        description: 'A readable notice number, authority, and location are needed to continue.',
        href: '/verify',
        tone: 'attention',
        action: 'add-information',
      },
      {
        id: 'check-another',
        label: 'Check another notice',
        description: 'Start a fresh demonstration case with clearer information.',
        href: '/verify',
        action: 'start-over',
      },
    ],
  },
  {
    ...baseResult,
    id: 'RES-0419',
    caseId: 'MV-2026-0419',
    status: 'CONFORMS',
    headline: 'The visible details align with the retained illustrative entry',
    claim: 'The notice reports a speed violation and a ৳1,500 illustrative fine at the stated location and time.',
    summary:
      'The reported fields appear internally consistent with the illustrative conditions retained for this demonstration.',
    reasoning: [
      'The notice number, timestamp, location, vehicle record, and reported fine are readable.',
      'The reported details are consistent with the illustrative comparison fixture.',
      'No conflict was found in the submitted fields; this does not establish the underlying event as true.',
    ],
    limitations: [
      'The provision and penalty are illustrative interface data only.',
      'No live legal database, government portal, or official record was consulted.',
      'A matching notice does not determine guilt or replace official review.',
    ],
    comparison: [
      { label: 'Reported violation', noticeSays: 'Speed above posted limit', lawSays: 'Illustrative speed condition retained' },
      { label: 'Reported fine', noticeSays: '৳1,500 (illustrative entry)', lawSays: 'Illustrative amount appears aligned' },
      { label: 'Notice identity', noticeSays: 'Number and authority readable', lawSays: 'Identity fields are present for review' },
    ],
    provisionIds: ['prov-notice-validity'],
    citationIds: ['cite-provision', 'cite-record-0419'],
    evidenceIds: ['ev-photo', 'ev-registration'],
    generatedAt: '2026-01-16T11:28:00+06:00',
    confidence: 84,
    nextSteps: [
      {
        id: 'review-official',
        label: 'Review the official notice source',
        description: 'Confirm the details against the relevant official record before paying.',
        href: '#evidence',
        action: 'review-source',
      },
      {
        id: 'check-another',
        label: 'Check another notice',
        description: 'Start a fresh demonstration case.',
        href: '/verify',
        action: 'start-over',
      },
    ],
  },
  {
    ...baseResult,
    id: 'RES-0420',
    caseId: 'MV-2026-0420',
    status: 'MANUAL_LEGAL_REVIEW',
    headline: 'The context is too complex for a safe automated comparison',
    claim: 'The notice alleges a lane-use violation near an interchange with disputed signage.',
    summary:
      'Conflicting visual details and missing context mean a qualified reviewer should assess the notice and road conditions together.',
    reasoning: [
      'The notice number and vehicle identity are readable, but the sign and lane markings are ambiguous.',
      'The retained illustrative conditions do not resolve which lane rule applied at the stated time.',
      'The system escalates instead of treating an uncertain interpretation as a legal finding.',
    ],
    limitations: [
      'A qualified legal professional should review the complete notice and road context.',
      'No live legal database, government portal, or official record was consulted.',
      'This output does not determine guilt or replace an official appeal process.',
    ],
    comparison: [
      { label: 'Road context', noticeSays: 'Interchange with disputed signage', lawSays: 'Context requires qualified interpretation' },
      { label: 'Lane marking', noticeSays: 'Visual detail is ambiguous', lawSays: 'Applicable condition cannot be established safely' },
      { label: 'Next decision', noticeSays: 'Automated result requested', lawSays: 'Manual legal review is required' },
    ],
    provisionIds: ['prov-notice-validity'],
    citationIds: ['cite-provision', 'cite-record-0420'],
    evidenceIds: ['ev-photo', 'ev-url'],
    generatedAt: '2026-01-17T13:52:00+06:00',
    confidence: 45,
    nextSteps: [
      {
        id: 'legal-review',
        label: 'Consider qualified legal review',
        description: 'Have the complete notice and surrounding facts assessed together.',
        href: '#limitations',
        tone: 'attention',
        action: 'manual-review',
      },
      {
        id: 'check-another',
        label: 'Check another notice',
        description: 'Start a separate demonstration case.',
        href: '/verify',
        action: 'start-over',
      },
    ],
  },
];

export const demoExtractedByCase: Record<string, ExtractedInformation> = {
  'MV-2026-0417': {
    overallConfidence: 89,
    sourceLabel: 'notice-photo.jpg',
    fields: [
      { key: 'noticeNumber', label: 'Notice number', value: 'DT-2026-4471', confidence: 96, evidenceIds: ['ev-photo'] },
      { key: 'issuingAuthority', label: 'Issuing authority', value: 'Metropolitan Traffic Division', confidence: 91, evidenceIds: ['ev-photo'] },
      { key: 'issuedAt', label: 'Issue date & time', value: '14 Jan 2026 · 08:41', confidence: 94, evidenceIds: ['ev-photo'] },
      { key: 'location', label: 'Location', value: 'Banani, Dhaka — intersection 4', confidence: 88, evidenceIds: ['ev-photo'] },
      { key: 'violation', label: 'Alleged violation', value: 'Signal non-compliance', confidence: 89, evidenceIds: ['ev-photo'] },
      { key: 'vehicleRegistration', label: 'Vehicle registration', value: 'DHA-MET-4471', confidence: 97, evidenceIds: ['ev-registration'] },
      { key: 'penaltyAmount', label: 'Penalty amount', value: '৳500 (illustrative)', confidence: 72, evidenceIds: ['ev-photo'] },
    ],
  },
  'MV-2026-0418': {
    overallConfidence: 31,
    sourceLabel: 'pasted notice text',
    fields: [
      { key: 'noticeNumber', label: 'Notice number', value: 'Not legible in submitted text', confidence: 18 },
      { key: 'issuingAuthority', label: 'Issuing authority', value: 'Not stated in submitted text', confidence: 18 },
      { key: 'location', label: 'Location', value: 'Not stated in submitted text', confidence: 16 },
      { key: 'violation', label: 'Alleged violation', value: 'Parking in a restricted zone', confidence: 74 },
    ],
  },
  'MV-2026-0419': {
    overallConfidence: 92,
    sourceLabel: 'speed-notice.pdf',
    fields: [
      { key: 'noticeNumber', label: 'Notice number', value: 'DT-2026-4490', confidence: 97 },
      { key: 'issuingAuthority', label: 'Issuing authority', value: 'Metropolitan Traffic Division', confidence: 94 },
      { key: 'issuedAt', label: 'Issue date & time', value: '16 Jan 2026 · 10:05', confidence: 93 },
      { key: 'location', label: 'Location', value: 'Gulshan, Dhaka — road 12', confidence: 91 },
      { key: 'violation', label: 'Alleged violation', value: 'Speed above the posted limit', confidence: 90 },
      { key: 'vehicleRegistration', label: 'Vehicle registration', value: 'DHA-MET-4490', confidence: 97 },
      { key: 'penaltyAmount', label: 'Penalty amount', value: '৳1,500 (illustrative)', confidence: 86 },
    ],
  },
  'MV-2026-0420': {
    overallConfidence: 64,
    sourceLabel: 'lane-notice.jpg',
    fields: [
      { key: 'noticeNumber', label: 'Notice number', value: 'DT-2026-4502', confidence: 91 },
      { key: 'issuingAuthority', label: 'Issuing authority', value: 'Metropolitan Traffic Division', confidence: 88 },
      { key: 'location', label: 'Location', value: 'Airport Road — interchange', confidence: 79 },
      { key: 'violation', label: 'Alleged violation', value: 'Lane-use violation with disputed signage', confidence: 61 },
      { key: 'vehicleRegistration', label: 'Vehicle registration', value: 'DHA-MET-4502', confidence: 93 },
    ],
  },
};

export const demoMessages: VerificationMessage[] = [
  {
    id: 'msg-1',
    author: 'system',
    content: 'Case MV-2026-0417 opened from a submitted notice image. Structured fields are ready for review.',
    sentAt: '2026-01-14T09:12:00+06:00',
    citationIds: ['cite-record'],
    evidenceIds: ['ev-photo'],
  },
  {
    id: 'msg-2',
    author: 'advisor',
    content: 'The notice records signal non-compliance at 08:41 near intersection 4. I retained illustrative conditions on signal compliance and notice validity for comparison.',
    sentAt: '2026-01-14T09:13:00+06:00',
    citationIds: ['cite-provision', 'cite-notice'],
    evidenceIds: ['ev-photo', 'ev-registration'],
  },
  {
    id: 'msg-3',
    author: 'applicant',
    content: 'The signal at that intersection was reportedly out of service that morning. I do not have a photo of it.',
    sentAt: '2026-01-14T09:15:00+06:00',
    evidenceIds: ['ev-location-note'],
  },
  {
    id: 'msg-4',
    author: 'advisor',
    content: 'That claim is recorded, but it is not supported by any submitted evidence. In this demonstration, unsupported claims are logged as gaps rather than treated as findings.',
    sentAt: '2026-01-14T09:16:00+06:00',
    citationIds: ['cite-provision'],
    evidenceIds: ['ev-url'],
  },
  {
    id: 'msg-5',
    author: 'system',
    content: 'Verification report prepared: potentially noncompliant (demo). Open the report to review the claim, evidence, law, and limitations side by side.',
    sentAt: '2026-01-14T09:20:00+06:00',
    citationIds: ['cite-record'],
  },
];
