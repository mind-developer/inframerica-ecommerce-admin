import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { buttonStyles } from './buttonStyles';

/** Square icon button; `label` is required because the icon alone has no accessible name. */
export function IconButton({
  label,
  children,
  className,
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; children: ReactNode }) {
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
