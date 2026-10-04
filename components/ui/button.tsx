import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'soft' | 'ghost';
export type ButtonSize = 'md' | 'lg';

const base =
  'inline-flex select-none items-center justify-center gap-2 rounded-control font-semibold transition-[background-color,box-shadow,transform] duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 motion-reduce:active:scale-100';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white shadow-sm hover:bg-brand-hover active:bg-brand-pressed',
  secondary: 'border border-line-strong bg-surface text-ink hover:bg-sunken',
  soft: 'bg-brand-50 text-brand hover:bg-brand-100',
  ghost: 'text-ink hover:bg-sunken',
};

const sizes: Record<ButtonSize, string> = {
  // Both sizes keep a 48px minimum tap target.
  md: 'min-h-12 px-5 text-[0.95rem]',
  lg: 'min-h-14 px-6 text-base',
};

/** Class names for anything that should look like a button, such as a next/link. */
export function buttonStyles({
  variant = 'primary',
  size = 'md',
  block = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], block && 'w-full', className);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, block, loading, className, children, disabled, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonStyles({ variant, size, block, className })}
      {...props}
    >
      {loading && (
        <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden />
      )}
      {children}
    </button>
  );
});

/** Square icon-only button. `label` is required so it always has an accessible name. */
export const IconButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { label: string; variant?: ButtonVariant }
>(function IconButton(
  { label, variant = 'ghost', className, children, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      className={cn(base, variants[variant], 'size-12 shrink-0 rounded-full p-0', className)}
      {...props}
    >
      {children}
    </button>
  );
});
