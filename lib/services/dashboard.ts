import type {
  Course,
  CourseOffering,
  FeedbackWindow,
  Instructor,
  Semester,
  Student,
  SubmissionReceipt,
  TeachingAssignment,
  WindowStatus,
  WindowType,
} from '@/lib/types';
import { getNow } from './clock';
import { getAllDrafts } from './drafts';
import { getEstimatedMinutes, getQuestionCount } from './estimates';
import { requireProfile } from './profile';
import { getReceipts } from './receipts';
import { getAssignmentContexts } from './teaching';
import { getWindowStatus } from './window-logic';

/**
 * What a window line should show:
 * - upcoming: no action, just when it opens
 * - start / continue: open and not yet sent
 * - edit: sent, and the window is still open
 * - view: sent, and the window has closed
 * - missed: closed and nothing sent (shown quietly, no shaming)
 */
export type WindowAction = 'upcoming' | 'start' | 'continue' | 'edit' | 'view' | 'missed';

export interface WindowLine {
  window: FeedbackWindow;
  type: WindowType;
  status: WindowStatus;
  action: WindowAction;
  receipt: SubmissionReceipt | null;
  draft: { answered: number; total: number } | null;
  estimateMinutes: number;
}

export interface AssignmentRow {
  assignment: TeachingAssignment;
  instructor: Instructor;
  lines: Record<WindowType, WindowLine>;
}

export interface CourseCard {
  offering: CourseOffering;
  course: Course;
  rows: AssignmentRow[];
  /** At least one line is waiting for the student (start or continue). */
  needsFeedback: boolean;
}

export interface Dashboard {
  student: Student;
  semester: Semester | null;
  now: Date;
  courses: CourseCard[];
}

export function resolveAction(
  status: WindowStatus,
  hasReceipt: boolean,
  hasDraft: boolean,
): WindowAction {
  if (status === 'upcoming') return 'upcoming';
  if (status === 'open') {
    if (hasReceipt) return 'edit';
    return hasDraft ? 'continue' : 'start';
  }
  return hasReceipt ? 'view' : 'missed';
}

export async function getDashboard(): Promise<Dashboard> {
  const [student, now, contexts, drafts] = await Promise.all([
    requireProfile(),
    getNow(),
    getAssignmentContexts(),
    getAllDrafts(),
  ]);
  const receipts = await getReceipts(student.id);

  const receiptByKey = new Map(receipts.map((r) => [`${r.assignmentId}:${r.window}`, r]));
  const draftByKey = new Map(drafts.map((d) => [`${d.assignmentId}:${d.window}`, d]));

  const current = contexts.filter((c) => c.semester.isCurrent);
  const semester = current[0]?.semester ?? null;

  const cards = new Map<string, CourseCard>();
  for (const ctx of current) {
    let card = cards.get(ctx.offering.id);
    if (!card) {
      card = { offering: ctx.offering, course: ctx.course, rows: [], needsFeedback: false };
      cards.set(ctx.offering.id, card);
    }

    const makeLine = (type: WindowType): WindowLine => {
      const window = ctx.windows[type];
      const key = `${ctx.assignment.id}:${type}`;
      const receipt = receiptByKey.get(key) ?? null;
      const draft = draftByKey.get(key);
      const answered = draft ? Object.keys(draft.answers).length : 0;
      const status = getWindowStatus(window, now);
      return {
        window,
        type,
        status,
        action: resolveAction(status, receipt !== null, answered > 0),
        receipt,
        draft: answered > 0 ? { answered, total: getQuestionCount(type) } : null,
        estimateMinutes: getEstimatedMinutes(type),
      };
    };

    const row: AssignmentRow = {
      assignment: ctx.assignment,
      instructor: ctx.instructor,
      lines: { midterm: makeLine('midterm'), final: makeLine('final') },
    };
    card.rows.push(row);
    if (
      [row.lines.midterm, row.lines.final].some(
        (l) => l.action === 'start' || l.action === 'continue',
      )
    ) {
      card.needsFeedback = true;
    }
  }

  // Courses that need feedback first. After that, open items already sent (editable), then the rest.
  const rank = (card: CourseCard): number => {
    if (card.needsFeedback) return 0;
    const lines = card.rows.flatMap((r) => [r.lines.midterm, r.lines.final]);
    if (lines.some((l) => l.action === 'edit')) return 1;
    if (lines.some((l) => l.action === 'upcoming')) return 2;
    return 3;
  };
  const courses = [...cards.values()].sort(
    (a, b) => rank(a) - rank(b) || a.course.code.localeCompare(b.course.code),
  );

  return { student, semester, now, courses };
}
