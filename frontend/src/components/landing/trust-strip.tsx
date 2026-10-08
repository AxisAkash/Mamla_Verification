import { Container } from "@/components/shared/container";
import { TRUST_POINTS } from "@/lib/constants";

export function TrustStrip() {
  return (
    <section aria-label="Trust principles" className="bg-brand-dark">
      <Container>
        <ul className="grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-2 sm:divide-x lg:grid-cols-4 lg:divide-y-0">
          {TRUST_POINTS.map((point) => {
            const Icon = point.icon;

            return (
              <li
                key={point.title}
                className="flex items-start gap-3.5 px-0 py-6 sm:px-6 lg:first:pl-0 lg:last:pr-0"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-gold"
                >
                  <Icon className="size-4.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">
                    {point.title}
                  </p>
                  <p className="type-small mt-0.5 text-white/65">
                    {point.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
