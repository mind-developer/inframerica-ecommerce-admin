'use client';

import type { ButtonHTMLAttributes } from 'react';
import { buttonStyles, type ButtonSize, type ButtonVariant } from './buttonStyles';
import { useReadOnly } from './ReadOnly';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({ variant, size, className, type = 'button', ...props }: ButtonProps) {
  const readOnly = useReadOnly();
  const acts = type === 'submit' || variant === 'accent' || variant === 'destructive';
  if (readOnly && acts) return null;
  return <button type={type} className={buttonStyles({ variant, size, className })} {...props} />;
}
