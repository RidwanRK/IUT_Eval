'use client';

import * as Popover from '@radix-ui/react-popover';
import { Bell } from 'lucide-react';
import { useState } from 'react';
import { copy } from '@/config/copy';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { useMediaQuery } from '@/lib/hooks/use-media-query';
import { useService } from '@/lib/hooks/use-service';
import { getNotifications, markNotificationsRead } from '@/lib/services/notifications';
import { cn } from '@/lib/utils';
import { NotificationList } from './notification-list';

const t = copy.notifications;

/**
 * Bell with an unread count. Opens a popover on desktop and a bottom sheet on phones.
 * Opening marks the reminders as read; the ones that were new stay highlighted until it closes.
 */
export function NotificationBell() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const { data } = useService(getNotifications);
  const [open, setOpen] = useState(false);
  const [highlightIds, setHighlightIds] = useState<ReadonlySet<string>>(new Set());

  const notifications = data ?? [];
  const unread = notifications.filter((n) => !n.read).length;

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
      setHighlightIds(new Set(unreadIds));
      void markNotificationsRead(unreadIds);
    } else {
      setHighlightIds(new Set());
    }
  }

  const trigger = (
    <button
      type="button"
      aria-label={t.bell(unread)}
      className={cn(
        'hover:bg-sunken relative flex size-12 shrink-0 items-center justify-center rounded-full transition-colors',
      )}
      onClick={isDesktop ? undefined : () => onOpenChange(true)}
    >
      <Bell className="size-6" aria-hidden />
      {unread > 0 && (
        <span
          aria-hidden
          className="bg-brand tabular absolute top-1.5 right-1.5 flex min-w-5 items-center justify-center rounded-full px-1 text-xs leading-5 font-bold text-white ring-2 ring-white"
        >
          {unread}
        </span>
      )}
    </button>
  );

  const list = (
    <NotificationList
      notifications={notifications}
      highlightIds={highlightIds}
      onNavigate={() => onOpenChange(false)}
    />
  );

  if (isDesktop) {
    return (
      <Popover.Root open={open} onOpenChange={onOpenChange}>
        <Popover.Trigger asChild>{trigger}</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="end"
            sideOffset={8}
            className="rounded-card border-line bg-surface shadow-raised data-[state=open]:animate-fade-in z-50 max-h-[70dvh] w-[24rem] overflow-y-auto border p-3"
          >
            <h2 className="px-3 pt-1 pb-2 text-lg font-bold tracking-tight">{t.title}</h2>
            {list}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  }

  return (
    <>
      {trigger}
      <BottomSheet
        open={open}
        onOpenChange={onOpenChange}
        title={t.title}
        description={t.description}
      >
        {list}
      </BottomSheet>
    </>
  );
}
