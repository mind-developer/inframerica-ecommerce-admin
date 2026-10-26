import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export function Spinner({ className, label = 'Carregando…' }: { className?: string; label?: string }) {
  return (
    <span role="status" aria-live="polite" className="inline-flex">
      <Loader2 aria-hidden className={cn('size-6 animate-spin text-primary', className)} />
      <span className="sr-only">{label}</span>
    </span>
  );
}
