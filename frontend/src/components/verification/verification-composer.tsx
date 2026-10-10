"use client";

import { ArrowRight, CircleHelp, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadPanel } from "@/components/verification/upload-panel";
import { UrlInput } from "@/components/verification/url-input";
import { TextInput } from "@/components/verification/text-input";
import { INPUT_MODES } from "@/lib/constants";
import type { VerificationInputType } from "@/types/verification";

interface VerificationComposerProps {
  mode: VerificationInputType;
  onModeChange: (mode: VerificationInputType) => void;
  file: File | null;
  text: string;
  error: string | null;
  submitting: boolean;
  onFileChange: (file: File | null) => void;
  onTextChange: (value: string) => void;
  onSubmit: () => void;
}

export function VerificationComposer({
  mode,
  onModeChange,
  file,
  text,
  error,
  submitting,
  onFileChange,
  onTextChange,
  onSubmit,
}: VerificationComposerProps) {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(16rem,0.7fr)] lg:gap-10 lg:py-14">
      <Card className="surface-raised gap-0 rounded-2xl">
        <CardHeader className="gap-2 border-b border-border px-5 py-5 sm:px-7 sm:py-7">
          <p className="type-caption text-brand">Step 01 · Submit notice</p>
          <h1 className="type-h2 text-ink">Start a verification</h1>
          <p className="type-small max-w-2xl text-ink-secondary">
            Upload a notice for private text extraction and review. Reading a document does not produce a legal conclusion.
          </p>
        </CardHeader>

        <CardContent className="flex flex-col gap-5 px-5 py-5 sm:px-7 sm:py-7">
          <Tabs
            value={mode}
            onValueChange={(value) => onModeChange(value as VerificationInputType)}
            className="gap-5"
          >
            <TabsList className="grid h-auto w-full grid-cols-3 gap-1 rounded-lg bg-muted p-1">
              {INPUT_MODES.map((inputMode) => {
                const Icon = inputMode.icon;

                return (
                  <TabsTrigger
                    key={inputMode.value}
                    value={inputMode.value}
                    className="h-auto min-h-10 gap-1.5 px-2 py-2 text-xs sm:text-sm"
                  >
                    <Icon aria-hidden="true" className="size-4" />
                    <span className="truncate">{inputMode.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value="image">
              <UploadPanel file={file} onFileChange={onFileChange} />
            </TabsContent>
            <TabsContent value="url">
              <UrlInput />
            </TabsContent>
            <TabsContent value="text">
              <TextInput value={text} onChange={onTextChange} />
            </TabsContent>
          </Tabs>

          <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="type-small flex items-start gap-2 text-ink-secondary">
              <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" />
              Files are sent only to the configured Mamla backend for processing.
            </p>
            <Button onClick={onSubmit} disabled={submitting} className="h-11 gap-2 px-5">
              {submitting ? "Uploading…" : "Start verification"}
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
          {error ? (
            <p role="alert" className="rounded-lg border border-status-alert-border bg-status-alert-bg px-3 py-2 text-sm text-status-alert">
              {error}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <aside className="flex flex-col gap-4">
        <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
          <h2 className="type-h3 text-ink">What happens next</h2>
          <ol className="mt-5 flex flex-col gap-4">
            {[
              "Notice details are structured into a case record.",
              "Supporting evidence is listed beside the conversation.",
              "A saved report shows the workflow state, evidence, and limitations.",
            ].map((item, index) => (
              <li key={item} className="flex items-start gap-3">
                <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-brand">
                  {index + 1}
                </span>
                <p className="type-small text-ink-secondary">{item}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-xl border border-gold/35 bg-gold-soft/45 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <CircleHelp aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-status-review" />
            <div>
              <h2 className="text-sm font-semibold text-ink">A careful boundary</h2>
              <p className="type-small mt-1.5 text-ink-secondary">
                 This interface does not determine guilt, provide legal advice,
                 or connect to an official portal. Treat every extracted value as a candidate.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
