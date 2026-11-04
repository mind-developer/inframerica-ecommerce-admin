'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { buttonStyles } from './buttonStyles';
import { useReadOnly } from './ReadOnly';

/** Square icon button; `label` is required because the icon alone has no accessible name. */
export function IconButton({
  label,
  children,
  className,
  type = 'button',
  safeInReadOnly,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  children: ReactNode;
  /** Changes nothing, so it stays on read-only screens. */
  safeInReadOnly?: boolean;
}) {
  const readOnly = useReadOnly();
  if (readOnly && !safeInReadOnly) return null;
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={buttonStyles({ variant: 'outline', size: 'icon', className })}
      {...props}
    >
      {children}
    </button>
  );
}
