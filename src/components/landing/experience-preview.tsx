import Link from "next/link";
import { ArrowUpRight, FileText, ImageIcon, Link2, Send } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";

const PREVIEW_MESSAGES = [
  {
    author: "System",
    body: "Case MV-2026-0417 opened from a submitted notice image. Structured fields are ready for review.",
    tone: "muted" as const,
  },
  {
    author: "Verification advisor",
    body: "The notice records signal non-compliance at 08:41. One illustrative provision was retained for comparison; no submitted evidence corroborates the signal state.",
    tone: "active" as const,
  },
];

const PREVIEW_EVIDENCE = [
  { icon: ImageIcon, label: "Notice photograph", meta: "Image · 1 page" },
  { icon: FileText, label: "Registration extract", meta: "Document · demo" },
  { icon: Link2, label: "Portal reference", meta: "URL · example.invalid" },
];

export function ExperiencePreview() {
  return (
    <section className="border-b border-border bg-background">
      <Container className="py-16 lg:py-24">
        <div className="rounded-2xl bg-brand-dark p-6 sm:p-10 lg:p-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              tone="on-dark"
              eyebrow="Verification experience"
              title="An investigation workspace, not a chat window"
              description="The conversation sits beside the evidence, the citations, and the provisions it refers to — so every statement stays traceable."
            />
            <Link
              href="/verify"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 shrink-0 bg-gold px-6 text-[15px] text-ink hover:bg-gold/90"
              )}
            >
              Open the workspace
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-10 overflow-hidden rounded-xl bg-card shadow-[0_32px_64px_-32px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
            <div className="flex items-center justify-between gap-3 border-b border-border bg-canvas px-4 py-3">
              <div aria-hidden="true" className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-border" />
                <span className="size-2.5 rounded-full bg-border" />
                <span className="size-2.5 rounded-full bg-border" />
              </div>
              <p className="text-xs font-semibold text-ink-secondary">
                Verification workspace · demo
              </p>
              <span className="hidden rounded-full border border-brand/20 bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-brand sm:inline-flex">
                Case MV-2026-0417
              </span>
            </div>

            <div className="grid lg:grid-cols-[1.45fr_1fr]">
              <div className="flex flex-col gap-4 p-5 sm:p-6">
                <p className="type-caption text-ink-muted">
                  Verification conversation
                </p>

                {PREVIEW_MESSAGES.map((message) => (
                  <div
                    key={message.author}
                    className={cn(
                      "rounded-xl border p-4",
                      message.tone === "active"
                        ? "border-brand/20 bg-brand-soft/60"
                        : "border-border bg-canvas"
                    )}
                  >
                    <p className="text-xs font-semibold text-brand">
                      {message.author}
                    </p>
                    <p className="type-small mt-1.5 text-ink">
                      {message.body}
                    </p>
                    {message.tone === "active" ? (
                      <p className="mt-3 inline-flex rounded-md border border-border bg-card px-2 py-1 text-[11px] font-medium text-ink-secondary">
                        Cited · Road Transport Act, 2018 (illustrative)
                      </p>
                    ) : null}
                  </div>
                ))}

                <div className="mt-auto flex items-center gap-2 rounded-lg border border-border bg-canvas px-3 py-2.5">
                  <p className="type-small flex-1 text-ink-muted">
                    Ask about this notice…
                  </p>
                  <span
                    aria-hidden="true"
                    className="inline-flex size-7 items-center justify-center rounded-md bg-brand text-primary-foreground"
                  >
                    <Send className="size-3.5" />
                  </span>
                </div>
              </div>

              <div className="border-t border-border p-5 sm:p-6 lg:border-t-0 lg:border-l">
                <p className="type-caption text-ink-muted">Evidence & source</p>
                <ul className="mt-4 flex flex-col gap-3">
                  {PREVIEW_EVIDENCE.map((item) => {
                    const Icon = item.icon;

                    return (
                      <li
                        key={item.label}
                        className="flex items-center gap-3 rounded-lg border border-border bg-canvas p-3"
                      >
                        <span
                          aria-hidden="true"
                          className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-gold-soft text-ink"
                        >
                          <Icon className="size-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-ink">
                            {item.label}
                          </span>
                          <span className="block text-xs text-ink-secondary">
                            {item.meta}
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-4 rounded-lg border border-status-review-border bg-status-review-bg p-3">
                  <p className="text-xs font-semibold text-status-review">
                    Manual review available
                  </p>
                  <p className="mt-1 text-xs text-ink-secondary">
                    Escalation is offered whenever information is thin.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="type-small mt-4 text-white/55">
            Illustrative preview rendered from demonstration data.
          </p>
        </div>
      </Container>
    </section>
  );
}
