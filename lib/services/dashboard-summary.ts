import type { CourseCard, WindowLine } from './dashboard';

export type DashboardSummary =
  | { kind: 'open'; courses: number; minutes: number }
  | { kind: 'caught-up' }
  | { kind: 'nothing-open'; nextOpensAt: string }
  | { kind: 'closed' };

/**
 * The calm one-line summary at the top of the dashboard. Pure, so it is easy to test.
 * It never counts what a student missed.
 */
export function summarizeDashboard(courses: readonly CourseCard[]): DashboardSummary {
  const lines: WindowLine[] = courses.flatMap((c) =>
    c.rows.flatMap((r) => [r.lines.midterm, r.lines.final]),
  );

  const waiting = lines.filter((l) => l.action === 'start' || l.action === 'continue');
  if (waiting.length > 0) {
    const waitingCourses = courses.filter((c) => c.needsFeedback).length;
    const minutes = Math.max(...waiting.map((l) => l.estimateMinutes));
    return { kind: 'open', courses: waitingCourses, minutes };
  }

  if (lines.some((l) => l.status === 'open')) return { kind: 'caught-up' };

  const upcoming = lines
    .filter((l) => l.status === 'upcoming')
    .map((l) => l.window.opensAt)
    .sort();
  if (upcoming[0]) return { kind: 'nothing-open', nextOpensAt: upcoming[0] };

  return { kind: 'closed' };
}
