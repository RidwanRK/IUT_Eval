import { Check, Clock, Lock, PencilLine, Unlock } from 'lucide-react';
import { copy } from '@/config/copy';
import { Badge } from '@/components/ui/badge';
import type { WindowLine } from '@/lib/services/dashboard';

/** Status of one window line. Always icon plus text, never colour alone. */
export function StatusChip({ line }: { line: WindowLine }) {
  const iconClass = 'size-3.5';
  switch (line.action) {
    case 'upcoming':
      return (
        <Badge icon={<Clock className={iconClass} aria-hidden />}>
          {copy.windows.status.upcoming}
        </Badge>
      );
    case 'start':
      return (
        <Badge tone="brand" icon={<Unlock className={iconClass} aria-hidden />}>
          {copy.windows.status.open}
        </Badge>
      );
    case 'continue':
      return (
        <Badge tone="brand" icon={<PencilLine className={iconClass} aria-hidden />}>
          {copy.dashboard.chips.draft}
        </Badge>
      );
    case 'edit':
    case 'view':
      return (
        <Badge tone="success" icon={<Check className={iconClass} strokeWidth={3} aria-hidden />}>
          {copy.dashboard.chips.submitted}
        </Badge>
      );
    case 'missed':
      return (
        <Badge icon={<Lock className={iconClass} aria-hidden />}>
          {copy.windows.status.closed}
        </Badge>
      );
  }
}
