import { describe, expect, it } from 'vitest';
import { resolveAction, type CourseCard, type WindowLine } from '@/lib/services/dashboard';
import { summarizeDashboard } from '@/lib/services/dashboard-summary';
import type { WindowType } from '@/lib/types';

describe('resolveAction', () => {
  it('upcoming has no action', () => {
    expect(resolveAction('upcoming', false, false)).toBe('upcoming');
  });

  it('open: start, continue or edit', () => {
    expect(resolveAction('open', false, false)).toBe('start');
    expect(resolveAction('open', false, true)).toBe('continue');
    expect(resolveAction('open', true, false)).toBe('edit');
    // A sent response wins over a leftover draft.
    expect(resolveAction('open', true, true)).toBe('edit');
  });

  it('closed: view answers, or a quiet "missed"', () => {
    expect(resolveAction('closed', true, false)).toBe('view');
    expect(resolveAction('closed', false, false)).toBe('missed');
    expect(resolveAction('closed', false, true)).toBe('missed');
  });
});

function line(
  type: WindowType,
  action: WindowLine['action'],
  opensAt = '2026-10-12T00:00:00Z',
): WindowLine {
  const status =
    action === 'upcoming'
      ? 'upcoming'
      : action === 'view' || action === 'missed'
        ? 'closed'
        : 'open';
  return {
    type,
    status,
    action,
    receipt: null,
    draft: null,
    estimateMinutes: 4,
    window: { id: 'w', offeringId: 'o', type, opensAt, closesAt: '2026-12-28T00:00:00Z' },
  };
}

function card(id: string, midterm: WindowLine['action'], final: WindowLine['action']): CourseCard {
  const needs = [midterm, final].some((a) => a === 'start' || a === 'continue');
  return {
    offering: { id, courseId: id, semesterId: 's' },
    course: { id, code: id, title: id, department: 'CSE', credits: 3 },
    needsFeedback: needs,
    rows: [
      {
        assignment: { id: `${id}-a`, offeringId: id, instructorId: 'i', role: 'theory' },
        instructor: { id: 'i', name: 'X', department: 'CSE' },
        lines: { midterm: line('midterm', midterm), final: line('final', final) },
      },
    ],
  };
}

describe('summarizeDashboard', () => {
  it('counts courses that are waiting', () => {
    const summary = summarizeDashboard([
      card('A', 'start', 'upcoming'),
      card('B', 'continue', 'upcoming'),
      card('C', 'edit', 'upcoming'),
    ]);
    expect(summary).toEqual({ kind: 'open', courses: 2, minutes: 4 });
  });

  it('is caught up when everything open has been sent', () => {
    expect(summarizeDashboard([card('A', 'edit', 'upcoming')])).toEqual({ kind: 'caught-up' });
  });

  it('shows the next opening date when nothing is open', () => {
    const a = card('A', 'view', 'upcoming');
    a.rows[0]!.lines.final.window.opensAt = '2026-12-14T00:00:00Z';
    const b = card('B', 'missed', 'upcoming');
    b.rows[0]!.lines.final.window.opensAt = '2026-12-10T00:00:00Z';
    expect(summarizeDashboard([a, b])).toEqual({
      kind: 'nothing-open',
      nextOpensAt: '2026-12-10T00:00:00Z',
    });
  });

  it('says closed, without counting what was missed, when the semester is over', () => {
    expect(summarizeDashboard([card('A', 'view', 'missed')])).toEqual({ kind: 'closed' });
  });
});
