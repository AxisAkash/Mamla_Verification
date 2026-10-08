import Link from "next/link";

import { Container } from "@/components/shared/container";
import { LogoMark } from "@/components/shared/logo";
import { BRAND, NAV_LINKS } from "@/lib/constants";

const PRODUCT_LINKS = [
  ...NAV_LINKS,
  { label: "Start a Verification", href: "/verify" },
] as const;

const INFORMATION_LINKS = [
  { label: "Laws & comparison", href: "/#notice-vs-law" },
  { label: "Privacy", href: "/#trust" },
  { label: "Terms", href: "/#about" },
  { label: "Disclaimer", href: "/#about" },
] as const;

export function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      <Container className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
        <div className="flex flex-col gap-4">
          <span className="inline-flex items-center gap-2.5">
            <LogoMark className="bg-white/10 text-gold" />
            <span className="text-[15px] leading-none font-semibold tracking-tight text-white">
              Mamla <span className="text-gold-soft">Verification</span>
            </span>
          </span>
          <p className="type-small max-w-sm text-white/70">{BRAND.tagline}</p>
          <p className="type-small max-w-sm text-white/50">
            A frontend demonstration for evidence-backed, plain-language legal verification.
          </p>
        </div>

        <nav aria-label="Product links" className="flex flex-col gap-3">
          <p className="type-caption text-gold-soft">Product</p>
          {PRODUCT_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring type-small w-fit rounded-md text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <nav aria-label="Information links" className="flex flex-col gap-3">
          <p className="type-caption text-gold-soft">Information</p>
          {INFORMATION_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="focus-ring type-small w-fit rounded-md text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          <p className="type-caption text-gold-soft">Important</p>
          <p className="type-small text-white/65">
            Mamla Verification does not determine guilt, replace legal advice, or replace official appeals or legal review. It may request manual review when information is insufficient.
          </p>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="type-small text-white/55">© 2026 Mamla Verification. Demonstration project.</p>
          <p className="type-small text-white/45">Frontend only · mock data · no official determination</p>
        </Container>
      </div>
    </footer>
  );
}
