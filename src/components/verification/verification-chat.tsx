"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, FileSearch, Send, ShieldCheck } from "lucide-react";

import { EvidenceCard } from "@/components/evidence/evidence-card";
import { EvidenceDrawer } from "@/components/evidence/evidence-drawer";
import { Citation, CitationChip } from "@/components/legal/citation";
import { VerificationStatusBadge } from "@/components/legal/verification-status";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  demoCitations,
  demoEvidence,
  demoProvisions,
  getCitationsByIds,
  getEvidenceByIds,
} from "@/data/mock-data";
import type { Case } from "@/types/case";
import type { VerificationMessage } from "@/types/verification";

interface VerificationChatProps {
  caseRecord: Case;
  messages: VerificationMessage[];
  pending: boolean;
  onSend: (message: string) => void;
  onOpenResult: () => void;
}

export function VerificationChat({
  caseRecord,
  messages,
  pending,
  onSend,
  onOpenResult,
}: VerificationChatProps) {
  const [draft, setDraft] = useState("");
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages, pending]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = draft.trim();
    if (!message || pending) return;
    onSend(message);
    setDraft("");
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-6 sm:px-8">
      <section className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Case {caseRecord.reference}
            </p>
            <VerificationStatusBadge status={caseRecord.status} />
          </div>
          <h1 className="mt-1 truncate text-sm font-semibold text-ink sm:text-base">
            {caseRecord.title}
          </h1>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 lg:hidden"
            onClick={() => setEvidenceOpen(true)}
          >
            <FileSearch aria-hidden="true" />
            Evidence <span className="tabular-nums">({demoEvidence.length})</span>
          </Button>
          <Button size="sm" className="gap-1.5" onClick={onOpenResult}>
            Open report
            <ArrowUpRight aria-hidden="true" />
          </Button>
        </div>
      </section>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(19rem,0.8fr)]">
        <section
          aria-label="Verification conversation"
          className="flex min-h-[32rem] flex-col overflow-hidden rounded-xl border border-border bg-canvas"
        >
          <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3 sm:px-5">
            <div>
              <p className="text-sm font-semibold text-ink">Verification conversation</p>
              <p className="text-xs text-ink-secondary">
                Analysis is attached to evidence and cited sources.
              </p>
            </div>
            <span className="hidden items-center gap-1.5 rounded-full border border-brand/20 bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand sm:inline-flex">
              <ShieldCheck aria-hidden="true" className="size-3.5" />
              Demo case
            </span>
          </div>

          <div className="max-h-[min(58vh,38rem)] flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5">
            {messages.map((message) => {
              const citations = getCitationsByIds(message.citationIds);
              const linkedEvidence = getEvidenceByIds(message.evidenceIds);

              if (message.author === "applicant") {
                return (
                  <article key={message.id} className="ml-auto max-w-[88%]">
                    <div className="rounded-xl rounded-br-sm bg-brand px-4 py-3 text-primary-foreground shadow-sm">
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    <p className="mt-1 text-right text-[11px] text-ink-muted">
                      You · {message.sentAt.slice(11, 16)}
                    </p>
                  </article>
                );
              }

              if (message.author === "system") {
                return (
                  <article
                    key={message.id}
                    className="mx-auto max-w-[92%] rounded-lg border border-border bg-card px-4 py-3"
                  >
                    <p className="type-caption text-ink-muted">Case record</p>
                    <p className="type-small mt-1 text-ink-secondary">
                      {message.content}
                    </p>
                    {citations.map((citation) => (
                      <CitationChip key={citation.id} citation={citation} className="mt-2" />
                    ))}
                  </article>
                );
              }

              return (
                <article key={message.id} className="max-w-[94%]">
                  <div className="rounded-xl rounded-bl-sm border border-brand/15 bg-card p-4 shadow-sm">
                    <p className="text-xs font-semibold text-brand">
                      Verification advisor
                      <span className="ml-2 font-normal text-ink-muted">
                        {message.sentAt.slice(11, 16)}
                      </span>
                    </p>
                    <p className="type-small mt-2 whitespace-pre-wrap text-ink">
                      {message.content}
                    </p>
                    {citations.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {citations.map((citation) => (
                          <CitationChip key={citation.id} citation={citation} />
                        ))}
                      </div>
                    ) : null}
                    {linkedEvidence.length > 0 ? (
                      <div className="mt-3 border-t border-border pt-3">
                        <p className="mb-2 text-[11px] font-medium text-ink-muted">
                          Referenced evidence
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {linkedEvidence.map((item) => (
                            <span
                              key={item.id}
                              className="inline-flex items-center gap-1 rounded-md bg-canvas px-2 py-1 text-[11px] text-ink-secondary"
                            >
                              <FileSearch aria-hidden="true" className="size-3" />
                              {item.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </article>
              );
            })}

            {pending ? (
              <div role="status" className="flex items-center gap-2 text-sm text-ink-secondary">
                <span className="size-2 animate-pulse rounded-full bg-brand" />
                Preparing a demonstration response…
              </div>
            ) : null}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            aria-label="Verification conversation input"
            className="border-t border-border bg-card p-3 sm:p-4"
          >
            <label htmlFor="verification-message" className="sr-only">
              Ask a question about this notice
            </label>
            <div className="flex items-end gap-2">
              <Textarea
                id="verification-message"
                value={draft}
                onChange={(event) => setDraft(event.currentTarget.value)}
                placeholder="Ask about the notice, evidence, or cited provisions…"
                rows={2}
                className="min-h-11 resize-y bg-canvas"
                disabled={pending}
              />
              <Button
                type="submit"
                size="icon"
                className="size-11 shrink-0"
                aria-label="Send message"
                disabled={!draft.trim() || pending}
              >
                <Send aria-hidden="true" />
              </Button>
            </div>
            <p className="mt-2 text-[11px] text-ink-muted">
              Replies are mock responses, not legal advice.
            </p>
          </form>
        </section>

        <aside className="hidden min-h-0 flex-col gap-4 overflow-y-auto lg:flex">
          <section className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-ink">Evidence</h2>
              <span className="text-xs text-ink-muted">{demoEvidence.length} items</span>
            </div>
            <div className="mt-3 flex flex-col gap-2.5">
              {demoEvidence.map((item) => (
                <EvidenceCard key={item.id} evidence={item} />
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-4">
            <h2 className="text-sm font-semibold text-ink">Source citations</h2>
            <div className="mt-3 flex flex-col gap-2">
              {demoCitations.map((citation) => (
                <Citation key={citation.id} citation={citation} />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
            <div>
              <p className="type-caption text-ink-muted">Retained provision</p>
              <p className="mt-1 text-sm font-semibold text-ink">
                {demoProvisions[0]?.act}
              </p>
              <p className="text-xs text-ink-secondary">
                {demoProvisions[0]?.section} · illustrative
              </p>
            </div>
            <Button variant="outline" className="w-full" onClick={onOpenResult}>
              Review full advisory report
              <ArrowUpRight aria-hidden="true" />
            </Button>
          </section>
        </aside>
      </div>

      <EvidenceDrawer
        open={evidenceOpen}
        onOpenChange={setEvidenceOpen}
        evidence={demoEvidence}
        title="Case evidence"
      />
    </div>
  );
}
