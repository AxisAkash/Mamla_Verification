'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, FilePlus2, MoreHorizontal } from 'lucide-react';

import { Logo } from '@/components/shared/logo';
import { LanguageToggle } from '@/components/shared/language-toggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ExtractedInformationPanel } from '@/components/verification/extracted-information';
import { ProcessingState } from '@/components/verification/processing-state';
import { VerificationChat } from '@/components/verification/verification-chat';
import { VerificationComposer } from '@/components/verification/verification-composer';
import {
  createApiCase,
  extractApiEvidence,
  getApiCase,
  getApiCaseReport,
  getApiEvidence,
  getApiFacts,
  updateApiFacts,
  uploadApiEvidence,
  verifyApiCase,
} from '@/lib/services/api-service';
import type { Case } from '@/types/case';
import type {
  ExtractedInformation,
  NoticeFact,
  ResolvedVerificationResult,
  VerificationInputType,
  VerificationMessage,
  VerificationStage,
} from '@/types/verification';

const ACTIVE_CASE_KEY = 'mamla.activeCaseId';

const STAGE_LABELS: Record<VerificationStage, string> = {
  input: 'Notice details',
  processing: 'Processing',
  extracted: 'Check facts',
  conversation: 'Verification conversation',
};

const STAGE_ORDER: VerificationStage[] = ['input', 'processing', 'extracted', 'conversation'];

const DEMO_REPLY =
  'This conversation is optional and can only discuss the material already attached to the case. It cannot verify new facts or provide legal advice.';

function messageForCase(caseRecord: Case): VerificationMessage {
  return {
    id: `system-${caseRecord.id}`,
    author: 'system',
    content: `Evidence for ${caseRecord.reference} is preserved. Review the extracted facts and the explicit limitations before relying on any workflow result.`,
    sentAt: caseRecord.createdAt,
  };
}

export function VerificationShell() {
  const router = useRouter();
  const [stage, setStage] = useState<VerificationStage>('input');
  const [mode, setMode] = useState<VerificationInputType>('image');
  const [progressStep, setProgressStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [caseRecord, setCaseRecord] = useState<Case | null>(null);
  const [activeEvidenceId, setActiveEvidenceId] = useState<string | null>(null);
  const [extracted, setExtracted] = useState<ExtractedInformation | null>(null);
  const [result, setResult] = useState<ResolvedVerificationResult | null>(null);
  const [messages, setMessages] = useState<VerificationMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [restoring, setRestoring] = useState(true);
  const messageSequence = useRef(0);
  const replyTimer = useRef<number | null>(null);

  useEffect(() => {
    const storedCaseId = window.localStorage.getItem(ACTIVE_CASE_KEY);
    if (!storedCaseId) {
      window.setTimeout(() => setRestoring(false), 0);
      return;
    }
    const caseId = storedCaseId;

    async function restoreCase() {
      try {
        const [restoredCase, facts] = await Promise.all([
          getApiCase(caseId),
          getApiFacts(caseId),
        ]);
        setCaseRecord(restoredCase);
        setActiveEvidenceId(facts.evidenceId ?? null);
        setExtracted({ fields: facts.fields, overallConfidence: facts.overallConfidence, sourceLabel: restoredCase.sourceLabel, rawText: facts.rawText, normalizedText: facts.normalizedText });
        setMessages([messageForCase(restoredCase)]);

        if (facts.status === 'COMPLETED' || facts.status === 'EMPTY') {
          try {
            const report = await getApiCaseReport(caseId);
            setResult(report.result);
            setCaseRecord(report.caseRecord);
            setStage('conversation');
          } catch {
            setStage('extracted');
          }
        }
      } catch {
        window.localStorage.removeItem(ACTIVE_CASE_KEY);
      } finally {
        setRestoring(false);
      }
    }

    void restoreCase();
  }, []);

  useEffect(
    () => () => {
      if (replyTimer.current !== null) window.clearTimeout(replyTimer.current);
    },
    [],
  );

  async function startProcessing() {
    setError(null);
    if (mode === 'url') {
      setError('URL input is not fetched. Upload the notice or paste its text instead.');
      return;
    }
    const canRetry = Boolean(caseRecord && activeEvidenceId);
    if (mode === 'image' && !file && !canRetry) {
      setError('Select a JPG, PNG, WEBP, PDF, or text file first.');
      return;
    }
    if (mode === 'text' && !text.trim() && !canRetry) {
      setError('Paste the notice text before starting extraction.');
      return;
    }

    setPending(true);
    setProgressStep(1);
    setStage('processing');

    try {
      let currentCase = caseRecord;
      let currentEvidenceId = activeEvidenceId;
      let sourceLabel = currentCase?.sourceLabel ?? 'Uploaded notice';
      if (!currentCase || !currentEvidenceId) {
        const source = file ?? new File([text], 'notice.txt', { type: 'text/plain' });
        const inputType: VerificationInputType = source.type === 'application/pdf' ? 'document' : source.type === 'text/plain' ? 'text' : 'image';
        currentCase = await createApiCase({ inputType, sourceLabel: source.name });
        window.localStorage.setItem(ACTIVE_CASE_KEY, currentCase.id);
        setCaseRecord(currentCase);
        const uploaded = await uploadApiEvidence(currentCase.id, source);
        currentEvidenceId = uploaded.evidenceId;
        setActiveEvidenceId(currentEvidenceId);
        sourceLabel = source.name;
      }
      if (!currentCase || !currentEvidenceId) throw new Error('The evidence record could not be restored.');
      setProgressStep(2);
      setProgressStep(3);
      const extractedResult = await extractApiEvidence(currentCase.id, currentEvidenceId);
      if (extractedResult.status === 'FAILED') {
        throw new Error(extractedResult.error ?? 'The document could not be processed.');
      }
      const nextExtracted = {
        fields: extractedResult.fields,
        overallConfidence: extractedResult.overallConfidence,
        sourceLabel,
        rawText: extractedResult.rawText,
        normalizedText: extractedResult.normalizedText,
      };
      setExtracted(nextExtracted);
      setMessages([messageForCase(currentCase)]);
      setProgressStep(4);
      setStage('extracted');
    } catch (caught) {
      setStage('input');
      setError(caught instanceof Error ? caught.message : 'The notice could not be processed.');
    } finally {
      setPending(false);
    }
  }

  async function confirmFacts(facts: NoticeFact[]) {
    if (!caseRecord) return;
    setError(null);
    setPending(true);
    try {
      await updateApiFacts(caseRecord.id, facts);
      const nextEvidence = await getApiEvidence(caseRecord.id);
      const nextResult = await verifyApiCase(caseRecord.id, nextEvidence);
      const refreshedCase = await getApiCase(caseRecord.id);
      setCaseRecord(refreshedCase);
      setResult(nextResult);
      setMessages([messageForCase(refreshedCase)]);
      window.localStorage.setItem(ACTIVE_CASE_KEY, caseRecord.id);
      setStage('conversation');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The confirmed facts could not be saved.');
    } finally {
      setPending(false);
    }
  }

  function restart() {
    if (replyTimer.current !== null) {
      window.clearTimeout(replyTimer.current);
      replyTimer.current = null;
    }
    window.localStorage.removeItem(ACTIVE_CASE_KEY);
    setPending(false);
    setProgressStep(0);
    setCaseRecord(null);
    setActiveEvidenceId(null);
    setExtracted(null);
    setResult(null);
    setMessages([]);
    setFile(null);
    setText('');
    setError(null);
    setMode('image');
    setStage('input');
  }

  function sendMessage(content: string) {
    if (!caseRecord) return;
    const userMessage: VerificationMessage = {
      id: `live-user-${messageSequence.current}`,
      author: 'applicant',
      content,
      sentAt: new Date().toISOString(),
    };
    messageSequence.current += 1;
    setMessages((current) => [...current, userMessage]);
    setPending(true);
    replyTimer.current = window.setTimeout(() => {
      const advisorMessage: VerificationMessage = {
        id: `live-advisor-${messageSequence.current}`,
        author: 'advisor',
        content: DEMO_REPLY,
        sentAt: new Date().toISOString(),
      };
      messageSequence.current += 1;
      setMessages((current) => [...current, advisorMessage]);
      setPending(false);
      replyTimer.current = null;
    }, 650);
  }

  const stageIndex = STAGE_ORDER.indexOf(stage);

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/" aria-label="Mamla Verification home" className="rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
              <Logo />
            </Link>
            <span aria-hidden="true" className="hidden h-6 w-px bg-border sm:block" />
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-xs font-medium text-ink-secondary">Verification workspace</p>
              <p className="truncate text-xs text-ink-muted">{STAGE_LABELS[stage]}</p>
            </div>
          </div>

          <div className="hidden items-center gap-1.5 md:flex" aria-label="Case progress">
            {STAGE_ORDER.map((item, index) => (
              <span key={item} className="flex items-center gap-1.5">
                <span aria-current={stage === item ? 'step' : undefined} className={index <= stageIndex ? 'size-2 rounded-full bg-brand' : 'size-2 rounded-full bg-border'} />
                {index < STAGE_ORDER.length - 1 ? <span aria-hidden="true" className="h-px w-4 bg-border" /> : null}
              </span>
            ))}
          </div>

          <DropdownMenu>
            <LanguageToggle className="hidden sm:inline-flex" />
            <DropdownMenuTrigger aria-label="Workspace actions" render={<Button variant="outline" size="sm" className="gap-2" />}>
              <MoreHorizontal aria-hidden="true" className="size-4" />
              <span className="hidden sm:inline">Case actions</span>
              <ChevronDown aria-hidden="true" className="hidden size-3.5 sm:inline" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{caseRecord ? `Case ${caseRecord.reference}` : 'New case'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {caseRecord && result ? (
                <DropdownMenuItem onClick={() => router.push(`/result/${caseRecord.id}`)}>
                  <FilePlus2 aria-hidden="true" />
                  Open report
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuItem onClick={restart}>Start a new verification</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        {restoring ? (
          <div className="grid flex-1 place-items-center px-5 py-14" role="status">
            <p className="text-sm text-ink-secondary">Restoring your saved verification…</p>
          </div>
        ) : null}
        {!restoring && stage === 'input' ? (
          <VerificationComposer
            mode={mode}
            onModeChange={setMode}
            file={file}
            text={text}
            error={error}
            submitting={pending}
            onFileChange={setFile}
            onTextChange={setText}
            onSubmit={() => void startProcessing()}
          />
        ) : null}
        {!restoring && stage === 'processing' ? <ProcessingState step={progressStep} /> : null}
        {!restoring && stage === 'extracted' && extracted ? (
          <ExtractedInformationPanel extracted={extracted} onConfirm={(facts) => void confirmFacts(facts)} onRestart={restart} />
        ) : null}
        {!restoring && stage === 'conversation' && caseRecord && result ? (
          <VerificationChat
            caseRecord={caseRecord}
            result={result}
            messages={messages}
            pending={pending}
            onSend={sendMessage}
            onOpenResult={() => router.push(`/result/${caseRecord.id}`)}
          />
        ) : null}
        {!restoring && error && stage !== 'input' ? (
          <p role="alert" className="mx-auto mb-6 max-w-3xl rounded-lg border border-status-alert-border bg-status-alert-bg px-4 py-3 text-sm text-status-alert">
            {error}
          </p>
        ) : null}
      </main>
    </div>
  );
}
