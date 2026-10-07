import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdvisoryReport } from "@/components/legal/advisory-report";
import {
  getCaseById,
  getResolvedResultByCaseId,
} from "@/data/mock-data";

export const metadata: Metadata = {
  title: "Verification result",
  description:
    "Review the claim, evidence, illustrative provisions, reasoning, and limitations in a demonstration verification report.",
};

interface ResultPageProps {
  params: Promise<{ id: string }>;
}

export default function ResultPage({ params }: ResultPageProps) {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-dvh place-items-center bg-canvas px-5">
          <p role="status" className="text-sm text-ink-secondary">
            Loading demonstration report…
          </p>
        </main>
      }
    >
      <ResultContent params={params} />
    </Suspense>
  );
}

async function ResultContent({ params }: ResultPageProps) {
  const { id } = await params;
  const caseRecord = getCaseById(id);
  const result = getResolvedResultByCaseId(id);

  if (!caseRecord || !result) notFound();

  return <AdvisoryReport caseRecord={caseRecord} result={result} />;
}
