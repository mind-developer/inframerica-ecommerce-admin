import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

/**
 * CSS-only tooltip shown on hover and keyboard focus. The trigger must be focusable; the text is also
 * exposed through aria-describedby so it never depends on hover alone.
 */
export function Tooltip({
  id,
  content,
  children,
  className,
}: {
  id: string;
  content: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn('group/tip relative inline-flex', className)}>
      {children}
      <span
        id={id}
        role="tooltip"
        className="invisible absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-xs -translate-x-1/2 rounded-md bg-primary px-3 py-2 text-xs font-normal text-primary-foreground opacity-0 shadow-lg transition-opacity group-focus-within/tip:visible group-focus-within/tip:opacity-100 group-hover/tip:visible group-hover/tip:opacity-100"
      >
        {content}
      </span>
    </span>
  );
}
