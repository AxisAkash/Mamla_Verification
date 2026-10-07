"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import { EvidenceCard } from "@/components/evidence/evidence-card";
import { EvidencePreview } from "@/components/evidence/evidence-preview";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Evidence } from "@/types/legal";

interface EvidenceDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evidence: Evidence[];
  title?: string;
}

export function EvidenceDrawer({
  open,
  onOpenChange,
  evidence,
  title = "Evidence",
}: EvidenceDrawerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = evidence.find((item) => item.id === selectedId);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="gap-5 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>
            Material attached to this verification case.
          </SheetDescription>
        </SheetHeader>

        {selected ? (
          <div className="flex flex-col gap-4">
            {evidence.length > 1 ? (
              <Button
                variant="ghost"
                size="sm"
                className="w-fit"
                onClick={() => setSelectedId(null)}
              >
                <ArrowLeft aria-hidden="true" />
                All evidence
              </Button>
            ) : null}

            <EvidencePreview evidence={selected} />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {evidence.map((item) => (
              <EvidenceCard
                key={item.id}
                evidence={item}
                onInspect={() => setSelectedId(item.id)}
              />
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
