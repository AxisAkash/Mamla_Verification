"use client";

import { useState } from "react";
import { ArrowRight, Check, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { demoExtracted } from "@/data/mock-data";
import type { ExtractedField } from "@/types/verification";

interface ExtractedInformationPanelProps {
  onConfirm: (fields: ExtractedField[]) => void;
  onRestart: () => void;
}

export function ExtractedInformationPanel({
  onConfirm,
  onRestart,
}: ExtractedInformationPanelProps) {
  const [fields, setFields] = useState<ExtractedField[]>(demoExtracted.fields);

  function updateField(label: string, value: string) {
    setFields((current) =>
      current.map((field) => (field.label === label ? { ...field, value } : field))
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(16rem,0.7fr)] lg:gap-10 lg:py-14">
      <Card className="surface-raised gap-0 rounded-2xl">
        <CardHeader className="gap-2 border-b border-border px-5 py-5 sm:px-7 sm:py-7">
          <p className="type-caption text-brand">Step 02 · Check facts</p>
          <h1 className="type-h2 text-ink">Check the facts before we verify.</h1>
          <p className="type-small max-w-2xl text-ink-secondary">
            We read these details from the demonstration notice. Correct anything that looks wrong before it is used in the legal comparison.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-border bg-canvas px-3 py-1 text-xs font-medium text-ink-secondary">
              Source · {demoExtracted.sourceLabel}
            </span>
            <span className="rounded-full border border-brand/20 bg-brand-soft px-3 py-1 text-xs font-medium text-brand">
              {demoExtracted.overallConfidence}% overall confidence
            </span>
          </div>
        </CardHeader>

        <CardContent className="grid gap-3 px-5 py-5 sm:grid-cols-2 sm:px-7 sm:py-7">
          {fields.map((field) => (
            <label key={field.label} className="rounded-lg border border-border bg-card p-4">
              <span className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-ink-secondary">{field.label}</span>
                {field.confidence !== undefined ? (
                  <span className="text-xs tabular-nums text-ink-muted">{field.confidence}% read</span>
                ) : null}
              </span>
              <Input
                value={field.value}
                onChange={(event) => updateField(field.label, event.currentTarget.value)}
                className="mt-2 h-10 bg-canvas text-sm font-semibold text-ink"
                aria-label={`Edit ${field.label}`}
              />
            </label>
          ))}
        </CardContent>
      </Card>

      <aside className="flex flex-col gap-4">
        <div className="rounded-xl border border-status-review-border bg-status-review-bg p-5">
          <p className="text-base font-semibold text-status-review">Extraction is not verification</p>
          <p className="type-small mt-2 text-ink-secondary">
            A read field can be wrong. Your confirmation is the handoff between notice reading and legal comparison.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start gap-3">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
              <Check aria-hidden="true" className="size-4.5" />
            </span>
            <div>
              <p className="text-base font-semibold text-ink">Ready to check the law?</p>
              <p className="type-small mt-1.5 text-ink-secondary">
                Confirming sends these visible facts into the next mock analysis state.
              </p>
            </div>
          </div>
          <Button onClick={() => onConfirm(fields)} className="mt-5 h-11 w-full gap-2">
            Confirm and Check the Law
            <ArrowRight aria-hidden="true" />
          </Button>
          <Button onClick={onRestart} variant="ghost" className="mt-2 h-10 w-full gap-2 text-ink-secondary">
            <RotateCcw aria-hidden="true" />
            Start over
          </Button>
        </div>
      </aside>
    </div>
  );
}
