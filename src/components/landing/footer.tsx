import Link from "next/link";

import { LogoMark } from "@/components/shared/logo";
import { Container } from "@/components/shared/container";
import { BRAND, NAV_LINKS } from "@/lib/constants";

const FOOTER_LINKS = [
  ...NAV_LINKS,
  { label: "Verify a Notice", href: "/verify" },
] as const;

export function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.7fr_1fr]">
        <div className="flex flex-col gap-4">
          <span className="inline-flex items-center gap-2.5">
            <LogoMark className="bg-white/10 text-gold" />
            <span className="text-[15px] leading-none font-semibold tracking-tight text-white">
              Mamla <span className="text-gold-soft">Verification</span>
            </span>
          </span>
          <p className="type-small max-w-sm text-white/65">{BRAND.tagline}</p>
          <p className="type-small max-w-sm text-white/45">
            Frontend demonstration · AI-assisted legal verification experience.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-3">
          <p className="type-caption text-gold-soft">Explore</p>
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="type-small w-fit rounded-md text-white/70 outline-none transition-colors hover:text-white focus-visible:ring-3 focus-visible:ring-gold/60"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          <p className="type-caption text-gold-soft">Disclaimer</p>
          <p className="type-small text-white/65">
            Mamla Verification does not determine guilt, does not replace legal
            advice, and does not replace official appeals or legal review. It
            may request manual legal review when information is insufficient.
          </p>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="type-small text-white/55">
            © 2026 Mamla Verification. Demonstration project.
          </p>
          <p className="type-small text-white/45">
            {BRAND.name} · built with Next.js
          </p>
        </Container>
      </div>
    </footer>
  );
}
