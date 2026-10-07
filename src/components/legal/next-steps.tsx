import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";
import type { NextStep } from "@/types/verification";

export function NextSteps({ steps }: { steps: NextStep[] }) {
  return (
    <section id="next-steps" className="scroll-mt-24 rounded-xl border border-border bg-card p-5 sm:p-6">
      <div>
        <p className="type-caption text-brand">Next steps</p>
        <h3 className="mt-1 text-lg font-semibold text-ink">Keep the decision in your hands</h3>
        <p className="type-small mt-1 text-ink-secondary">
          These are informational actions, not legal instructions.
        </p>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {steps.map((step) => (
          <Link
            key={step.id}
            href={step.href ?? "#next-steps"}
            className={cn(
              "focus-ring group rounded-lg border p-4 transition-colors",
              step.tone === "attention"
                ? "border-status-review-border bg-status-review-bg hover:border-status-review"
                : step.tone === "quiet"
                  ? "border-border bg-canvas hover:border-brand/30"
                  : "border-brand/20 bg-brand-wash hover:border-brand/50"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <CheckCircle2 aria-hidden="true" className="size-5 text-brand" />
              <ArrowUpRight aria-hidden="true" className="size-4 text-ink-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
            <p className="mt-5 text-sm font-semibold text-ink">{step.label}</p>
            <p className="type-small mt-1.5 text-ink-secondary">{step.description}</p>
          </Link>
        ))}
      </div>
      <p className="mt-5 text-sm text-ink-secondary">
        <Link href="#law" className="font-semibold text-brand underline underline-offset-4">
          View the legal comparison
        </Link>
        {" or "}
        <Link href="/verify" className="font-semibold text-brand underline underline-offset-4">
          check another notice
        </Link>
        .
      </p>
    </section>
  );
}
