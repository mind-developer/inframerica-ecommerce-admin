'use client';

import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useToastStore, type ToastKind } from './toastStore';

const KIND: Record<ToastKind, { Icon: typeof Info; className: string }> = {
  info: { Icon: Info, className: 'text-info' },
  success: { Icon: CheckCircle2, className: 'text-success' },
  warning: { Icon: AlertTriangle, className: 'text-warning' },
  error: { Icon: XCircle, className: 'text-destructive' },
};

/** Mount once at the root. Bottom-centre on phones, bottom-right on desktop; announced politely. */
export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[110] flex flex-col items-center gap-2 p-4 pb-[max(16px,env(safe-area-inset-bottom))] lg:items-end"
    >
      {toasts.map(({ id, title, message, kind }) => {
        const { Icon, className } = KIND[kind];
        return (
          <div
            key={id}
            role="status"
            className="pointer-events-auto flex w-full max-w-sm animate-fade-up items-start gap-3 rounded-xl border border-border bg-card py-3 pr-1 pl-4 shadow-xl"
          >
            <Icon aria-hidden className={cn('mt-0.5 size-4 flex-none', className)} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{title}</p>
              {message && <p className="text-xs text-muted-foreground">{message}</p>}
            </div>
            <button
              type="button"
              aria-label="Fechar aviso"
              onClick={() => dismiss(id)}
              className="-my-1 rounded-md p-2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
