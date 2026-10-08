import { ShieldAlert } from "lucide-react";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { DISCLAIMER_POINTS } from "@/lib/constants";

export function Disclaimer() {
  return (
    <section id="about" className="border-b border-border bg-canvas scroll-mt-20">
      <Container className="grid items-start gap-12 py-16 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:py-24">
        <div className="flex flex-col gap-5">
          <SectionHeading
            eyebrow="About"
            title="Verification, not verdicts"
            description="Mamla Verification exists to make the shape of a notice understandable before money changes hands. It explains what a notice claims, which provisions were consulted, and where the available information stops."
          />
          <p className="type-body max-w-xl text-ink-secondary">
            The system is deliberately conservative: when the material is thin
            or ambiguous, it says so instead of guessing, and it hands the case
            back to a qualified human reviewer.
          </p>
        </div>

        <div className="rounded-2xl border border-gold/40 bg-gold-soft/40 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="inline-flex size-10 items-center justify-center rounded-lg bg-card text-brand ring-1 ring-brand/15"
            >
              <ShieldAlert className="size-5" />
            </span>
            <h3 className="type-h3 text-ink">Legal disclaimer</h3>
          </div>

          <ul className="mt-6 flex flex-col gap-4">
            {DISCLAIMER_POINTS.map((point) => (
              <li key={point} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-gold"
                />
                <span className="type-small text-ink">{point}</span>
              </li>
            ))}
          </ul>

          <p className="type-small mt-6 border-t border-gold/30 pt-4 text-ink-secondary">
            All content shown in this build is demonstration data created for
            interface purposes.
          </p>
        </div>
      </Container>
    </section>
  );
}
