'use client';

import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { copy } from '@/config/copy';
import { cn } from '@/lib/utils';
import { IconButton } from './button';

/**
 * A centred dialog. Title and description are required so it always has an accessible
 * name. Radix traps focus, closes on Escape and restores focus when it closes.
 */
export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="bg-ink/40 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in fixed inset-0 z-50" />
        <RadixDialog.Content
          className={cn(
            'rounded-card bg-surface shadow-raised data-[state=closed]:animate-fade-out data-[state=open]:animate-pop-in fixed top-1/2 left-1/2 z-50 max-h-[85dvh] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto p-6',
            className,
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <RadixDialog.Title className="text-xl font-bold tracking-tight">
              {title}
            </RadixDialog.Title>
            <RadixDialog.Close asChild>
              <IconButton label={copy.common.close} className="-mt-2 -mr-2">
                <X className="size-5" aria-hidden />
              </IconButton>
            </RadixDialog.Close>
          </div>
          <RadixDialog.Description className="text-muted mt-2 text-[0.95rem]">
            {description}
          </RadixDialog.Description>
          {children && <div className="mt-4">{children}</div>}
          {footer && (
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              {footer}
            </div>
          )}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
