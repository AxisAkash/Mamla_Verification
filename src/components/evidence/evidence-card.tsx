import type { LucideIcon } from "lucide-react";
import { FileText, ImageIcon, Link2, ScrollText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Evidence, EvidenceKind } from "@/types/legal";

export const EVIDENCE_ICONS: Record<EvidenceKind, LucideIcon> = {
  image: ImageIcon,
  document: FileText,
  url: Link2,
  text: ScrollText,
};

interface EvidenceCardProps {
  evidence: Evidence;
  onInspect?: (evidence: Evidence) => void;
  active?: boolean;
  className?: string;
}

export function EvidenceCard({
  evidence,
  onInspect,
  active,
  className,
}: EvidenceCardProps) {
  const Icon = EVIDENCE_ICONS[evidence.kind];

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-3 transition-colors",
        active ? "border-brand/40 ring-1 ring-brand/20" : "border-border",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-gold-soft text-ink"
        >
          <Icon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold break-words text-ink">
              {evidence.title}
            </p>
            <Badge
              variant="outline"
              className="shrink-0 text-[10px] text-ink-muted"
            >
              {evidence.kind}
            </Badge>
          </div>
          <p className="type-small mt-1 text-ink-secondary">
            {evidence.description}
          </p>
          <p className="mt-2 text-[11px] text-ink-muted">
            {evidence.source} · {evidence.capturedAt.slice(0, 10)}
          </p>
        </div>
      </div>

      {onInspect ? (
        <Button
          variant="outline"
          size="xs"
          className="mt-3 w-full"
          onClick={() => onInspect(evidence)}
        >
          Inspect evidence
        </Button>
      ) : null}
    </div>
  );
}
