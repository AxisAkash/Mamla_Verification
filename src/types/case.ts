import type { VerificationInputType, VerificationStatus } from "./verification";

export interface VehicleInformation {
  registrationNumber: string;
  type: string;
  make?: string;
  model?: string;
  color?: string;
}

export interface TrafficNotice {
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
  inputType: VerificationInputType;
  sourceLabel: string;
  notice: TrafficNotice;
  status: VerificationStatus;
  summary: string;
  isDemo: boolean;
}
