import { ArrowRight, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { demoExtracted } from "@/data/mock-data";

interface ExtractedInformationPanelProps {
  onContinue: () => void;
  onRestart: () => void;
}

export function ExtractedInformationPanel({
  onContinue,
  onRestart,
}: ExtractedInformationPanelProps) {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(16rem,0.7fr)] lg:gap-10 lg:py-14">
      <Card className="surface-raised gap-0 rounded-2xl">
        <CardHeader className="gap-2 border-b border-border px-5 py-5 sm:px-7 sm:py-7">
          <p className="type-caption text-brand">Extraction review · demo</p>
          <h1 className="type-h2 text-ink">Extracted case information</h1>
          <p className="type-small text-ink-secondary">
            Review the structured fields before moving into the verification conversation.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-border bg-canvas px-3 py-1 text-xs font-medium text-ink-secondary">
              Source · {demoExtracted.sourceLabel}
            </span>
            <span className="rounded-full border border-brand/20 bg-brand-soft px-3 py-1 text-xs font-medium text-brand">
              {demoExtracted.overallConfidence}% field confidence
            </span>
          </div>
        </CardHeader>

        <CardContent className="grid gap-3 px-5 py-5 sm:grid-cols-2 sm:px-7 sm:py-7">
          {demoExtracted.fields.map((field) => (
            <div
              key={field.label}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-medium text-ink-secondary">
                  {field.label}
                </p>
                {field.confidence !== undefined ? (
                  <span className="text-[11px] tabular-nums text-ink-muted">
                    {field.confidence}%
                  </span>
                ) : null}
              </div>
              <p className="mt-1.5 text-sm font-semibold text-ink">
                {field.value}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <aside className="flex flex-col gap-4">
        <div className="rounded-xl border border-status-review-border bg-status-review-bg p-5">
          <p className="text-sm font-semibold text-status-review">
            Extraction is not verification
          </p>
          <p className="type-small mt-2 text-ink-secondary">
            These are fields read from mock material. The next step compares the
            claim with supporting evidence and illustrative law.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="type-caption text-ink-muted">Next step</p>
          <h2 className="type-h3 mt-2 text-ink">Review evidence and reasoning</h2>
          <p className="type-small mt-2 text-ink-secondary">
            Open the case conversation to see what is supported, what is missing,
            and which sources are referenced.
          </p>
          <Button onClick={onContinue} className="mt-5 h-10 w-full gap-2">
            Continue to verification
            <ArrowRight aria-hidden="true" />
          </Button>
          <Button
            onClick={onRestart}
            variant="ghost"
            className="mt-2 w-full gap-2 text-ink-secondary"
          >
            <RotateCcw aria-hidden="true" />
            Start over
          </Button>
        </div>
      </aside>
    </div>
  );
}
