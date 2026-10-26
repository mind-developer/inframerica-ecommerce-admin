import { cn } from '@/utils/cn';

export type ButtonVariant = 'primary' | 'accent' | 'gold' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

const base =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:shrink-0';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  accent: 'bg-accent text-accent-foreground font-semibold hover:bg-accent/90',
  gold: 'gradient-gold text-accent-foreground font-semibold hover:opacity-90',
  outline: 'border border-input bg-background hover:bg-muted',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  ghost: 'hover:bg-muted',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  link: 'text-gold underline-offset-4 hover:underline',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3',
  md: 'h-10 px-4 py-2 pointer-coarse:min-h-11',
  lg: 'h-11 px-8',
  icon: 'size-10',
};

/** Shared by <Button> and links styled as buttons. */
export const buttonStyles = ({
  variant = 'primary',
  size = 'md',
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) =>
  cn(base, variants[variant], sizes[size], className);
