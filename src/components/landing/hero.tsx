import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Camera,
  Check,
  FileSearch,
  MapPin,
  Scale,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";

const NOTICE_FIELDS = [
  { icon: CalendarDays, label: "Date", value: "14 Aug 2026 · 08:41" },
  { icon: MapPin, label: "Location", value: "Banani, Dhaka" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-canvas">
      <div
        aria-hidden="true"
        className="hairline-grid absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_88%)]"
      />

      <Container className="relative grid items-center gap-14 py-14 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-24">
        <div className="flex flex-col items-start gap-6">
          <Badge
            variant="outline"
            className="h-7 gap-2 border-brand/20 bg-brand-soft px-3 text-brand"
          >
            <span aria-hidden="true" className="size-1.5 rounded-full bg-gold" />
            Evidence-backed verification
          </Badge>

          <h1 className="type-display max-w-xl text-ink">
            Verify Before You Pay.
            <span className="block text-brand">Know What the Law Says.</span>
          </h1>

          <p className="type-body max-w-xl text-ink-secondary">
            Upload a traffic notice, paste a link, or describe the notice.
            Mamla Verification checks the reported violation and fine against
            relevant traffic regulations, then shows the evidence behind the result.
          </p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/verify"
              className={cn(buttonVariants({ size: "lg" }), "h-11 px-6 text-[15px]")}
            >
              Start a Verification
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link
              href="/#how-it-works"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 justify-center border-border bg-transparent px-6 text-[15px] text-ink"
              )}
            >
              See How It Works
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-secondary">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck aria-hidden="true" className="size-4 text-brand" />
              No account required
            </span>
            <span aria-hidden="true" className="hidden size-1 rounded-full bg-border sm:block" />
            <span>AI-assisted, informational only</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[620px] lg:mx-0 lg:justify-self-end">
          <div className="relative rounded-[1.5rem] bg-brand-dark p-4 shadow-[0_28px_80px_-36px_rgba(4,60,48,0.75)] sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3 px-1 text-white/70">
              <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                Case preview
              </p>
              <span className="rounded-full border border-white/15 px-2.5 py-1 text-[11px]">
                Illustrative data
              </span>
            </div>

            <div className="relative rounded-xl bg-canvas p-4 sm:p-5">
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                      <FileSearch aria-hidden="true" className="size-4.5" />
                    </span>
                    <div>
                      <p className="type-caption text-ink-muted">Traffic notice</p>
                      <h2 className="mt-1 text-base font-semibold text-ink">
                        Alleged speed violation
                      </h2>
                    </div>
                  </div>
                  <span className="text-right text-xs font-semibold text-ink-muted">
                    MV-2026-0417
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-border bg-canvas p-3">
                    <p className="text-xs text-ink-secondary">Reported fine</p>
                    <p className="mt-1 text-lg font-semibold text-ink">৳1,500</p>
                  </div>
                  <div className="rounded-lg border border-border bg-canvas p-3">
                    <p className="text-xs text-ink-secondary">Notice source</p>
                    <p className="mt-1 text-sm font-semibold text-ink">Notice-photo.jpg</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {NOTICE_FIELDS.map((field) => {
                    const Icon = field.icon;
                    return (
                      <div key={field.label} className="flex items-center gap-2 text-xs text-ink-secondary">
                        <Icon aria-hidden="true" className="size-3.5 text-brand" />
                        <span>{field.label}:</span>
                        <span className="font-medium text-ink">{field.value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-center py-3 text-brand-dark">
                <ArrowDown aria-hidden="true" className="size-5" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex size-8 items-center justify-center rounded-lg bg-gold-soft text-ink">
                      <Camera aria-hidden="true" className="size-4" />
                    </span>
                    <p className="text-sm font-semibold text-ink">Evidence</p>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
                    Notice photo, vehicle record, and applicant note attached.
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-brand">
                    <Check aria-hidden="true" className="size-3.5" />
                    3 sources linked
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex size-8 items-center justify-center rounded-lg bg-brand-soft text-brand">
                      <Scale aria-hidden="true" className="size-4" />
                    </span>
                    <p className="text-sm font-semibold text-ink">Applicable law</p>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
                    Road Transport Act, 2018 · illustrative provision retained.
                  </p>
                  <div className="mt-3 text-xs font-semibold text-brand">
                    Conditions compared
                  </div>
                </div>
              </div>

              <div className="mt-3 rounded-xl border border-status-alert-border bg-status-alert-bg p-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-card text-status-alert">
                    <ShieldCheck aria-hidden="true" className="size-4" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-status-alert">
                      Result
                    </p>
                    <p className="mt-1 text-sm font-semibold text-ink">
                      The notice may not match the applicable rule.
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-secondary">
                      The signal condition is not corroborated by the submitted evidence.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
