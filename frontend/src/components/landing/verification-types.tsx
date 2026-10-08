import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { VERIFICATION_TYPES } from "@/lib/constants";

export function VerificationTypes() {
  return (
    <section
      id="what-we-verify"
      className="border-b border-border bg-canvas scroll-mt-20"
    >
      <Container className="grid items-start gap-12 py-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:py-24">
        <SectionHeading
          eyebrow="What we verify"
          title="Bring the notice in whatever form you have it"
          description="You do not need an account. Start with a photo, a document, a link, or a description and we will show you the facts before asking you to verify them."
        />

        <ul className="grid gap-4 sm:grid-cols-2">
          {VERIFICATION_TYPES.map((type) => {
            const Icon = type.icon;

            return (
              <li
                key={type.title}
                className="rounded-xl border border-border bg-card p-6"
              >
                <span
                  aria-hidden="true"
                  className="inline-flex size-10 items-center justify-center rounded-lg bg-gold-soft text-ink"
                >
                  <Icon className="size-5" />
                </span>
                <p className="type-caption mt-4 text-brand">{type.title}</p>
                <h3 className="type-h3 mt-4 text-ink">
                  {type.title === "Images" || type.title === "Documents"
                    ? "Upload a notice"
                    : type.title === "URLs"
                      ? "Paste a link"
                      : "Describe it"}
                </h3>
                <p className="type-small mt-1.5 text-ink-secondary">
                  {type.description}
                </p>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
