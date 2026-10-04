/**
 * Pure window logic. No storage, no clock: pass `now` in. That keeps it easy to test and
 * means status is never hardcoded anywhere. Callers get `now` from getNow().
 */
import { copy } from '@/config/copy';
import { institution } from '@/config/institution';
import type { FeedbackWindow, WindowStatus, WindowType } from '@/lib/types';

type Timing = Pick<FeedbackWindow, 'opensAt' | 'closesAt'>;

/** upcoming before opensAt, open from opensAt until closesAt, closed from closesAt on. */
export function getWindowStatus(window: Timing, now: Date): WindowStatus {
  const t = now.getTime();
  if (t < new Date(window.opensAt).getTime()) return 'upcoming';
  if (t >= new Date(window.closesAt).getTime()) return 'closed';
  return 'open';
}

const dayFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: institution.timeZone,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const shortFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: institution.timeZone,
  day: 'numeric',
  month: 'short',
});

/** Whole calendar days since 1970, in the university's time zone. */
function dayNumber(date: Date): number {
  const [y, m, d] = dayFormat.format(date).split('-').map(Number) as [number, number, number];
  return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
}

/** Calendar days from `from` to `to`, in the university's time zone. Negative if in the past. */
export function calendarDaysBetween(from: Date, to: Date): number {
  return dayNumber(to) - dayNumber(from);
}

/** "12 Oct" */
export function formatShortDate(value: Date | string): string {
  return shortFormat.format(typeof value === 'string' ? new Date(value) : value);
}

/** Calendar days until the window closes (0 means it closes today). */
export function daysUntilClose(window: Timing, now: Date): number {
  return calendarDaysBetween(now, new Date(window.closesAt));
}

/** "Closes in 5 days", "Closes tomorrow", "Closes today". For open windows. */
export function closesText(window: Timing, now: Date): string {
  const days = daysUntilClose(window, now);
  if (days <= 0) return copy.windows.closesToday;
  if (days === 1) return copy.windows.closesTomorrow;
  return copy.windows.closesInDays(days);
}

/** A friendly line for any window: opens, closes or closed text depending on status. */
export function describeWindow(window: Timing & { type: WindowType }, now: Date): string {
  switch (getWindowStatus(window, now)) {
    case 'upcoming':
      return copy.windows.opensAfter[window.type](formatShortDate(window.opensAt));
    case 'open':
      return closesText(window, now);
    case 'closed':
      return copy.windows.closedOn(formatShortDate(window.closesAt));
  }
}

/** "You can change this until 26 Oct" */
export function editableUntilText(window: Timing): string {
  return copy.windows.canChangeUntil(formatShortDate(window.closesAt));
}

/** True when an open window closes today or tomorrow. */
export function isClosingSoon(window: Timing, now: Date): boolean {
  return getWindowStatus(window, now) === 'open' && daysUntilClose(window, now) <= 1;
}

/** "2026-10-25" in the university's time zone. Used where only the date should be stored. */
export function toDateOnly(date: Date): string {
  return dayFormat.format(date);
}
