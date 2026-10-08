import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  CircleHelp,
  Gavel,
  TriangleAlert,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { STATUS_META } from "@/lib/constants";
import type { VerificationStatus } from "@/types/verification";

const STATUS_ICONS: Record<VerificationStatus, LucideIcon> = {
  CONFORMS: BadgeCheck,
  POTENTIALLY_NONCOMPLIANT: TriangleAlert,
  INSUFFICIENT_INFORMATION: CircleHelp,
  MANUAL_LEGAL_REVIEW: Gavel,
};

interface VerificationStatusBadgeProps {
  status: VerificationStatus;
  className?: string;
  size?: "sm" | "md";
}

export function VerificationStatusBadge({
  status,
  className,
  size = "sm",
}: VerificationStatusBadgeProps) {
  const meta = STATUS_META[status];
  const Icon = STATUS_ICONS[status];

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 font-medium whitespace-nowrap",
        size === "sm" ? "py-0.5 text-xs" : "py-1.5 text-sm",
        meta.badgeClassName,
        className
      )}
    >
      <Icon aria-hidden="true" className="size-3.5 shrink-0" />
      {size === "sm" ? meta.shortLabel : meta.label}
    </span>
  );
}

interface VerificationStatusPanelProps {
  status: VerificationStatus;
  headline?: string;
  className?: string;
}

export function VerificationStatusPanel({
  status,
  headline,
  className,
}: VerificationStatusPanelProps) {
  const meta = STATUS_META[status];
  const Icon = STATUS_ICONS[status];

  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-xl border p-5",
        meta.panelClassName,
        className
      )}
    >
      <span
        aria-hidden="true"
        className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/70"
      >
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="type-caption opacity-80">Verification status</p>
        <p className="mt-1 text-lg font-semibold text-ink">{meta.plainLabel}</p>
        {headline ? (
          <p className="mt-1 text-sm font-medium text-ink/80">{headline}</p>
        ) : null}
        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-ink/60">
          {meta.label}
        </p>
        <p className="type-small mt-1.5 text-ink-secondary">
          {meta.description}
        </p>
      </div>
    </div>
  );
}
