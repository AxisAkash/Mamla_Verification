import { ArrowRight, FileSearch, Scale } from "lucide-react";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const COMPARISON_ROWS = [
  ["Reported violation", "Speed above the posted limit", "Speed-limit condition retained"],
  ["Reported fine", "৳1,500", "Illustrative penalty entry"],
  ["Date / conditions", "14 Aug 2026 · Banani", "Location and timestamp required"],
  ["Supporting material", "Notice photograph", "Evidence must support the claim"],
];

export function NoticeVsLaw() {
  return (
    <section id="notice-vs-law" className="scroll-mt-20 border-b border-border bg-canvas">
      <Container className="flex flex-col gap-10 py-16 lg:py-24">
        <SectionHeading
          eyebrow="How we check"
          title="Don’t just get an answer. See why."
          description="The core comparison stays visible: what the notice says on one side, and what the retained legal conditions require on the other."
        />

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_18px_48px_-32px_rgba(7,91,69,0.35)]">
          <div className="grid border-b border-border lg:grid-cols-2">
            <div className="flex items-center gap-3 bg-ink px-5 py-5 text-white sm:px-7">
              <span className="inline-flex size-9 items-center justify-center rounded-lg bg-white/10 text-gold-soft">
                <FileSearch aria-hidden="true" className="size-4.5" />
              </span>
              <div>
                <p className="type-caption text-gold-soft">Notice</p>
                <p className="mt-1 text-base font-semibold">What the notice says</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-brand px-5 py-5 text-white sm:px-7">
              <span className="inline-flex size-9 items-center justify-center rounded-lg bg-white/10 text-gold-soft">
                <Scale aria-hidden="true" className="size-4.5" />
              </span>
              <div>
                <p className="type-caption text-gold-soft">Law</p>
                <p className="mt-1 text-base font-semibold">What the retained rule requires</p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-border">
            {COMPARISON_ROWS.map(([label, notice, law]) => (
              <div key={label} className="grid lg:grid-cols-[10rem_1fr_1fr]">
                <div className="bg-canvas px-5 py-4 text-sm font-semibold text-ink sm:px-7">
                  {label}
                </div>
                <div className="border-t border-border px-5 py-4 text-sm leading-relaxed text-ink-secondary sm:px-7 lg:border-t-0 lg:border-l">
                  {notice}
                </div>
                <div className="border-t border-border bg-brand-wash px-5 py-4 text-sm leading-relaxed text-ink sm:px-7 lg:border-t-0 lg:border-l">
                  {law}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 border-t border-border bg-gold-soft/45 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <Badge variant="outline" className="border-gold/50 bg-card text-status-review">
                Demonstration result
              </Badge>
              <p className="mt-2 text-base font-semibold text-ink">
                The reported fine appears consistent with the cited entry, but the underlying claim still needs evidence.
              </p>
            </div>
            <ArrowRight aria-hidden="true" className="hidden shrink-0 text-status-review sm:block" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["1", "Claim", "What is being alleged?"],
            ["2", "Proof", "What material supports it?"],
            ["3", "Rule", "What conditions does the law require?"],
          ].map(([number, title, description]) => (
            <div key={title} className="flex items-start gap-3 rounded-xl border border-border bg-card p-5">
              <span className={cn("inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white")}>{number}</span>
              <div>
                <p className="font-semibold text-ink">{title}</p>
                <p className="type-small mt-1 text-ink-secondary">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
