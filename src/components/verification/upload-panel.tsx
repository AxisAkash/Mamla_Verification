"use client";

import { useState } from "react";
import { Check, FileUp, Upload } from "lucide-react";

export function UploadPanel() {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <label
        htmlFor="notice-file"
        className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-brand/35 bg-canvas px-6 py-8 text-center transition-colors hover:border-brand/60 hover:bg-brand-soft/50 focus-within:ring-3 focus-within:ring-ring/40"
      >
        <span className="inline-flex size-12 items-center justify-center rounded-xl bg-brand-soft text-brand">
          {fileName ? <FileUp aria-hidden="true" /> : <Upload aria-hidden="true" />}
        </span>
        <span className="mt-4 text-sm font-semibold text-ink">
          {fileName ?? "Drop a notice image or document here"}
        </span>
        <span className="mt-1 text-sm text-ink-secondary">
          or <span className="font-semibold text-brand underline underline-offset-4">browse files</span>
        </span>
        <span className="mt-3 text-xs text-ink-muted">
          PNG, JPG, or PDF · demo only, file stays in your browser
        </span>
        <input
          id="notice-file"
          type="file"
          accept="image/*,.pdf,application/pdf"
          className="sr-only"
          onChange={(event) => {
            setFileName(event.currentTarget.files?.[0]?.name ?? null);
          }}
        />
      </label>
      {fileName ? (
        <p className="inline-flex items-center gap-2 text-sm text-status-conforms">
          <Check aria-hidden="true" className="size-4" />
          Selected for this demo: {fileName}
        </p>
      ) : null}
    </div>
  );
}
