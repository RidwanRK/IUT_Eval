'use client';

import { History, House, Settings, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { copy } from '@/config/copy';
import { institution } from '@/config/institution';
import { NotificationBell } from '@/components/features/notifications/notification-bell';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { BrandMark } from './brand-mark';
import { OfflineNotice } from './offline-notice';
import { useStudent } from './student-context';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Exact match for home, prefix match for the rest. */
  exact?: boolean;
}

const NAV: NavItem[] = [
  { href: '/student', label: copy.nav.home, icon: House, exact: true },
  { href: '/student/history', label: copy.nav.history, icon: History },
  { href: '/student/settings', label: copy.nav.settings, icon: Settings },
];

function isActive(pathname: string, item: NavItem) {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

/**
 * Mobile: top bar (logo and bell) plus a bottom tab bar with safe-area padding.
 * Desktop (lg and up): left sidebar with the same three destinations.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const student = useStudent();

  return (
    <div className="min-h-dvh">
      <a
        href="#main"
        className="rounded-control bg-surface sr-only z-[70] px-4 py-3 font-semibold focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {copy.nav.skipToContent}
      </a>

      {/* Desktop sidebar */}
      <aside className="border-line bg-surface fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r px-4 py-6 lg:flex">
        <Link href="/student" className="px-2" aria-label={institution.appName}>
          <BrandMark />
        </Link>
        <nav aria-label={copy.nav.primaryLabel} className="mt-8 flex flex-col gap-1">
          {NAV.map((item) => {
            const active = isActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-control flex min-h-12 items-center gap-3 px-3 font-semibold transition-colors',
                  active ? 'bg-brand-50 text-brand' : 'text-ink hover:bg-sunken',
                )}
              >
                <item.icon className="size-5" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/student/settings"
          className="rounded-control hover:bg-sunken mt-auto flex items-center gap-3 p-2"
        >
          <Avatar avatar={student.avatar} name={student.displayName} />
          <span className="min-w-0">
            <span className="block truncate font-semibold">{student.displayName}</span>
            <span className="text-muted block text-sm">{student.department}</span>
          </span>
        </Link>
      </aside>

      <div className="lg:pl-64">
        {/* Top bar */}
        <header
          className="border-line bg-surface/90 sticky top-0 z-20 border-b backdrop-blur"
          style={{ paddingTop: 'var(--safe-top)' }}
        >
          <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:justify-end lg:px-8">
            <Link href="/student" className="lg:hidden" aria-label={institution.appName}>
              <BrandMark />
            </Link>
            <NotificationBell />
          </div>
        </header>

        <main
          id="main"
          tabIndex={-1}
          className="mx-auto max-w-5xl px-4 pt-6 pb-[calc(var(--tabbar-height)+var(--safe-bottom)+1.5rem)] outline-none sm:px-6 sm:pt-8 lg:px-8 lg:pb-12"
        >
          <OfflineNotice />
          {children}
        </main>
      </div>

      {/* Mobile tab bar */}
      <nav
        aria-label={copy.nav.primaryLabel}
        className="border-line bg-surface fixed inset-x-0 bottom-0 z-30 border-t lg:hidden"
        style={{ paddingBottom: 'var(--safe-bottom)' }}
      >
        <ul
          className="mx-auto grid max-w-lg grid-cols-3"
          style={{ height: 'var(--tabbar-height)' }}
        >
          {NAV.map((item) => {
            const active = isActive(pathname, item);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex h-full min-h-12 flex-col items-center justify-center gap-1 text-xs font-semibold transition-colors',
                    active ? 'text-brand' : 'text-muted',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-8 w-14 items-center justify-center rounded-full transition-colors',
                      active && 'bg-brand-50',
                    )}
                  >
                    <item.icon className="size-6" aria-hidden />
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
