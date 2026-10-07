import { Link2 } from "lucide-react";

import { Input } from "@/components/ui/input";

export function UrlInput() {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="notice-url" className="text-sm font-medium text-ink">
        Notice URL
      </label>
      <div className="relative">
        <Link2
          aria-hidden="true"
          className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-muted"
        />
        <Input
          id="notice-url"
          type="url"
          placeholder="https://example.invalid/notice/…"
          className="h-11 pl-10"
          autoComplete="url"
        />
      </div>
      <p className="type-small text-ink-secondary">
        Use a public notice or portal link. This demo does not fetch external URLs.
      </p>
    </div>
  );
}
