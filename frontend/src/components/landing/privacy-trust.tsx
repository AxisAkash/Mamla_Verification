import { Eye, FileCheck2, LockKeyhole, UserRoundCheck } from "lucide-react";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";

const TRUST_POINTS = [
  { icon: UserRoundCheck, title: "No account required", description: "Start with a notice. There is no profile or payment wall in this experience." },
  { icon: FileCheck2, title: "Evidence-backed", description: "Claims, citations, and limitations stay connected to the case record." },
  { icon: Eye, title: "Transparent results", description: "Plain-language explanations show what was compared and what was missing." },
  { icon: LockKeyhole, title: "Privacy-conscious", description: "This frontend demo keeps inputs local and does not call external services." },
];

export function PrivacyTrust() {
  return (
    <section id="trust" className="scroll-mt-20 border-b border-border bg-background">
      <Container className="flex flex-col gap-10 py-16 lg:py-24">
        <SectionHeading
          eyebrow="Built for trust"
          title="Calm technology for a high-stakes question"
          description="Mamla Verification is designed to inform, not intimidate. It is AI-assisted and informational only, with uncertainty kept visible."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_POINTS.map((point) => {
            const Icon = point.icon;
            return (
              <div key={point.title} className="border-l-2 border-brand/20 px-5 py-2">
                <Icon aria-hidden="true" className="size-5 text-brand" />
                <h3 className="mt-4 text-base font-semibold text-ink">{point.title}</h3>
                <p className="type-small mt-1.5 text-ink-secondary">{point.description}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
