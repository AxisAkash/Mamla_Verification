import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { PIPELINE_STEPS } from "@/lib/constants";

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-b border-border bg-background scroll-mt-20"
    >
      <Container className="flex flex-col gap-12 py-16 lg:py-24">
        <SectionHeading
          eyebrow="How it works"
          title="From submitted notice to explained result"
          description="Four deliberate stages keep every step of the verification visible and reviewable."
        />

        <ol className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <span aria-hidden="true" className="absolute top-11 right-[12.5%] left-[12.5%] hidden h-px bg-border lg:block" />
          {PIPELINE_STEPS.map((stage) => {
            const Icon = stage.icon;

            return (
              <li
                key={stage.step}
                className="relative rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-[0_12px_32px_-16px_rgba(7,91,69,0.25)]"
              >
                <div className="flex items-center justify-between">
                  <span className="type-caption text-gold">{stage.step}</span>
                  <span
                    aria-hidden="true"
                    className="inline-flex size-9 items-center justify-center rounded-lg bg-brand-soft text-brand"
                  >
                    <Icon className="size-4.5" />
                  </span>
                </div>
                <h3 className="type-h3 mt-5 text-ink">{stage.title}</h3>
                <p className="type-small mt-2 text-ink-secondary">
                  {stage.description}
                </p>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
