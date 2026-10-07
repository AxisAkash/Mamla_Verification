import type { LucideIcon } from "lucide-react";
import {
  AlignLeft,
  Camera,
  FileCheck2,
  FileSearch,
  FileText,
  Image as ImageIcon,
  Link2,
  Scale,
  ScanText,
  ShieldCheck,
  Signpost,
  Upload,
  UserCheck,
} from "lucide-react";

import type {
  VerificationInputType,
  VerificationStatus,
} from "@/types/verification";

export const BRAND = {
  name: "Mamla Verification",
  tagline: "Verify Before You Pay. Know What the Law Says.",
  description:
    "An AI-assisted legal verification workspace for traffic notices and the evidence behind them.",
} as const;

export const NAV_LINKS = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "What We Verify", href: "/#what-we-verify" },
  { label: "About", href: "/#about" },
] as const;

export interface InputMode {
  value: VerificationInputType;
  label: string;
  hint: string;
  icon: LucideIcon;
}

export const INPUT_MODES: InputMode[] = [
  {
    value: "image",
    label: "Image / Document",
    hint: "Upload a photo or PDF of the notice.",
    icon: Camera,
  },
  {
    value: "url",
    label: "URL",
    hint: "Paste a link to an online notice or portal entry.",
    icon: Link2,
  },
  {
    value: "text",
    label: "Plain Text",
    hint: "Paste or write the notice text directly.",
    icon: AlignLeft,
  },
];

export const TRUST_POINTS = [
  {
    icon: FileCheck2,
    title: "Evidence-based",
    description: "Every observation traces back to submitted material.",
  },
  {
    icon: Scale,
    title: "Law-grounded",
    description: "Reasoning is tied to cited legal provisions.",
  },
  {
    icon: ScanText,
    title: "Transparent reasoning",
    description: "Assumptions, gaps, and limits stay visible.",
  },
  {
    icon: UserCheck,
    title: "Human review when needed",
    description: "Cases can be escalated for manual legal review.",
  },
] as const;

export const PIPELINE_STEPS = [
  {
    step: "01",
    title: "Submit",
    description:
      "Upload the notice, paste a link, or write the text you were given.",
    icon: Upload,
  },
  {
    step: "02",
    title: "Extract",
    description:
      "Key notice details are structured into a reviewable case record.",
    icon: FileSearch,
  },
  {
    step: "03",
    title: "Verify",
    description:
      "The claim is compared against cited legal provisions and evidence.",
    icon: ShieldCheck,
  },
  {
    step: "04",
    title: "Understand",
    description:
      "You receive a clear report of findings, reasoning, and limitations.",
    icon: Signpost,
  },
] as const;

export const VERIFICATION_TYPES = [
  {
    icon: ImageIcon,
    title: "Images",
    description: "Photographs of printed or handwritten notices and challans.",
  },
  {
    icon: FileText,
    title: "Documents",
    description: "PDFs and scans including official correspondence.",
  },
  {
    icon: Link2,
    title: "URLs",
    description: "Links to online notices, portals, or published records.",
  },
  {
    icon: AlignLeft,
    title: "Plain Text",
    description: "Typed or copied notice text pasted directly into the workspace.",
  },
] as const;

export const DISCLAIMER_POINTS = [
  "The system does not determine guilt or innocence.",
  "The output is not legal advice and does not replace an advocate.",
  "It does not replace official appeals, hearings, or legal review.",
  "When information is insufficient, manual legal review is requested.",
] as const;

export interface StatusMeta {
  label: string;
  shortLabel: string;
  description: string;
  badgeClassName: string;
  panelClassName: string;
  dotClassName: string;
}

export const STATUS_META: Record<VerificationStatus, StatusMeta> = {
  CONFORMS_TO_RETAINED_LEGAL_PROVISIONS: {
    label: "Conforms to Retained Legal Provisions",
    shortLabel: "Conforms",
    description:
      "No conflict was found between the submitted material and the provisions consulted during this demonstration run.",
    badgeClassName:
      "border-status-conforms-border bg-status-conforms-bg text-status-conforms",
    panelClassName:
      "border-status-conforms-border bg-status-conforms-bg text-status-conforms",
    dotClassName: "bg-status-conforms",
  },
  POTENTIALLY_NONCOMPLIANT: {
    label: "Potentially Noncompliant",
    shortLabel: "Potentially Noncompliant",
    description:
      "The submitted material suggests a possible conflict with a cited provision. Confirmation requires human legal review.",
    badgeClassName:
      "border-status-alert-border bg-status-alert-bg text-status-alert",
    panelClassName:
      "border-status-alert-border bg-status-alert-bg text-status-alert",
    dotClassName: "bg-status-alert",
  },
  INSUFFICIENT_INFORMATION: {
    label: "Insufficient Information",
    shortLabel: "Insufficient Information",
    description:
      "Available material is not enough to support a conclusion. Additional evidence or source text is required.",
    badgeClassName:
      "border-status-neutral-border bg-status-neutral-bg text-status-neutral",
    panelClassName:
      "border-status-neutral-border bg-status-neutral-bg text-status-neutral",
    dotClassName: "bg-status-neutral",
  },
  MANUAL_LEGAL_REVIEW_NEEDED: {
    label: "Manual Legal Review Needed",
    shortLabel: "Manual Review",
    description:
      "The case is outside the safe scope of automated verification and should be reviewed by a qualified legal professional.",
    badgeClassName:
      "border-status-review-border bg-status-review-bg text-status-review",
    panelClassName:
      "border-status-review-border bg-status-review-bg text-status-review",
    dotClassName: "bg-status-review",
  },
};

export const PROCESSING_STEPS = [
  "Reading the submitted material",
  "Structuring notice fields",
  "Locating cited legal provisions",
  "Preparing the verification conversation",
] as const;

export const DEMO_NOTICE_PLACEHOLDER =
  "e.g. Notice No. DT-2026-4471 issued on 14 January 2026 at Banani, Dhaka for signal non-compliance.";
