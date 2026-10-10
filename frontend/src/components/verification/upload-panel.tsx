"use client";

import { Check, FileUp, Upload } from "lucide-react";

interface UploadPanelProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export function UploadPanel({ file, onFileChange }: UploadPanelProps) {

  return (
    <div className="flex flex-col gap-4">
      <label
        htmlFor="notice-file"
        className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-brand/35 bg-canvas px-6 py-8 text-center transition-colors hover:border-brand/60 hover:bg-brand-soft/50 focus-within:ring-3 focus-within:ring-ring/40"
      >
        <span className="inline-flex size-12 items-center justify-center rounded-xl bg-brand-soft text-brand">
          {file ? <FileUp aria-hidden="true" /> : <Upload aria-hidden="true" />}
        </span>
        <span className="mt-4 text-sm font-semibold text-ink">
          {file?.name ?? "Drop a notice image or document here"}
        </span>
        <span className="mt-1 text-sm text-ink-secondary">
          or <span className="font-semibold text-brand underline underline-offset-4">browse files</span>
        </span>
        <span className="mt-3 text-xs text-ink-muted">
          PNG, JPG, WEBP, PDF, or TXT · max 10 MiB
        </span>
        <input
          id="notice-file"
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.pdf,.txt,.text,image/jpeg,image/png,image/webp,application/pdf,text/plain"
          className="sr-only"
          onChange={(event) => {
            onFileChange(event.currentTarget.files?.[0] ?? null);
          }}
        />
      </label>
      {file ? (
        <p className="inline-flex items-center gap-2 text-sm text-status-conforms">
          <Check aria-hidden="true" className="size-4" />
          Ready to upload: {file.name}
        </p>
      ) : null}
    </div>
  );
}
