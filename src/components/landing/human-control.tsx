import { Check, Edit3, FileSearch, ShieldCheck } from "lucide-react";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";

const CONTROL_STEPS = [
  { label: "Extracted facts", detail: "The notice is turned into readable fields.", icon: FileSearch },
  { label: "You review", detail: "You can correct a date, place, fine, or violation.", icon: Edit3 },
  { label: "You confirm", detail: "Only confirmed facts move into the comparison.", icon: Check },
  { label: "Legal verification", detail: "The result is explained against retained conditions.", icon: ShieldCheck },
];

export function HumanControl() {
  return (
    <section className="border-b border-border bg-canvas">
      <Container className="grid items-center gap-12 py-16 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20 lg:py-24">
        <SectionHeading
          eyebrow="You stay in control"
          title="The system does not silently decide what your notice says."
          description="Before legal verification, extracted facts are shown as editable fields. You confirm the record, then decide whether to continue."
        />

        <ol className="relative grid gap-3 sm:grid-cols-2">
          <span aria-hidden="true" className="absolute top-10 right-10 bottom-10 left-10 hidden border-l border-dashed border-brand/30 sm:block" />
          {CONTROL_STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.label} className="relative rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex size-9 items-center justify-center rounded-lg bg-brand-soft text-brand">
                    <Icon aria-hidden="true" className="size-4.5" />
                  </span>
                  <span className="text-xs font-semibold tabular-nums text-ink-muted">0{index + 1}</span>
                </div>
                <p className="mt-5 text-base font-semibold text-ink">{step.label}</p>
                <p className="type-small mt-1.5 text-ink-secondary">{step.detail}</p>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
