import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'violet' | 'gold' | 'primary';

export const TONE_STYLES: Record<Tone, string> = {
  neutral: 'bg-muted text-muted-foreground border-border',
  success: 'bg-success-soft text-success border-success-border',
  warning: 'bg-warning-soft text-warning border-warning-border',
  danger: 'bg-danger-soft text-danger border-danger-border',
  info: 'bg-info-soft text-info border-info-border',
  violet: 'bg-violet-soft text-violet border-violet/20',
  gold: 'bg-gold/15 text-gold border-gold/30',
  primary: 'bg-primary text-primary-foreground border-transparent',
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap',
        TONE_STYLES[tone],
        className,
      )}
      {...props}
    />
  );
}
