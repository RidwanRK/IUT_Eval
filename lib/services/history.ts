import type { Course, Instructor, Semester, TeachingAssignment, WindowType } from '@/lib/types';
import { getNow } from './clock';
import { requireProfile } from './profile';
import { getReceipts } from './receipts';
import { getAssignmentContexts } from './teaching';
import { getWindowStatus } from './window-logic';

export interface HistoryWindow {
  type: WindowType;
  submitted: boolean;
  /** The window has closed, so answers can only be read. */
  closed: boolean;
}

export interface HistoryRow {
  assignment: TeachingAssignment;
  course: Course;
  instructor: Instructor;
  windows: Record<WindowType, HistoryWindow>;
}

export interface HistorySemester {
  semester: Semester;
  rows: HistoryRow[];
}

/** Past semesters, newest first. Shows what was submitted, never results or scores. */
export async function getHistory(): Promise<HistorySemester[]> {
  const [student, now, contexts] = await Promise.all([
    requireProfile(),
    getNow(),
    getAssignmentContexts(),
  ]);
  const receipts = await getReceipts(student.id);
  const submitted = new Set(receipts.map((r) => `${r.assignmentId}:${r.window}`));

  const bySemester = new Map<string, HistorySemester>();
  for (const ctx of contexts.filter((c) => !c.semester.isCurrent)) {
    let group = bySemester.get(ctx.semester.id);
    if (!group) {
      group = { semester: ctx.semester, rows: [] };
      bySemester.set(ctx.semester.id, group);
    }
    const windowInfo = (type: WindowType): HistoryWindow => ({
      type,
      submitted: submitted.has(`${ctx.assignment.id}:${type}`),
      closed: getWindowStatus(ctx.windows[type], now) === 'closed',
    });
    group.rows.push({
      assignment: ctx.assignment,
      course: ctx.course,
      instructor: ctx.instructor,
      windows: { midterm: windowInfo('midterm'), final: windowInfo('final') },
    });
  }

  return [...bySemester.values()]
    .sort((a, b) => b.semester.startsOn.localeCompare(a.semester.startsOn))
    .map((g) => ({
      ...g,
      rows: g.rows.sort((a, b) => a.course.code.localeCompare(b.course.code)),
    }));
}
