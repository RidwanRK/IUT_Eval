/**
 * Raw mock course sets. All instructor names are obviously fictional.
 * Course numbers are four digits; the department prefix is added in catalog.ts.
 */
import type { AssignmentRole } from '@/lib/types';

export interface AssignmentSpec {
  instructor: string;
  role: AssignmentRole;
  note?: string;
}

export interface CourseSpec {
  number: number;
  title: string;
  credits: number;
  assignments: AssignmentSpec[];
}

export interface DepartmentSpec {
  fall2026: CourseSpec[];
  spring2026: CourseSpec[];
  fall2025: CourseSpec[];
}

export const CSE_SPEC: DepartmentSpec = {
  fall2026: [
    {
      number: 4501,
      title: 'Operating Systems',
      credits: 3,
      assignments: [{ instructor: 'Dr. Zephyr Quill', role: 'theory' }],
    },
    {
      // Separate theory and lab instructors.
      number: 4509,
      title: 'Database Systems',
      credits: 4,
      assignments: [
        { instructor: 'Prof. Orin Maplewood', role: 'theory' },
        { instructor: 'Ms. Tamsin Brookfield', role: 'lab' },
      ],
    },
    {
      // Two theory instructors.
      number: 4511,
      title: 'Computer Networks',
      credits: 3,
      assignments: [
        { instructor: 'Dr. Mirabel Stonebridge', role: 'theory', note: 'First half' },
        { instructor: 'Mr. Lorcan Feathers', role: 'theory', note: 'Second half' },
      ],
    },
    {
      number: 4545,
      title: 'Artificial Intelligence',
      credits: 3,
      assignments: [{ instructor: 'Dr. Juniper Vale', role: 'theory' }],
    },
    {
      number: 4435,
      title: 'Software Engineering',
      credits: 3,
      assignments: [{ instructor: 'Mr. Quentin Hollowell', role: 'theory' }],
    },
  ],
  spring2026: [
    {
      number: 4401,
      title: 'Algorithms',
      credits: 3,
      assignments: [{ instructor: 'Dr. Juniper Vale', role: 'theory' }],
    },
    {
      number: 4403,
      title: 'Compiler Design',
      credits: 3,
      assignments: [{ instructor: 'Ms. Odessa Lark', role: 'theory' }],
    },
    {
      number: 4405,
      title: 'Computer Architecture',
      credits: 4,
      assignments: [
        { instructor: 'Prof. Orin Maplewood', role: 'theory' },
        { instructor: 'Mr. Lorcan Feathers', role: 'lab' },
      ],
    },
    {
      number: 4407,
      title: 'Numerical Methods',
      credits: 3,
      assignments: [{ instructor: 'Mr. Quentin Hollowell', role: 'theory' }],
    },
  ],
  fall2025: [
    {
      number: 4301,
      title: 'Data Structures',
      credits: 3,
      assignments: [{ instructor: 'Dr. Zephyr Quill', role: 'theory' }],
    },
    {
      number: 4303,
      title: 'Discrete Mathematics',
      credits: 3,
      assignments: [{ instructor: 'Ms. Odessa Lark', role: 'theory' }],
    },
    {
      number: 4305,
      title: 'Object Oriented Programming',
      credits: 4,
      assignments: [
        { instructor: 'Ms. Tamsin Brookfield', role: 'theory' },
        { instructor: 'Mr. Lorcan Feathers', role: 'lab' },
      ],
    },
    {
      number: 4307,
      title: 'Digital Logic Design',
      credits: 3,
      assignments: [{ instructor: 'Dr. Mirabel Stonebridge', role: 'theory' }],
    },
  ],
};

export const EEE_SPEC: DepartmentSpec = {
  fall2026: [
    {
      number: 4501,
      title: 'Power Systems',
      credits: 3,
      assignments: [{ instructor: 'Prof. Basil Thornwood', role: 'theory' }],
    },
    {
      number: 4515,
      title: 'Digital Signal Processing',
      credits: 4,
      assignments: [
        { instructor: 'Dr. Wren Alderidge', role: 'theory' },
        { instructor: 'Ms. Calla Fenwick', role: 'lab' },
      ],
    },
    {
      number: 4531,
      title: 'Control Systems',
      credits: 3,
      assignments: [{ instructor: 'Mr. Rook Ashdown', role: 'theory' }],
    },
    {
      number: 4549,
      title: 'VLSI Design',
      credits: 3,
      assignments: [{ instructor: 'Dr. Elara Winterbourne', role: 'theory' }],
    },
    {
      number: 4563,
      title: 'Communication Engineering',
      credits: 3,
      assignments: [{ instructor: 'Mr. Fitz Merriweather', role: 'theory' }],
    },
  ],
  spring2026: [
    {
      number: 4401,
      title: 'Electrical Machines',
      credits: 3,
      assignments: [{ instructor: 'Prof. Basil Thornwood', role: 'theory' }],
    },
    {
      number: 4403,
      title: 'Analog Electronics',
      credits: 4,
      assignments: [
        { instructor: 'Dr. Wren Alderidge', role: 'theory' },
        { instructor: 'Ms. Calla Fenwick', role: 'lab' },
      ],
    },
    {
      number: 4405,
      title: 'Electromagnetic Waves',
      credits: 3,
      assignments: [{ instructor: 'Dr. Elara Winterbourne', role: 'theory' }],
    },
    {
      number: 4407,
      title: 'Microprocessors',
      credits: 3,
      assignments: [{ instructor: 'Mr. Rook Ashdown', role: 'theory' }],
    },
  ],
  fall2025: [
    {
      number: 4301,
      title: 'Circuit Analysis',
      credits: 3,
      assignments: [{ instructor: 'Mr. Fitz Merriweather', role: 'theory' }],
    },
    {
      number: 4303,
      title: 'Digital Electronics',
      credits: 4,
      assignments: [
        { instructor: 'Dr. Elara Winterbourne', role: 'theory' },
        { instructor: 'Ms. Calla Fenwick', role: 'lab' },
      ],
    },
    {
      number: 4305,
      title: 'Engineering Mathematics',
      credits: 3,
      assignments: [{ instructor: 'Prof. Basil Thornwood', role: 'theory' }],
    },
    {
      number: 4307,
      title: 'Signals and Systems',
      credits: 3,
      assignments: [{ instructor: 'Dr. Wren Alderidge', role: 'theory' }],
    },
  ],
};
