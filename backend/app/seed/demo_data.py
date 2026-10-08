from sqlalchemy import insert
from sqlalchemy.orm import Session

from app.models import (
    CaseRecord,
    Citation,
    Evidence,
    LegalProvision,
    NextStep,
    NoticeFact,
    TrafficNotice,
    VerificationResult,
    case_evidence,
    result_citations,
    result_evidence,
    result_provisions,
)


DEMO_NOTICE = "Demonstration data. Not legal advice and not an official record."


def seed_demo_data(session: Session) -> None:
    if session.get(CaseRecord, "MV-2026-0417") is not None:
        return

    session.add_all(
        [
            LegalProvision(
                id="prov-signal",
                document="Illustrative traffic statute",
                section="Section entry - illustrative",
                rule_identifier="DEMO-SIGNAL-001",
                violation_type="Alleged signal non-compliance",
                conditions=["A specific intersection and timestamp are required.", "Signal state should be corroborated."],
                penalty="Illustrative entry - no penalty is asserted.",
                location="Demo scope only",
                origin="Demo legal knowledge fixture",
                timeframe="Demo period",
                source="Illustrative legal provision",
                source_note=DEMO_NOTICE,
                is_demo=True,
            ),
            LegalProvision(
                id="prov-notice-validity",
                document="Illustrative traffic statute",
                section="Section entry - illustrative",
                rule_identifier="DEMO-NOTICE-001",
                violation_type="Alleged notice validity",
                conditions=["A notice number and issuing authority should be readable.", "Material ambiguity triggers review."],
                penalty="Illustrative entry - no penalty is asserted.",
                location="Demo scope only",
                origin="Demo legal knowledge fixture",
                timeframe="Demo period",
                source="Illustrative legal provision",
                source_note=DEMO_NOTICE,
                is_demo=True,
            ),
        ]
    )
    session.add_all(
        [
            Evidence(id="ev-photo", kind="image", title="Notice photograph", description="Submitted notice image used by the demo workflow.", source="Uploaded by applicant", captured_at="2026-01-14T09:10:00+06:00", excerpt="DT-2026-4471 - Banani - signal allegation", is_demo=True),
            Evidence(id="ev-registration", kind="document", title="Vehicle registration extract", description="Applicant-provided registration material.", source="Uploaded by applicant", captured_at="2026-01-14T09:11:00+06:00", excerpt="DHA-MET-4471 - private car", is_demo=True),
            Evidence(id="ev-url", kind="url", title="Portal reference", description="A placeholder URL retained by the demo.", source="Pasted URL", captured_at="2026-01-14T09:11:00+06:00", excerpt="https://example.invalid/demo", is_demo=True),
            Evidence(id="ev-location-note", kind="text", title="Applicant note", description="Plain-text context supplied by the applicant.", source="Typed by applicant", captured_at="2026-01-14T09:12:00+06:00", excerpt="The signal was reportedly out of service.", is_demo=True),
        ]
    )
    session.add_all(
        [
            Citation(id="cite-provision", reference="Illustrative traffic statute - signal entry", source="Illustrative legal provision", note=DEMO_NOTICE, target_type="provision", target_id="prov-signal", is_demo=True),
            Citation(id="cite-notice", reference="Demo submitted notice", source="Applicant evidence", note="Primary demo source for reported fields.", target_type="notice", target_id="MV-2026-0417", is_demo=True),
            Citation(id="cite-record", reference="Structured demo case 0417", source="Extraction output", note="Demo extraction record.", target_type="case", target_id="MV-2026-0417", is_demo=True),
            Citation(id="cite-record-0418", reference="Structured demo case 0418", source="Extraction output", note="Demo missing-field record.", target_type="case", target_id="MV-2026-0418", is_demo=True),
            Citation(id="cite-record-0419", reference="Structured demo case 0419", source="Extraction output", note="Demo aligned-field record.", target_type="case", target_id="MV-2026-0419", is_demo=True),
            Citation(id="cite-record-0420", reference="Structured demo case 0420", source="Extraction output", note="Demo ambiguity record.", target_type="case", target_id="MV-2026-0420", is_demo=True),
        ]
    )
    session.flush()

    cases = [
        CaseRecord(id="MV-2026-0417", reference="MV-2026-0417", title="Alleged signal non-compliance - Banani (demo)", input_type="image", source_label="notice-photo.jpg", status="POTENTIALLY_NONCOMPLIANT", summary="Illustrative comparison suggests a possible conflict requiring human confirmation.", is_demo=True, version=1),
        CaseRecord(id="MV-2026-0418", reference="MV-2026-0418", title="Parking notice without readable details (demo)", input_type="text", source_label="pasted notice text", status="INSUFFICIENT_INFORMATION", summary="Required notice identity and location fields are missing from the demo text.", is_demo=True, version=1),
        CaseRecord(id="MV-2026-0419", reference="MV-2026-0419", title="Illustrative speed notice with aligned details", input_type="document", source_label="speed-notice.pdf", status="CONFORMS", summary="The retained demo fields show no conflict with the illustrative comparison.", is_demo=True, version=1),
        CaseRecord(id="MV-2026-0420", reference="MV-2026-0420", title="Complex lane-use notice requiring review", input_type="image", source_label="lane-notice.jpg", status="MANUAL_LEGAL_REVIEW", summary="Conflicting demo context should not be resolved automatically.", is_demo=True, version=1),
    ]
    session.add_all(cases)
    session.add_all(
        [
            TrafficNotice(case_id="MV-2026-0417", notice_number="DT-2026-4471", issuing_authority="Metropolitan Traffic Division - demo issuer", issued_at="2026-01-14T08:41:00+06:00", location="Banani, Dhaka - intersection 4 (demo)", violation_description="Alleged crossing against a red signal", penalty_amount="Illustrative amount", vehicle_registration_number="DHA-MET-4471", vehicle_type="Private car", vehicle_make="Toyota", vehicle_model="Axio", vehicle_color="Silver"),
            TrafficNotice(case_id="MV-2026-0418", notice_number="Not legible in submitted text", issuing_authority="Not stated in submitted text", issued_at="Not stated in submitted text", location="Not stated in submitted text", violation_description="Alleged parking in a restricted zone", penalty_amount=None, vehicle_registration_number="Not stated in submitted text", vehicle_type="Not stated in submitted text"),
            TrafficNotice(case_id="MV-2026-0419", notice_number="DT-2026-4490", issuing_authority="Metropolitan Traffic Division - demo issuer", issued_at="2026-01-16T10:05:00+06:00", location="Gulshan, Dhaka - road 12 (demo)", violation_description="Alleged speed above the posted limit", penalty_amount="Illustrative amount", vehicle_registration_number="DHA-MET-4490", vehicle_type="Private car"),
            TrafficNotice(case_id="MV-2026-0420", notice_number="DT-2026-4502", issuing_authority="Metropolitan Traffic Division - demo issuer", issued_at="2026-01-17T12:10:00+06:00", location="Airport Road - interchange (demo)", violation_description="Alleged lane-use violation with disputed signage", penalty_amount=None, vehicle_registration_number="DHA-MET-4502", vehicle_type="Commercial vehicle"),
        ]
    )
    session.add_all(_facts())
    session.add_all(_results())
    session.flush()

    session.execute(insert(case_evidence), [{"case_id": case_id, "evidence_id": evidence_id} for case_id, evidence_id in _case_evidence()])
    session.execute(insert(result_provisions), [{"result_id": result_id, "provision_id": provision_id} for result_id, provision_id in _result_provisions()])
    session.execute(insert(result_citations), [{"result_id": result_id, "citation_id": citation_id} for result_id, citation_id in _result_citations()])
    session.execute(insert(result_evidence), [{"result_id": result_id, "evidence_id": evidence_id} for result_id, evidence_id in _result_evidence()])
    session.add_all(_next_steps())


def _facts() -> list[NoticeFact]:
    return [
        NoticeFact(case_id="MV-2026-0417", key="noticeNumber", label="Notice number", extracted_value="DT-2026-4471", confirmed_value=None, confidence=96, evidence_ids=["ev-photo"]),
        NoticeFact(case_id="MV-2026-0417", key="issuingAuthority", label="Issuing authority", extracted_value="Metropolitan Traffic Division", confirmed_value=None, confidence=91, evidence_ids=["ev-photo"]),
        NoticeFact(case_id="MV-2026-0417", key="location", label="Location", extracted_value="Banani, Dhaka - intersection 4", confirmed_value=None, confidence=88, evidence_ids=["ev-photo"]),
        NoticeFact(case_id="MV-2026-0417", key="violation", label="Alleged violation", extracted_value="Signal non-compliance", confirmed_value=None, confidence=89, evidence_ids=["ev-photo"]),
        NoticeFact(case_id="MV-2026-0418", key="noticeNumber", label="Notice number", extracted_value="Not legible in submitted text", confirmed_value=None, confidence=18),
        NoticeFact(case_id="MV-2026-0418", key="issuingAuthority", label="Issuing authority", extracted_value="Not stated in submitted text", confirmed_value=None, confidence=18),
        NoticeFact(case_id="MV-2026-0418", key="location", label="Location", extracted_value="Not stated in submitted text", confirmed_value=None, confidence=16),
        NoticeFact(case_id="MV-2026-0419", key="noticeNumber", label="Notice number", extracted_value="DT-2026-4490", confirmed_value=None, confidence=97, evidence_ids=["ev-photo"]),
        NoticeFact(case_id="MV-2026-0419", key="location", label="Location", extracted_value="Gulshan, Dhaka - road 12", confirmed_value=None, confidence=91, evidence_ids=["ev-photo"]),
        NoticeFact(case_id="MV-2026-0420", key="noticeNumber", label="Notice number", extracted_value="DT-2026-4502", confirmed_value=None, confidence=91, evidence_ids=["ev-photo"]),
        NoticeFact(case_id="MV-2026-0420", key="violation", label="Alleged violation", extracted_value="Lane-use violation with disputed signage", confirmed_value=None, confidence=61, evidence_ids=["ev-photo"]),
    ]


def _results() -> list[VerificationResult]:
    common_limitations = [DEMO_NOTICE, "No live legal database, government portal, or official record was consulted."]
    return [
        VerificationResult(id="RES-0417", case_id="MV-2026-0417", schema_version=1, status="POTENTIALLY_NONCOMPLIANT", headline="Possible conflict with an illustrative provision", claim="The demo notice alleges signal non-compliance.", summary="The retained demo fields suggest a possible conflict, but the central event is not established.", reasoning=["Demo fields were retained from the frontend fixture.", "Signal state is not corroborated by submitted evidence."], limitations=common_limitations + ["This output does not determine guilt or replace legal advice."], comparison=[{"label": "Reported violation", "noticeSays": "Crossing against a red signal", "lawSays": "Signal state would need corroboration"}], confidence=68, generated_at="2026-01-14T09:20:00+06:00"),
        VerificationResult(id="RES-0418", case_id="MV-2026-0418", schema_version=1, status="INSUFFICIENT_INFORMATION", headline="Not enough material for a safe comparison", claim="The demo text describes a parking allegation.", summary="Notice identity, issuing authority, and location are missing.", reasoning=["Required identity fields were not retained.", "The workflow stops rather than guessing."], limitations=common_limitations, comparison=[{"label": "Notice identity", "noticeSays": "Missing or not legible", "lawSays": "Required before comparison"}], confidence=31, generated_at="2026-01-15T17:12:00+06:00"),
        VerificationResult(id="RES-0419", case_id="MV-2026-0419", schema_version=1, status="CONFORMS", headline="No conflict found in the illustrative comparison", claim="The demo notice reports a speed allegation.", summary="The retained demo fields appear internally aligned with the illustrative fixture only.", reasoning=["Notice identity and location fields are present in the demo fixture.", "A matching fixture does not establish the underlying event."], limitations=common_limitations, comparison=[{"label": "Reported violation", "noticeSays": "Speed above posted limit", "lawSays": "Illustrative condition appears aligned"}], confidence=84, generated_at="2026-01-16T11:28:00+06:00"),
        VerificationResult(id="RES-0420", case_id="MV-2026-0420", schema_version=1, status="MANUAL_LEGAL_REVIEW", headline="The demo context requires qualified review", claim="The demo notice alleges a lane-use violation with disputed signage.", summary="Conflicting context should not be resolved by this deterministic backend.", reasoning=["The lane and sign context is ambiguous.", "The workflow escalates rather than making a legal finding."], limitations=common_limitations + ["A qualified professional should review the complete notice and road context."], comparison=[{"label": "Road context", "noticeSays": "Disputed signage near an interchange", "lawSays": "Qualified interpretation is required"}], confidence=45, generated_at="2026-01-17T13:52:00+06:00"),
    ]


def _next_steps() -> list[NextStep]:
    return [
        NextStep(id="review-evidence", result_id="RES-0417", label="Review supporting evidence", description="Check whether additional timestamped material is available.", href="#evidence", tone="attention", action="review-evidence"),
        NextStep(id="add-information", result_id="RES-0418", label="Add the missing notice details", description="A readable notice number, authority, and location are needed.", href="/verify", tone="attention", action="add-information"),
        NextStep(id="review-source", result_id="RES-0419", label="Review the official source", description="Confirm the demo fields against an official source.", href="#evidence", action="review-source"),
        NextStep(id="manual-review", result_id="RES-0420", label="Consider qualified legal review", description="Have the complete notice and road context assessed together.", href="#limitations", tone="attention", action="manual-review"),
    ]


def _case_evidence() -> list[tuple[str, str]]:
    return [(case_id, evidence_id) for case_id in ("MV-2026-0417", "MV-2026-0418", "MV-2026-0419", "MV-2026-0420") for evidence_id in ("ev-photo", "ev-registration", "ev-url", "ev-location-note")]


def _result_provisions() -> list[tuple[str, str]]:
    return [(result_id, "prov-signal" if result_id == "RES-0417" else "prov-notice-validity") for result_id in ("RES-0417", "RES-0419", "RES-0420")]


def _result_citations() -> list[tuple[str, str]]:
    return [("RES-0417", value) for value in ("cite-provision", "cite-notice", "cite-record")] + [("RES-0418", "cite-record-0418"), ("RES-0419", "cite-provision"), ("RES-0420", "cite-provision")]


def _result_evidence() -> list[tuple[str, str]]:
    return [(result_id, evidence_id) for result_id in ("RES-0417", "RES-0418", "RES-0419", "RES-0420") for evidence_id in ("ev-photo", "ev-registration")]
