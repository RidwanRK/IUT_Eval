/**
 * Mock catalog: semesters, courses, instructors, offerings, teaching assignments and
 * feedback windows. A real backend (registrar feed) replaces this whole module.
 *
 * Dates are fixed on purpose. The app's "now" comes from getNow() in the services layer,
 * and the prototype scenario picker moves it around these dates.
 */
import { institution } from '@/config/institution';
import { specForDepartment } from '@/lib/prototype/department-sets';
import type {
  Course,
  CourseOffering,
  DepartmentCode,
  FeedbackWindow,
  Instructor,
  Semester,
  TeachingAssignment,
} from '@/lib/types';
import type { CourseSpec, DepartmentSpec } from './specs';

/** Bangladesh time (UTC+6). Builds an ISO string for a local date and time. */
function dhaka(y: number, m: number, d: number, h = 0, mi = 0, s = 0): string {
  return new Date(Date.UTC(y, m - 1, d, h - 6, mi, s)).toISOString();
}

interface SemesterPlan {
  semester: Semester;
  key: keyof DepartmentSpec;
  midterm: { open: [number, number, number]; close: [number, number, number] };
  final: { open: [number, number, number]; close: [number, number, number] };
}

const { current, past } = institution.semesters;

const SEMESTER_PLANS: SemesterPlan[] = [
  {
    semester: {
      id: current.id,
      label: current.label,
      startsOn: dhaka(2026, 8, 9),
      endsOn: dhaka(2027, 1, 5, 23, 59, 59),
      isCurrent: true,
    },
    key: 'fall2026',
    midterm: { open: [2026, 10, 12], close: [2026, 10, 26] },
    final: { open: [2026, 12, 14], close: [2026, 12, 28] },
  },
  {
    semester: {
      id: past[0].id,
      label: past[0].label,
      startsOn: dhaka(2026, 2, 1),
      endsOn: dhaka(2026, 7, 5, 23, 59, 59),
      isCurrent: false,
    },
    key: 'spring2026',
    midterm: { open: [2026, 3, 10], close: [2026, 3, 24] },
    final: { open: [2026, 6, 15], close: [2026, 6, 29] },
  },
  {
    semester: {
      id: past[1].id,
      label: past[1].label,
      startsOn: dhaka(2025, 8, 10),
      endsOn: dhaka(2026, 1, 8, 23, 59, 59),
      isCurrent: false,
    },
    key: 'fall2025',
    midterm: { open: [2025, 10, 13], close: [2025, 10, 27] },
    final: { open: [2025, 12, 15], close: [2025, 12, 29] },
  },
];

/** The date the app starts on before anyone picks a demo scenario: midterm window open. */
export const MOCK_DEFAULT_NOW = dhaka(2026, 10, 25, 12);

export interface Catalog {
  semesters: Semester[];
  courses: Record<string, Course>;
  instructors: Record<string, Instructor>;
  offerings: Record<string, CourseOffering>;
  assignments: Record<string, TeachingAssignment>;
  /** Assignment ids per offering, in display order. */
  assignmentsByOffering: Record<string, string[]>;
  windows: Record<string, FeedbackWindow>;
}

function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function addDays([y, m, d]: [number, number, number], days: number): [number, number, number] {
  const date = new Date(Date.UTC(y, m - 1, d + days));
  return [date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate()];
}

function buildCatalog(): Catalog {
  const catalog: Catalog = {
    semesters: SEMESTER_PLANS.map((p) => p.semester),
    courses: {},
    instructors: {},
    offerings: {},
    assignments: {},
    assignmentsByOffering: {},
    windows: {},
  };

  for (const dept of institution.departments.map((d) => d.code as DepartmentCode)) {
    const spec = specForDepartment(dept);

    for (const plan of SEMESTER_PLANS) {
      const courseSpecs: CourseSpec[] = spec[plan.key];

      courseSpecs.forEach((cs, index) => {
        const courseId = `crs-${dept.toLowerCase()}-${cs.number}`;
        catalog.courses[courseId] = {
          id: courseId,
          code: `${dept} ${cs.number}`,
          title: cs.title,
          department: dept,
          credits: cs.credits,
        };

        const offeringId = `off-${plan.semester.id}-${courseId}`;
        catalog.offerings[offeringId] = {
          id: offeringId,
          courseId,
          semesterId: plan.semester.id,
        };

        const ids: string[] = [];
        cs.assignments.forEach((as, i) => {
          const instructorId = `ins-${dept.toLowerCase()}-${slug(as.instructor)}`;
          catalog.instructors[instructorId] = {
            id: instructorId,
            name: as.instructor,
            department: dept,
          };
          const assignmentId = `asg-${offeringId}-${i + 1}`;
          catalog.assignments[assignmentId] = {
            id: assignmentId,
            offeringId,
            instructorId,
            role: as.role,
            ...(as.note ? { note: as.note } : {}),
          };
          ids.push(assignmentId);
        });
        catalog.assignmentsByOffering[offeringId] = ids;

        // Spread closing dates a little so courses do not all close on the same day.
        const shift = (index % 3) * 2;
        for (const type of ['midterm', 'final'] as const) {
          const w = plan[type];
          const id = `win-${offeringId}-${type}`;
          catalog.windows[id] = {
            id,
            offeringId,
            type,
            opensAt: dhaka(...w.open),
            closesAt: dhaka(...addDays(w.close, shift), 23, 59, 59),
          };
        }
      });
    }
  }

  return catalog;
}

let cached: Catalog | null = null;

export function getCatalog(): Catalog {
  if (!cached) cached = buildCatalog();
  return cached;
}

export function getCurrentSemesterId(): string {
  return current.id;
}
