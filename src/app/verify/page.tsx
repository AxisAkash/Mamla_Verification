import type { Metadata } from "next";

import { VerificationShell } from "@/components/verification/verification-shell";

export const metadata: Metadata = {
  title: "Verification workspace",
  description:
    "Submit a traffic notice and review a demonstration legal verification workflow.",
};

export default function VerifyPage() {
  return <VerificationShell />;
}
