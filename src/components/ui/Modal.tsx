'use client';

import { X } from 'lucide-react';
import { useEffect, useId, useRef, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  size?: 'md' | 'lg' | 'xl';
  footer?: ReactNode;
  children?: ReactNode;
}

const SIZES = { md: 'sm:max-w-lg', lg: 'sm:max-w-2xl', xl: 'sm:max-w-4xl' };

/**
 * Controlled modal on the native <dialog>: the browser handles focus trapping, Escape and focus restore.
 * Centred from `sm` up; a bottom sheet on phones.
 */
export function Modal({ open, onClose, title, description, size = 'md', footer, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClose={() => open && onClose()}
      onClick={(e) => e.target === ref.current && onClose()}
      className={cn(
        'm-auto max-h-[min(90dvh,860px)] w-[calc(100%-32px)] overflow-hidden rounded-2xl border border-border bg-card p-0 text-card-foreground shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm',
        'max-sm:mx-0 max-sm:mt-auto max-sm:mb-0 max-sm:w-full max-sm:max-w-none max-sm:rounded-b-none max-sm:pb-[env(safe-area-inset-bottom)]',
        SIZES[size],
        open && 'flex animate-fade-in flex-col',
      )}
    >
      {open && (
        <>
          <header className="flex items-start gap-3 border-b border-border px-5 py-4">
            <div className="min-w-0 flex-1">
              <h2 id={titleId} className="font-heading text-lg leading-snug font-semibold">
                {title}
              </h2>
              {description && <div className="mt-1 text-sm text-muted-foreground">{description}</div>}
            </div>
            <button
              type="button"
              aria-label="Fechar"
              onClick={onClose}
              className="-mt-1 -mr-2 rounded-md p-2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </header>
          {children && <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 text-sm">{children}</div>}
          {footer && (
            <footer className="flex flex-wrap justify-end gap-2 border-t border-border px-5 py-3.5 max-sm:[&>*]:flex-1">
              {footer}
            </footer>
          )}
        </>
      )}
    </dialog>
  );
}
