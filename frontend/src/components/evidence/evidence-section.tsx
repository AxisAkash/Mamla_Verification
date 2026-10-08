"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { EvidenceCard } from "@/components/evidence/evidence-card";
import { EvidenceDrawer } from "@/components/evidence/evidence-drawer";
import { Button } from "@/components/ui/button";
import type { Evidence } from "@/types/legal";

interface EvidenceSectionProps {
  evidence: Evidence[];
}

export function EvidenceSection({ evidence }: EvidenceSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        {evidence.map((item) => (
          <EvidenceCard
            key={item.id}
            evidence={item}
            onInspect={() => setOpen(true)}
          />
        ))}
      </div>
      <Button
        variant="outline"
        className="mt-4 gap-2"
        onClick={() => setOpen(true)}
      >
        Inspect evidence set
        <ArrowUpRight aria-hidden="true" />
      </Button>
      <EvidenceDrawer
        open={open}
        onOpenChange={setOpen}
        evidence={evidence}
        title="Evidence attached to this report"
      />
    </>
  );
}
