import Link from "next/link";
import { ArrowRight, CircleDot, Play } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";

const NOTICE_FIELDS = [
  { label: "Alleged violation", value: "Signal non-compliance" },
  { label: "Location", value: "Banani — intersection 4" },
  { label: "Notice date", value: "14 Jan 2026 · 08:41" },
];

const RESULT_CHAIN = ["Claim", "Evidence", "Law", "Result"];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-canvas">
      <div
        aria-hidden="true"
        className="hairline-grid absolute inset-0 opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent_90%)]"
      />

      <Container className="relative grid items-center gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24">
        <div className="flex flex-col items-start gap-6">
          <Badge
            variant="outline"
            className="h-7 gap-2 border-brand/20 bg-brand-soft px-3 text-brand"
          >
            <CircleDot aria-hidden="true" className="size-3.5 text-gold" />
            AI-assisted legal verification
          </Badge>

          <h1 className="type-display max-w-xl text-ink">
            Verify Before You Pay.
            <span className="block text-brand">
              Know What the Law Says.
            </span>
          </h1>

          <p className="type-body max-w-xl text-ink-secondary">
            Submit a traffic notice and the evidence around it. Mamla
            Verification structures the details, compares them against cited
            legal provisions, and returns a transparent report that shows its
            reasoning, its sources, and its limits.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/verify"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 px-6 text-[15px]"
              )}
            >
              Start Verification
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link
              href="/#how-it-works"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 gap-2 border-border bg-transparent px-6 text-[15px] text-ink"
              )}
            >
              <Play aria-hidden="true" className="size-3.5" />
              See How It Works
            </Link>
          </div>

          <p className="type-small text-ink-muted">
            Demonstration experience · no verdicts, no official records, no
            legal advice.
          </p>
        </div>

        <div className="relative">
          <div className="surface-raised relative rounded-2xl ring-1 ring-foreground/10">
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="size-2.5 rounded-full bg-brand"
                />
                <span className="text-sm font-semibold text-ink">
                  Notice DT-2026-4471
                </span>
              </div>
              <Badge
                variant="outline"
                className="border-status-alert-border bg-status-alert-bg text-status-alert"
              >
                Potentially noncompliant
              </Badge>
            </div>

            <dl className="divide-y divide-border px-5">
              {NOTICE_FIELDS.map((field) => (
                <div
                  key={field.label}
                  className="flex items-baseline justify-between gap-4 py-3.5"
                >
                  <dt className="text-sm text-ink-secondary">{field.label}</dt>
                  <dd className="text-right text-sm font-medium text-ink">
                    {field.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="border-t border-border bg-canvas px-5 py-4">
              <p className="type-caption text-ink-muted">
                Applicable provision
              </p>
              <p className="mt-1.5 text-sm font-semibold text-ink">
                Road Transport Act, 2018
              </p>
              <p className="type-small text-ink-secondary">
                Section entry · illustrative · demo record
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 border-t border-border px-5 py-4">
              {RESULT_CHAIN.map((step, index) => (
                <span key={step} className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs font-medium",
                      index === RESULT_CHAIN.length - 1
                        ? "border-brand bg-brand text-primary-foreground"
                        : "border-border bg-canvas text-ink-secondary"
                    )}
                  >
                    {step}
                  </span>
                  {index < RESULT_CHAIN.length - 1 ? (
                    <span aria-hidden="true" className="text-ink-muted">
                      →
                    </span>
                  ) : null}
                </span>
              ))}
            </div>
          </div>

          <div className="absolute -right-3 -bottom-5 hidden rounded-xl border border-gold/40 bg-gold-soft px-4 py-3 shadow-lg sm:block">
            <p className="text-xs font-semibold text-ink">3 evidence items</p>
            <p className="text-xs text-ink-secondary">attached to this case</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
