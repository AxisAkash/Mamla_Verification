import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  tone?: "default" | "on-dark";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  tone = "default",
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        centered && "items-center text-center",
        className
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "type-caption",
            tone === "on-dark" ? "text-gold-soft" : "text-brand"
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "type-h2 max-w-2xl",
          tone === "on-dark" ? "text-white" : "text-ink"
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "type-body max-w-2xl text-ink-secondary",
            tone === "on-dark" && "text-white/70"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
