import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  ClipboardCheck,
  FileSearch,
  Scale,
} from "lucide-react";

import { Citation } from "@/components/legal/citation";
import { AskAboutCase } from "@/components/legal/ask-about-case";
import { LegalProvisionCard } from "@/components/legal/legal-provision-card";
import { NextSteps } from "@/components/legal/next-steps";
import { VerificationStatusBadge, VerificationStatusPanel } from "@/components/legal/verification-status";
import { EvidenceSection } from "@/components/evidence/evidence-section";
import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Case } from "@/types/case";
import type { ResolvedVerificationResult } from "@/types/verification";

const REPORT_STEPS = [
  { label: "Claim", icon: ClipboardCheck },
  { label: "Evidence", icon: FileSearch },
  { label: "Law", icon: Scale },
  { label: "Result", icon: BookOpenCheck },
];

interface AdvisoryReportProps {
  caseRecord: Case;
  result: ResolvedVerificationResult;
}

export function AdvisoryReport({ caseRecord, result }: AdvisoryReportProps) {
  return (
    <div className="min-h-dvh bg-canvas">
      <header className="border-b border-border bg-card">
        <Container className="flex h-16 items-center justify-between gap-4">
          <Link href="/" aria-label="Mamla Verification home" className="rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
            <Logo />
          </Link>
          <Link
            href="/verify"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
          >
            <ArrowLeft aria-hidden="true" />
            <span className="hidden sm:inline">Back to workspace</span>
            <span className="sm:hidden">Workspace</span>
          </Link>
        </Container>
      </header>

      <main>
        <Container className="flex max-w-5xl flex-col gap-8 py-8 sm:py-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="type-caption text-brand">Advisory report · demonstration</p>
              <h1 className="type-h1 mt-2 text-ink">Verification result</h1>
              <p className="type-small mt-2 text-ink-secondary">
                Case {caseRecord.reference} · prepared {result.generatedAt.slice(0, 16).replace("T", " · ")}
              </p>
            </div>
            <VerificationStatusBadge status={result.status} size="md" />
          </div>

          <section aria-label="Primary verification result">
            <VerificationStatusPanel
              status={result.status}
              headline={result.headline}
              className="p-6 sm:p-7"
            />
            <p className="mt-3 text-sm text-ink-secondary">
              Based on the submitted information and the illustrative provision retained for this demonstration. Confidence indicator: <span className="font-semibold text-ink">{result.confidence}%</span>.
            </p>
          </section>

          <nav aria-label="Report structure" className="rounded-xl border border-border bg-card p-3 sm:p-4">
            <ol className="grid grid-cols-4 gap-2">
              {REPORT_STEPS.map((step, index) => {
                const Icon = step.icon;

                return (
                  <li key={step.label} className="flex items-center gap-2 sm:gap-3">
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                      <Icon aria-hidden="true" className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[10px] font-medium text-ink-muted sm:text-xs">
                        0{index + 1}
                      </span>
                      <span className="block truncate text-xs font-semibold text-ink sm:text-sm">
                        {step.label}
                      </span>
                    </span>
                    {index < REPORT_STEPS.length - 1 ? (
                      <span aria-hidden="true" className="ml-auto hidden text-ink-muted sm:block">→</span>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </nav>

          <section id="claim" className="scroll-mt-24">
            <Card className="gap-0 overflow-hidden">
              <CardHeader className="border-b border-border bg-card px-5 py-5 sm:px-7">
                <p className="type-caption text-brand">01 · Claim</p>
                <h2 className="type-h3 mt-1 text-ink">What the notice alleges</h2>
              </CardHeader>
              <CardContent className="grid gap-6 px-5 py-5 sm:grid-cols-[1.2fr_0.8fr] sm:px-7 sm:py-6">
                <div>
                  <p className="text-base leading-relaxed font-medium text-ink">
                    {result.claim}
                  </p>
                  <p className="type-small mt-3 text-ink-secondary">
                    {result.summary}
                  </p>
                </div>
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    ["Notice number", caseRecord.notice.noticeNumber],
                    ["Issued by", caseRecord.notice.issuingAuthority],
                    ["Date & time", caseRecord.notice.issuedAt.slice(0, 16).replace("T", " · ")],
                    ["Location", caseRecord.notice.location],
                    ["Vehicle", caseRecord.notice.vehicle.registrationNumber],
                    ["Alleged violation", caseRecord.notice.violationDescription],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg border border-border bg-canvas p-3">
                      <dt className="text-[11px] font-medium text-ink-muted">{label}</dt>
                      <dd className="mt-1 text-xs font-semibold text-ink">{value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </section>

          <section id="evidence" className="scroll-mt-24">
            <div className="mb-4">
              <p className="type-caption text-brand">02 · Evidence</p>
              <h2 className="type-h2 mt-1 text-ink">What was available to review</h2>
              <p className="type-small mt-2 text-ink-secondary">
                Evidence is shown as submitted or extracted, with its source clearly identified.
              </p>
            </div>
            {result.evidence.length > 0 ? (
              <EvidenceSection evidence={result.evidence} />
            ) : (
              <p className="rounded-xl border border-border bg-card p-5 text-sm text-ink-secondary">
                No evidence was attached to this demonstration result.
              </p>
            )}
          </section>

          <section id="law" className="scroll-mt-24">
            <div className="mb-4">
              <p className="type-caption text-brand">03 · Law</p>
              <h2 className="type-h2 mt-1 text-ink">Provisions retained for comparison</h2>
              <p className="type-small mt-2 text-ink-secondary">
                These entries are illustrative interface data, not authoritative legal citations.
              </p>
            </div>
            {result.provisions.length > 0 ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {result.provisions.map((provision) => (
                  <LegalProvisionCard key={provision.id} provision={provision} />
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-border bg-card p-5 text-sm text-ink-secondary">
                No provision could be safely retained from the available details.
              </p>
            )}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {result.citations.map((citation) => (
                <Citation key={citation.id} citation={citation} />
              ))}
            </div>
          </section>

          <section id="result" className="flex flex-col gap-5 scroll-mt-24">
            <div>
              <p className="type-caption text-brand">04 · Result</p>
              <h2 className="type-h2 mt-1 text-ink">What the comparison found</h2>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <Card>
                <CardHeader className="px-5 pt-5 sm:px-6">
                  <h3 className="type-h3 text-ink">Reasoning</h3>
                </CardHeader>
                <CardContent className="px-5 pb-5 sm:px-6">
                  <ol className="flex flex-col gap-3">
                    {result.reasoning.map((item, index) => (
                      <li key={item} className="flex gap-3">
                        <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-brand">
                          {index + 1}
                        </span>
                        <p className="type-small pt-0.5 text-ink-secondary">{item}</p>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              <Card id="limitations" className="border-status-review-border bg-status-review-bg">
                <CardHeader className="px-5 pt-5 sm:px-6">
                  <h3 className="type-h3 text-ink">Limitations</h3>
                </CardHeader>
                <CardContent className="px-5 pb-5 sm:px-6">
                  <ul className="flex flex-col gap-3">
                    {result.limitations.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-status-review" />
                        <p className="type-small text-ink-secondary">{item}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <AskAboutCase />
            <NextSteps steps={result.nextSteps} />

            <div className="flex flex-col gap-4 rounded-xl border border-brand/15 bg-brand-soft/60 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <p className="text-sm font-semibold text-ink">Need another look?</p>
                <p className="type-small mt-1 text-ink-secondary">
                  Return to the investigation workspace to review the conversation and evidence.
                </p>
              </div>
              <Link
                href="/verify"
                className={cn(buttonVariants({ size: "lg" }), "shrink-0 gap-2")}
              >
                Back to workspace
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </section>

          <p className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-ink-muted">
            Demonstration report only. Mamla Verification does not determine guilt, replace legal advice, or replace official appeals. Please consult a qualified professional or the relevant authority for real cases.
          </p>
        </Container>
      </main>
    </div>
  );
}
