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
import { PROCESSING_STEPS } from '@/lib/constants';
import { getDemoWorkflow, updateCaseFacts } from '@/lib/services/case-service';
import type {
  NoticeFact,
  VerificationInputType,
  VerificationMessage,
  VerificationStage,
} from '@/types/verification';

const workflow = getDemoWorkflow();

const STAGE_LABELS: Record<VerificationStage, string> = {
  input: 'Notice details',
  processing: 'Processing',
  extracted: 'Check facts',
  conversation: 'Verification conversation',
};

const STAGE_ORDER: VerificationStage[] = [
  'input',
  'processing',
  'extracted',
  'conversation',
];

const DEMO_REPLY =
  'That is a useful question to record. This demonstration can only reason from the material already attached to the case; it cannot verify new facts or provide legal advice. The report lists the evidence gap and the illustrative provision used for comparison.';

export function VerificationShell() {
  const router = useRouter();
  const [stage, setStage] = useState<VerificationStage>('input');
  const [mode, setMode] = useState<VerificationInputType>('image');
  const [progressStep, setProgressStep] = useState(0);
  const [messages, setMessages] = useState<VerificationMessage[]>(workflow.messages);
  const [pending, setPending] = useState(false);
  const messageSequence = useRef(0);
  const replyTimer = useRef<number | null>(null);
  const caseRecord = workflow.caseRecord;

  useEffect(() => {
    if (stage !== 'processing') return;

    let completedSteps = 0;
    let completionTimer: number | undefined;
    const interval = window.setInterval(() => {
      completedSteps += 1;
      setProgressStep(completedSteps);

      if (completedSteps >= PROCESSING_STEPS.length) {
        window.clearInterval(interval);
        completionTimer = window.setTimeout(() => {
          setStage('extracted');
        }, 450);
      }
    }, 700);

    return () => {
      window.clearInterval(interval);
      if (completionTimer !== undefined) window.clearTimeout(completionTimer);
    };
  }, [stage]);

  useEffect(
    () => () => {
      if (replyTimer.current !== null) window.clearTimeout(replyTimer.current);
    },
    []
  );

  function startProcessing() {
    setProgressStep(0);
    setStage('processing');
  }

  function confirmFacts(facts: NoticeFact[]) {
    updateCaseFacts(caseRecord.id, facts);
    setStage('conversation');
  }

  function restart() {
    if (replyTimer.current !== null) {
      window.clearTimeout(replyTimer.current);
      replyTimer.current = null;
    }
    setPending(false);
    setProgressStep(0);
    setMessages(workflow.messages);
    setMode('image');
    setStage('input');
  }

  function sendMessage(content: string) {
    const userMessage: VerificationMessage = {
      id: 'live-user-' + messageSequence.current,
      author: 'applicant',
      content,
      sentAt: '2026-01-14T09:22:00+06:00',
    };
    messageSequence.current += 1;
    setMessages((current) => [...current, userMessage]);
    setPending(true);

    replyTimer.current = window.setTimeout(() => {
      const advisorMessage: VerificationMessage = {
        id: 'live-advisor-' + messageSequence.current,
        author: 'advisor',
        content: DEMO_REPLY,
        sentAt: '2026-01-14T09:23:00+06:00',
        citationIds: ['cite-provision'],
        evidenceIds: ['ev-photo'],
      };
      messageSequence.current += 1;
      setMessages((current) => [...current, advisorMessage]);
      setPending(false);
      replyTimer.current = null;
    }, 850);
  }

  const stageIndex = STAGE_ORDER.indexOf(stage);

  return (
    <div className='flex min-h-dvh flex-col bg-canvas'>
      <header className='sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-sm'>
        <div className='mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-8'>
          <div className='flex min-w-0 items-center gap-3'>
            <Link href='/' aria-label='Mamla Verification home' className='rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50'>
              <Logo />
            </Link>
            <span aria-hidden='true' className='hidden h-6 w-px bg-border sm:block' />
            <div className='hidden min-w-0 sm:block'>
              <p className='truncate text-xs font-medium text-ink-secondary'>Verification workspace</p>
              <p className='truncate text-xs text-ink-muted'>{STAGE_LABELS[stage]}</p>
            </div>
          </div>

          <div className='hidden items-center gap-1.5 md:flex' aria-label='Case progress'>
            {STAGE_ORDER.map((item, index) => (
              <span key={item} className='flex items-center gap-1.5'>
                <span
                  aria-current={stage === item ? 'step' : undefined}
                  className={index <= stageIndex ? 'size-2 rounded-full bg-brand' : 'size-2 rounded-full bg-border'}
                />
                {index < STAGE_ORDER.length - 1 ? (
                  <span aria-hidden='true' className='h-px w-4 bg-border' />
                ) : null}
              </span>
            ))}
          </div>

          <DropdownMenu>
            <LanguageToggle className='hidden sm:inline-flex' />
            <DropdownMenuTrigger
              aria-label='Workspace actions'
              render={<Button variant='outline' size='sm' className='gap-2' />}
            >
              <MoreHorizontal aria-hidden='true' className='size-4' />
              <span className='hidden sm:inline'>Case actions</span>
              <ChevronDown aria-hidden='true' className='hidden size-3.5 sm:inline' />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Demonstration case</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/result/' + caseRecord.id)}>
                <FilePlus2 aria-hidden='true' />
                Open demo report
              </DropdownMenuItem>
              <DropdownMenuItem onClick={restart}>Start a new verification</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className='flex flex-1 flex-col'>
        {stage === 'input' ? (
          <VerificationComposer mode={mode} onModeChange={setMode} onSubmit={startProcessing} />
        ) : null}
        {stage === 'processing' ? <ProcessingState step={progressStep} /> : null}
        {stage === 'extracted' ? (
          <ExtractedInformationPanel extracted={workflow.extracted} onConfirm={confirmFacts} onRestart={restart} />
        ) : null}
        {stage === 'conversation' ? (
          <VerificationChat
            caseRecord={caseRecord}
            result={workflow.result}
            messages={messages}
            pending={pending}
            onSend={sendMessage}
            onOpenResult={() => router.push('/result/' + caseRecord.id)}
          />
        ) : null}
      </main>
    </div>
  );
}
