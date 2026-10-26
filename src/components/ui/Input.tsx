import type { InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import { controlStyles } from './controlStyles';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(controlStyles, className)} {...props} />;
}
