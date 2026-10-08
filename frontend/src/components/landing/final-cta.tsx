import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { Container } from "@/components/shared/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FinalCta() {
  return (
    <section className="border-b border-white/10 bg-brand-dark text-white">
      <Container className="flex flex-col gap-7 py-16 sm:flex-row sm:items-center sm:justify-between lg:py-20">
        <div className="max-w-2xl">
          <p className="type-caption text-gold-soft">Start with clarity</p>
          <h2 className="type-h2 mt-3 text-white">Have a notice you’re unsure about?</h2>
          <p className="type-body mt-3 text-white/70">Verify it before you pay. See the claim, the evidence, the law, and the next careful step.</p>
        </div>
        <Link
          href="/verify"
          className={cn(buttonVariants({ size: "lg" }), "h-11 shrink-0 gap-2 bg-white px-6 text-brand hover:bg-gold-soft")}
        >
          <ShieldCheck aria-hidden="true" />
          Start a Verification
          <ArrowRight aria-hidden="true" />
        </Link>
      </Container>
    </section>
  );
}
