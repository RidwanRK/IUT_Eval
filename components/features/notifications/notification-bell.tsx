'use client';

import { Bell } from 'lucide-react';
import { copy } from '@/config/copy';
import { IconButton } from '@/components/ui/button';

/** Placeholder. The real bell, with unread count and list, is built in Stage 2. */
export function NotificationBell() {
  return (
    <IconButton label={copy.nav.notifications} variant="ghost">
      <Bell className="size-6" aria-hidden />
    </IconButton>
  );
}
