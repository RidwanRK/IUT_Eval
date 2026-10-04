'use client';

import { WifiOff } from 'lucide-react';
import { copy } from '@/config/copy';
import { useOnlineStatus } from '@/lib/hooks/use-online-status';

/** A calm banner that only shows while the device is offline. Amber, with an icon and text. */
export function OfflineNotice() {
  const online = useOnlineStatus();
  if (online) return null;
  return (
    <div
      role="status"
      className="border-warn-line bg-warn-bg text-warn-ink mb-4 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium"
    >
      <WifiOff className="text-warn-icon mt-0.5 size-4 shrink-0" aria-hidden />
      {copy.offline.banner}
    </div>
  );
}
