import { AlertCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface FieldProps {
  id: string;
  label?: ReactNode;
  required?: boolean;
  error?: string;
  help?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** Label, control, then help and error. Link the control with aria-describedby={`${id}-error`}. */
export function Field({ id, label, required, error, help, className, children }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-foreground">
          {label}
          {required && (
            <span aria-hidden className="text-destructive">
              {' '}
              *
            </span>
          )}
        </label>
      )}
      {children}
      {help && <span className="text-[11px] text-muted-foreground">{help}</span>}
      <ErrorMessage id={`${id}-error`} error={error} />
    </div>
  );
}

export function ErrorMessage({ error, id, className }: { error?: string; id?: string; className?: string }) {
  if (!error) return null;
  return (
    <p id={id} role="alert" className={cn('flex items-center gap-1 text-xs text-destructive', className)}>
      <AlertCircle aria-hidden className="size-3.5" />
      {error}
    </p>
  );
}
