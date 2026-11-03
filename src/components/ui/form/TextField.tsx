'use client';

import { Lock, LockOpen, type LucideIcon } from 'lucide-react';
import { useState, type HTMLAttributes, type HTMLInputTypeAttribute, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { firstError } from '@/utils/formErrors';
import { controlStyles } from '../controlStyles';
import { Field } from '../Field';
import { useFieldContext } from './formContext';

export interface TextFieldProps {
  label?: ReactNode;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  required?: boolean;
  help?: ReactNode;
  icon?: LucideIcon;
  autoComplete?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
  inputClassName?: string;
  className?: string;
  onBlur?: (value: string) => void;
  /** Password fields only: the lock icon becomes a button that shows the password (open lock while shown). */
  revealable?: boolean;
}

export function TextField({
  label,
  type = 'text',
  icon: Icon,
  onBlur,
  inputClassName,
  className,
  help,
  required,
  revealable,
  ...rest
}: TextFieldProps) {
  const [revealed, setRevealed] = useState(false);
  const canReveal = revealable && type === 'password';
  const field = useFieldContext<string>();
  const id = `field-${field.name}`;
  const error = field.state.meta.isTouched ? firstError(field.state.meta.errors) : undefined;
  return (
    <Field id={id} label={label} required={required} error={error} help={help} className={className}>
      <div className="relative">
        {canReveal ? (
          <RevealButton revealed={revealed} onToggle={() => setRevealed(!revealed)} />
        ) : (
          Icon && <Icon aria-hidden className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <input
          id={id}
          name={field.name}
          type={canReveal && revealed ? 'text' : type}
          value={field.state.value ?? ''}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={() => {
            field.handleBlur();
            onBlur?.(field.state.value);
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-label={typeof label === 'string' ? undefined : rest.placeholder}
          required={required}
          className={cn(controlStyles, (Icon || canReveal) && 'pl-10', inputClassName)}
          {...rest}
        />
      </div>
    </Field>
  );
}

function RevealButton({ revealed, onToggle }: { revealed: boolean; onToggle: () => void }) {
  const Icon = revealed ? LockOpen : Lock;
  return (
    <button
      type="button"
      tabIndex={-1}
      onClick={onToggle}
      aria-label={revealed ? 'Ocultar senha' : 'Mostrar senha'}
      aria-pressed={revealed}
      className="absolute top-1/2 left-1 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <Icon aria-hidden className="size-4" />
    </button>
  );
}
