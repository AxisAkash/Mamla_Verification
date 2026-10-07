import type { VerificationInputType, VerificationStatus } from "./verification";

/**
 * Category of notice the system can intake. Currently traffic-only; the union
 * is an extension point for future notice categories.
 */
export type NoticeType = "traffic";

export interface VehicleInformation {
  registrationNumber: string;
  type: string;
  make?: string;
  model?: string;
  color?: string;
}

export interface TrafficNotice {
  noticeType: NoticeType;
  noticeNumber: string;
  issuingAuthority: string;
  issuedAt: string;
  location: string;
  violationDescription: string;
  penaltyAmount?: string;
  vehicle: VehicleInformation;
}

export interface Case {
  id: string;
  reference: string;
  title: string;
  createdAt: string;
  updatedAt?: string;
  inputType: VerificationInputType;
  sourceLabel: string;
  notice: TrafficNotice;
  status: VerificationStatus;
  summary: string;
  isDemo: boolean;
}
