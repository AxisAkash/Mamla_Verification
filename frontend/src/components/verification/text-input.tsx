import { Textarea } from "@/components/ui/textarea";
import { DEMO_NOTICE_PLACEHOLDER } from "@/lib/constants";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TextInput({ value, onChange }: TextInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="notice-text" className="text-sm font-medium text-ink">
        Notice text
      </label>
      <Textarea
        id="notice-text"
        value={value}
        rows={7}
        placeholder={DEMO_NOTICE_PLACEHOLDER}
        className="min-h-48 resize-y bg-card"
        onChange={(event) => onChange(event.currentTarget.value)}
      />
      <p className="type-small text-ink-secondary">
        Include the notice number, date, location, and alleged violation when available.
      </p>
    </div>
  );
}
