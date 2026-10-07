import { Scale } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LegalProvision } from '@/types/legal';

interface LegalProvisionCardProps {
  provision: LegalProvision;
  className?: string;
}

export function LegalProvisionCard({
  provision,
  className,
}: LegalProvisionCardProps) {
  return (
    <Card className={cn('text-left', className)}>
      <CardHeader>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex items-start gap-2.5'>
            <span
              aria-hidden='true'
              className='mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-brand-soft text-brand'
            >
              <Scale className='size-4' />
            </span>
            <div>
              <p className='type-caption text-ink-muted'>Illustrative provision</p>
              <CardTitle className='mt-1 text-ink'>{provision.document}</CardTitle>
              <p className='type-small text-ink-secondary'>{provision.section}</p>
            </div>
          </div>
          <Badge
            variant='outline'
            className='hidden shrink-0 border-brand/20 bg-brand-soft text-brand sm:inline-flex'
          >
            {provision.source}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className='flex flex-col gap-4'>
        <div>
          <p className='type-caption text-ink-muted'>Rule identifier</p>
          <p className='mt-1 text-sm font-medium text-ink'>{provision.ruleIdentifier}</p>
        </div>

        <div>
          <p className='type-caption text-ink-muted'>Violation type</p>
          <p className='mt-1 text-sm font-medium text-ink'>{provision.violationType}</p>
        </div>

        <div>
          <p className='type-caption text-ink-muted'>Conditions</p>
          <ul className='mt-1.5 flex flex-col gap-1.5'>
            {provision.conditions.map((condition) => (
              <li key={condition} className='type-small flex gap-2 text-ink-secondary'>
                <span aria-hidden='true' className='text-gold'>·</span>
                {condition}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className='type-caption text-ink-muted'>Penalty</p>
          <p className='mt-1 text-sm text-ink'>{provision.penalty}</p>
        </div>

        <div className='grid gap-3 rounded-lg border border-border bg-canvas p-3 sm:grid-cols-3'>
          <div>
            <p className='text-xs font-semibold text-ink'>Location</p>
            <p className='type-small mt-0.5 text-ink-secondary'>{provision.location}</p>
          </div>
          <div>
            <p className='text-xs font-semibold text-ink'>Origin</p>
            <p className='type-small mt-0.5 text-ink-secondary'>{provision.origin}</p>
          </div>
          <div>
            <p className='text-xs font-semibold text-ink'>Timeframe</p>
            <p className='type-small mt-0.5 text-ink-secondary'>{provision.timeframe}</p>
          </div>
        </div>

        {provision.isDemo ? (
          <Badge variant='outline' className='w-fit text-ink-muted'>
            Illustrative demo entry
          </Badge>
        ) : null}
      </CardContent>
    </Card>
  );
}
