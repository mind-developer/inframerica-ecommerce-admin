'use client';

import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { firstError } from '@/utils/formErrors';
import { ErrorMessage } from '../Field';
import { useFieldContext } from './formContext';

/** Multi-select as a list of checkboxes (or pills), bound to a `string[]` field. */
export function CheckboxListField({
  label,
  options,
  help,
  variant = 'list',
}: {
  label: ReactNode;
  options: { value: string; label: string; title?: string }[];
  help?: (count: number) => ReactNode;
  variant?: 'list' | 'pills';
}) {
  const field = useFieldContext<string[]>();
  const selected = field.state.value ?? [];
  const toggle = (value: string) =>
    field.handleChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  const error = field.state.meta.isTouched ? firstError(field.state.meta.errors) : undefined;
  return (
    <fieldset>
      <legend className="text-xs font-medium text-foreground">{label}</legend>
      {variant === 'pills' ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {options.map((o) => {
            const on = selected.includes(o.value);
            return (
              <button
                key={o.value}
                type="button"
                title={o.title}
                aria-pressed={on}
                onClick={() => toggle(o.value)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  on
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-muted-foreground hover:border-primary/40',
                )}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-2 max-h-52 space-y-1 overflow-y-auto rounded-xl border border-border p-3">
          {options.map((o) => (
            <label
              key={o.value}
              className="flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-0.5 text-sm hover:bg-muted/40"
            >
              <input
                type="checkbox"
                checked={selected.includes(o.value)}
                onChange={() => toggle(o.value)}
                onBlur={field.handleBlur}
                className="size-4 accent-primary"
              />
              <span className="truncate">{o.label}</span>
            </label>
          ))}
        </div>
      )}
      {help && <p className="mt-1 text-xs text-muted-foreground">{help(selected.length)}</p>}
      <ErrorMessage error={error} className="mt-1" />
    </fieldset>
  );
}
