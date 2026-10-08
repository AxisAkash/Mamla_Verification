import { Check, LoaderCircle, LockKeyhole } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { PROCESSING_STEPS } from "@/lib/constants";

interface ProcessingStateProps {
  step: number;
}

export function ProcessingState({ step }: ProcessingStateProps) {
  const progress = Math.min(
    100,
    Math.round((step / PROCESSING_STEPS.length) * 100)
  );

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-5 py-14 sm:px-8">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-9">
        <div className="flex items-start gap-4">
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
            <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
          </span>
          <div>
            <p className="type-caption text-brand">Step 03 · Analyze</p>
            <h1 className="type-h2 mt-1 text-ink">Reading your notice</h1>
            <p className="type-small mt-2 text-ink-secondary">
              Following the same visible steps a future connected verification
              service could perform. No OCR, model, or external service is active.
            </p>
          </div>
        </div>

        <Progress value={progress} className="mt-8 gap-2">
          <span className="text-xs font-medium text-ink-secondary">
            {step >= PROCESSING_STEPS.length ? "Ready for review" : "Working through the evidence"}
          </span>
          <span className="ml-auto text-xs tabular-nums text-ink-muted">
            {progress}%
          </span>
        </Progress>

        <ol className="mt-7 flex flex-col gap-3">
          {PROCESSING_STEPS.map((item, index) => {
            const complete = index < step;
            const active = index === step && step < PROCESSING_STEPS.length;

            return (
              <li
                key={item}
                className="flex items-center gap-3 rounded-lg border border-border bg-canvas px-4 py-3"
                aria-current={active ? "step" : undefined}
              >
                <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-card ring-1 ring-border">
                  {complete ? (
                    <Check aria-hidden="true" className="size-3.5 text-status-conforms" />
                  ) : active ? (
                    <LoaderCircle aria-hidden="true" className="size-3.5 animate-spin text-brand" />
                  ) : (
                    <span className="size-1.5 rounded-full bg-ink-muted" />
                  )}
                </span>
                <span
                  className={
                    complete || active
                      ? "text-sm font-medium text-ink"
                      : "text-sm text-ink-muted"
                  }
                >
                  {item}
                </span>
              </li>
            );
          })}
        </ol>

        <p className="mt-6 flex items-center gap-2 text-xs text-ink-muted">
          <LockKeyhole aria-hidden="true" className="size-3.5" />
          This demonstration does not send your input anywhere.
        </p>
      </div>
    </div>
  );
}
