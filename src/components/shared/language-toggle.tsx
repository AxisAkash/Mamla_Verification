'use client';

import { useEffect, useState } from 'react';

import { LANGUAGE_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function LanguageToggle({ className }: { className?: string }) {
  const [language, setLanguage] = useState<'en' | 'bn'>('en');

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.classList.toggle('font-bangla', language === 'bn');
  }, [language]);

  return (
    <div
      role='group'
      aria-label='Language selector'
      className={cn(
        'inline-flex items-center rounded-full border border-border bg-card p-0.5',
        className
      )}
    >
      {LANGUAGE_OPTIONS.map((option) => (
        <button
          key={option.value}
          type='button'
          aria-pressed={language === option.value}
          onClick={() => setLanguage(option.value)}
          className={cn(
            'focus-ring min-h-10 rounded-full px-3 text-xs font-semibold transition-colors',
            language === option.value
              ? 'bg-brand text-white'
              : 'text-ink-secondary hover:text-ink'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
