"use client";

import { useState } from "react";
import { MessageCircleQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";

const ANSWERS: Record<string, string> = {
  "Why does this result differ?":
    "The submitted notice details were readable, but the evidence did not corroborate the signal condition. That gap is why the result stays cautious rather than definitive.",
  "What evidence was used?":
    "The demonstration used the notice photograph, a vehicle registration extract, a portal reference, and an applicant note. Each appears in the Evidence section above.",
  "What should I do next?":
    "Review the missing evidence, compare the notice with the official source yourself, and consider qualified legal help if the amount or circumstances matter to you.",
};

const PROMPTS = Object.keys(ANSWERS);

export function AskAboutCase() {
  const [question, setQuestion] = useState<string | null>(null);

  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
          <MessageCircleQuestion aria-hidden="true" className="size-5" />
        </span>
        <div>
          <p className="type-caption text-brand">Optional case help</p>
          <h3 className="mt-1 text-lg font-semibold text-ink">Ask about this case</h3>
          <p className="type-small mt-1 text-ink-secondary">
            Choose a question to see a plain-language explanation from this demonstration record. Chat is optional; the report remains the source of truth.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {PROMPTS.map((prompt) => (
          <Button
            key={prompt}
            variant={question === prompt ? "secondary" : "outline"}
            size="sm"
            onClick={() => setQuestion(prompt)}
          >
            {prompt}
          </Button>
        ))}
      </div>

      {question ? (
        <div className="mt-4 rounded-lg border border-brand/15 bg-brand-wash p-4" role="status">
          <p className="text-sm font-semibold text-ink">{question}</p>
          <p className="type-small mt-2 text-ink-secondary">{ANSWERS[question]}</p>
        </div>
      ) : null}
    </section>
  );
}
