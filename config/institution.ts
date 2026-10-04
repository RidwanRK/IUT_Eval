/**
 * Institution settings.
 *
 * PLACEHOLDERS: everything in this file is a placeholder and must be confirmed by the
 * university before launch (names, department list, semester labels, contact details).
 */
import type { DepartmentCode } from '@/lib/types';

export const institution = {
  appName: 'IUT Eval',
  shortName: 'IUT Eval',
  universityName: 'Islamic University of Technology',
  universityShort: 'IUT',

  /** Placeholder. Confirm the real department list with the university. */
  departments: [
    { code: 'CSE', name: 'Computer Science and Engineering' },
    { code: 'EEE', name: 'Electrical and Electronic Engineering' },
    { code: 'ME', name: 'Mechanical Engineering' },
    { code: 'CEE', name: 'Civil and Environmental Engineering' },
    { code: 'IPE', name: 'Industrial and Production Engineering' },
    { code: 'BTM', name: 'Business and Technology Management' },
    { code: 'TVE', name: 'Technical and Vocational Education' },
  ] satisfies ReadonlyArray<{ code: DepartmentCode; name: string }>,

  /** Placeholder semester labels. Confirm the real naming with the registrar. */
  semesters: {
    current: { id: 'sem-fall-2026', label: 'Fall 2026' },
    past: [
      { id: 'sem-spring-2026', label: 'Spring 2026' },
      { id: 'sem-fall-2025', label: 'Fall 2025' },
    ],
  },

  /** Placeholder contact for serious concerns such as harassment or misconduct. */
  seriousConcerns: {
    note: 'Placeholder text. The university will confirm who to contact before launch.',
    officeName: 'Student Support Office (placeholder)',
    email: 'support-placeholder@example.edu',
    phone: '+880 0000 000000',
    hours: 'Sunday to Thursday, 9:00 to 17:00 (placeholder)',
  },

  /** Level labels, 1 to 8. */
  levels: Array.from({ length: 8 }, (_, i) => ({
    value: i + 1,
    label: `Year ${Math.floor(i / 2) + 1}, Semester ${(i % 2) + 1}`,
  })),

  timeZone: 'Asia/Dhaka',
} as const;

export type Institution = typeof institution;
