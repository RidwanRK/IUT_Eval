/**
 * Resolves what the student can give feedback on: every teaching assignment in the
 * offerings they are enrolled in, with its course, teacher, semester and two windows.
 * A real backend would return this from one call.
 */
import { getCatalog } from '@/lib/mock/catalog';
import type {
  Course,
  CourseOffering,
  FeedbackWindow,
  Instructor,
  Semester,
  TeachingAssignment,
  WindowType,
} from '@/lib/types';
import { getEnrollments } from './enrollments';

export interface AssignmentContext {
  assignment: TeachingAssignment;
  offering: CourseOffering;
  course: Course;
  instructor: Instructor;
  semester: Semester;
  windows: Record<WindowType, FeedbackWindow>;
}

export async function getAssignmentContexts(): Promise<AssignmentContext[]> {
  const catalog = getCatalog();
  const enrollments = await getEnrollments();
  const contexts: AssignmentContext[] = [];

  for (const enrollment of enrollments) {
    const offering = catalog.offerings[enrollment.offeringId];
    if (!offering) continue;
    const course = catalog.courses[offering.courseId];
    const semester = catalog.semesters.find((s) => s.id === offering.semesterId);
    const midterm = catalog.windows[`win-${offering.id}-midterm`];
    const final = catalog.windows[`win-${offering.id}-final`];
    if (!course || !semester || !midterm || !final) continue;

    for (const assignmentId of catalog.assignmentsByOffering[offering.id] ?? []) {
      const assignment = catalog.assignments[assignmentId];
      const instructor = assignment ? catalog.instructors[assignment.instructorId] : undefined;
      if (!assignment || !instructor) continue;
      contexts.push({
        assignment,
        offering,
        course,
        instructor,
        semester,
        windows: { midterm, final },
      });
    }
  }
  return contexts;
}

/** Null when the assignment does not exist or the student is not enrolled in it. */
export async function getAssignmentContext(
  assignmentId: string,
): Promise<AssignmentContext | null> {
  const all = await getAssignmentContexts();
  return all.find((c) => c.assignment.id === assignmentId) ?? null;
}
