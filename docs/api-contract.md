# Future API contract

This contract is a frontend integration seam only. No endpoint is implemented
in this repository, and every current record remains illustrative mock data.

## Conventions

- JSON over HTTPS under a versioned prefix such as /api/v1.
- IDs are opaque strings. Timestamps are ISO 8601 strings.
- status is one of CONFORMS, POTENTIALLY_NONCOMPLIANT,
  INSUFFICIENT_INFORMATION, or MANUAL_LEGAL_REVIEW.
- Legal provisions must carry document, section, ruleIdentifier,
  violationType, conditions, penalty, location, origin, and timeframe.
- Responses must preserve the Claim → Evidence → Law → Result links through
  IDs. Real legal authority and the disclaimer must be supplied by the future
  service, not inferred by the frontend.

## Cases

### Create a case

POST /api/v1/cases

Request body:

~~~ts
{
  inputType: 'image',
  sourceLabel: 'notice-photo.jpg'
}
~~~

Response 201 returns a Case envelope:

~~~ts
{
  case: {
    id: 'MV-2026-0417',
    reference: 'MV-2026-0417',
    title: 'Alleged signal non-compliance',
    createdAt: '2026-01-14T09:12:00+06:00',
    inputType: 'image',
    sourceLabel: 'notice-photo.jpg',
    status: 'INSUFFICIENT_INFORMATION',
    isDemo: false
  }
}
~~~

### Get a case

GET /api/v1/cases/{caseId}

Response 200 returns the case, its TrafficNotice, and current workflow
status. Missing cases return 404.

## Notice extraction

### Extract notice facts

POST /api/v1/cases/{caseId}/notice-extraction

The request carries the submitted input reference. The response returns:

~~~ts
{
  caseId: 'MV-2026-0417',
  sourceLabel: 'notice-photo.jpg',
  overallConfidence: 89,
  fields: [
    {
      key: 'noticeNumber',
      label: 'Notice number',
      value: 'DT-2026-4471',
      confidence: 96,
      evidenceIds: ['ev-photo'],
      isUserConfirmed: false
    }
  ]
}
~~~

No OCR or extraction implementation belongs in the current frontend.

## Fact confirmation

### Update confirmed facts

PATCH /api/v1/cases/{caseId}/facts

Request body:

~~~ts
{
  facts: [
    {
      key: 'location',
      label: 'Location',
      value: 'Banani, Dhaka',
      isUserConfirmed: true
    }
  ]
}
~~~

Response 200 returns the normalized NoticeFact array and the updated case
version. The server must retain user-confirmed values separately from
machine-extracted values.

## Verification

### Verify a case

POST /api/v1/cases/{caseId}/verification

Response 200 returns a VerificationResult envelope:

~~~ts
{
  result: {
    schemaVersion: 1,
    id: 'RES-0417',
    caseId: 'MV-2026-0417',
    status: 'POTENTIALLY_NONCOMPLIANT',
    headline: 'Possible conflict with a cited provision',
    claim: '...',
    summary: '...',
    reasoning: ['...'],
    limitations: ['...'],
    comparison: [
      {
        label: 'Reported violation',
        noticeSays: '...',
        lawSays: '...'
      }
    ],
    provisionIds: ['prov-signal'],
    citationIds: ['cite-provision'],
    evidenceIds: ['ev-photo'],
    generatedAt: '2026-01-14T09:20:00+06:00',
    confidence: 68,
    nextSteps: []
  }
}
~~~

The result is advisory and must include limitations. CONFORMS means only
that the retained comparison found no conflict; it is not a finding about
guilt, authenticity, or legal liability.

## Evidence

### Get evidence for a case

GET /api/v1/cases/{caseId}/evidence

Response 200:

~~~ts
{
  caseId: 'MV-2026-0417',
  items: [
    {
      id: 'ev-photo',
      kind: 'image',
      title: 'Notice photograph',
      description: '...',
      source: 'Uploaded by applicant',
      capturedAt: '2026-01-14T09:10:00+06:00',
      excerpt: '...',
      isDemo: false
    }
  ]
}
~~~

The service should return only evidence linked to the requested case and
should expose provenance without implying that a source is official.
