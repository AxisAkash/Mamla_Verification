import { FileText, ImageIcon, Link2, ScrollText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Evidence, EvidenceKind } from "@/types/legal";

const PREVIEW_ICONS: Record<EvidenceKind, typeof FileText> = {
  image: ImageIcon,
  document: FileText,
  url: Link2,
  text: ScrollText,
};

const PREVIEW_LABEL: Record<EvidenceKind, string> = {
  image: "Image evidence",
  document: "Document evidence",
  url: "URL evidence",
  text: "Text evidence",
};

interface EvidencePreviewProps {
  evidence: Evidence;
  className?: string;
}

export function EvidencePreview({ evidence, className }: EvidencePreviewProps) {
  const Icon = PREVIEW_ICONS[evidence.kind];

  return (
    <figure className={cn("flex flex-col gap-3", className)}>
      <div className="hairline-grid flex min-h-36 flex-col items-center justify-center gap-2 rounded-lg border border-border bg-canvas p-5 text-center">
        <span
          aria-hidden="true"
          className="inline-flex size-11 items-center justify-center rounded-lg bg-card text-brand ring-1 ring-brand/15"
        >
          <Icon className="size-5" />
        </span>
        <p className="type-caption text-ink-muted">
          {PREVIEW_LABEL[evidence.kind]}
        </p>
        <p className="type-small max-w-xs text-ink-secondary">
          {evidence.title}
        </p>
      </div>

      {evidence.excerpt ? (
        <blockquote className="rounded-lg border border-border bg-card p-3.5 text-sm leading-relaxed text-ink">
          “{evidence.excerpt}”
        </blockquote>
      ) : null}

      <dl className="divide-y divide-border rounded-lg border border-border bg-card px-3.5">
        <div className="flex items-baseline justify-between gap-3 py-2.5">
          <dt className="text-xs text-ink-secondary">Source</dt>
          <dd className="text-right text-xs font-medium text-ink">
            {evidence.source}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3 py-2.5">
          <dt className="text-xs text-ink-secondary">Captured</dt>
          <dd className="text-right text-xs font-medium text-ink">
            {evidence.capturedAt.replace("T", " ").replace("+06:00", "")}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3 py-2.5">
          <dt className="text-xs text-ink-secondary">Type</dt>
          <dd className="text-right text-xs font-medium capitalize text-ink">
            {evidence.kind}
          </dd>
        </div>
      </dl>

      <p className="type-small text-ink-secondary">{evidence.description}</p>

      {evidence.isDemo ? (
        <Badge variant="outline" className="w-fit text-ink-muted">
          Demonstration evidence
        </Badge>
      ) : null}
    </figure>
  );
}
