'use client';

import * as RadixSwitch from '@radix-ui/react-switch';
import { useId, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * A labelled switch row. The whole row is the tap target (48px tall at least),
 * and the label is tied to the control for screen readers.
 */
export function Switch({
  label,
  hint,
  checked,
  onCheckedChange,
  disabled,
  className,
}: {
  label: ReactNode;
  hint?: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  return (
    <div
      className={cn(
        'flex min-h-12 items-center justify-between gap-4 py-2',
        disabled && 'opacity-60',
        className,
      )}
    >
      <label htmlFor={id} className="flex-1 cursor-pointer text-[0.95rem] font-medium">
        {label}
        {hint && (
          <span id={hintId} className="text-muted mt-0.5 block text-sm font-normal">
            {hint}
          </span>
        )}
      </label>
      <RadixSwitch.Root
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-describedby={hint ? hintId : undefined}
        className="bg-control data-[state=checked]:bg-brand relative h-8 w-14 shrink-0 cursor-pointer rounded-full transition-colors duration-150 disabled:cursor-not-allowed"
      >
        <RadixSwitch.Thumb className="block size-6 translate-x-1 rounded-full bg-white shadow transition-transform duration-150 data-[state=checked]:translate-x-7" />
      </RadixSwitch.Root>
    </div>
  );
}
