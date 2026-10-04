'use client';

import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { copy } from '@/config/copy';
import { cn } from '@/lib/utils';
import { IconButton } from './button';

/**
 * A sheet that slides up from the bottom, for phones. It is a Radix dialog underneath,
 * so focus is trapped, Escape closes it, and it is announced with its title.
 */
export function BottomSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  /** Short description for screen readers. */
  description: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="bg-ink/40 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in fixed inset-0 z-50" />
        <RadixDialog.Content
          className={cn(
            'bg-surface shadow-raised data-[state=closed]:animate-sheet-out data-[state=open]:animate-sheet-in fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[85dvh] w-full max-w-lg flex-col rounded-t-[1.75rem]',
            className,
          )}
        >
          <div
            className="bg-line-strong mx-auto mt-3 h-1.5 w-10 shrink-0 rounded-full"
            aria-hidden
          />
          <div className="flex items-center justify-between gap-3 px-5 pt-3 pb-2">
            <RadixDialog.Title className="text-lg font-bold tracking-tight">
              {title}
            </RadixDialog.Title>
            <RadixDialog.Close asChild>
              <IconButton label={copy.common.close} className="-mr-2">
                <X className="size-5" aria-hidden />
              </IconButton>
            </RadixDialog.Close>
          </div>
          <RadixDialog.Description className="sr-only">{description}</RadixDialog.Description>
          <div
            className="min-h-0 flex-1 overflow-y-auto px-5 pt-1"
            style={{ paddingBottom: 'max(1.25rem, var(--safe-bottom))' }}
          >
            {children}
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
