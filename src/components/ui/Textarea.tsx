import type { TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import { controlStyles } from './controlStyles';

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(controlStyles, 'h-auto min-h-20', className)} {...props} />;
}
