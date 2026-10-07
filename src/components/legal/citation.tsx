import { Landmark } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Citation } from "@/types/legal";

interface CitationProps {
  citation: Citation;
  className?: string;
}

export function Citation({ citation, className }: CitationProps) {
  return (
    <figure
      className={cn(
        "rounded-lg border border-border bg-card px-3.5 py-3",
        className
      )}
    >
      <div className="flex items-start gap-2.5">
        <span
          aria-hidden="true"
          className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-brand-soft text-brand"
        >
          <Landmark className="size-3.5" />
        </span>
        <div className="min-w-0">
          <figcaption className="text-sm font-semibold text-ink">
            {citation.reference}
          </figcaption>
          <p className="type-small mt-0.5 text-ink-secondary">
            <span className="font-medium text-ink">{citation.source}</span>
            {" · "}
            {citation.note}
          </p>
        </div>
      </div>
      {citation.isDemo ? (
        <p className="mt-2 inline-flex rounded-md border border-border bg-canvas px-2 py-0.5 text-[11px] font-medium text-ink-muted">
          Demonstration citation
        </p>
      ) : null}
    </figure>
  );
}

interface CitationChipProps {
  citation: Citation;
  className?: string;
}

export function CitationChip({ citation, className }: CitationChipProps) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-md border border-border bg-canvas px-2 py-1 text-[11px] font-medium text-ink-secondary",
        className
      )}
    >
      <Landmark aria-hidden="true" className="size-3 shrink-0 text-brand" />
      <span className="truncate">{citation.reference}</span>
    </span>
  );
}
