import { BadgeCheck, CircleHelp, Gavel, TriangleAlert } from 'lucide-react';

import { Container } from '@/components/shared/container';
import { SectionHeading } from '@/components/shared/section-heading';
import { STATUS_META } from '@/lib/constants';
import type { VerificationStatus } from '@/types/verification';

const STATES: Array<{
  status: VerificationStatus;
  detail: string;
  icon: typeof BadgeCheck;
}> = [
  {
    status: 'CONFORMS',
    detail: 'The available notice details and retained provision appear aligned.',
    icon: BadgeCheck,
  },
  {
    status: 'POTENTIALLY_NONCOMPLIANT',
    detail: 'A reported condition may not match the applicable rule.',
    icon: TriangleAlert,
  },
  {
    status: 'INSUFFICIENT_INFORMATION',
    detail: 'The system abstains when the available material is too thin.',
    icon: CircleHelp,
  },
  {
    status: 'MANUAL_LEGAL_REVIEW',
    detail: 'Some cases need a qualified person to interpret the context.',
    icon: Gavel,
  },
];

export function ResultStates() {
  return (
    <section className='border-b border-border bg-background'>
      <Container className='flex flex-col gap-10 py-16 lg:py-24'>
        <SectionHeading
          eyebrow='Honest uncertainty'
          title='Every result has a responsible next sentence'
          description='A result is more useful when it tells you what it knows, what it cannot verify, and what to do next.'
        />
        <div className='grid gap-4 md:grid-cols-2'>
          {STATES.map(({ status, detail, icon: Icon }) => {
            const meta = STATUS_META[status];
            return (
              <article key={status} className={'rounded-xl border p-5 ' + meta.panelClassName}>
                <div className='flex items-start gap-4'>
                  <span className='inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/75'>
                    <Icon aria-hidden='true' className='size-5' />
                  </span>
                  <div>
                    <p className='text-xs font-semibold uppercase tracking-wide opacity-75'>{meta.label}</p>
                    <h3 className='mt-1.5 text-lg font-semibold text-ink'>{meta.plainLabel}</h3>
                    <p className='type-small mt-2 text-ink-secondary'>{detail}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
