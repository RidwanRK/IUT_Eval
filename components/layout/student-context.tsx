'use client';

import { createContext, useContext } from 'react';
import type { Student } from '@/lib/types';

const StudentContext = createContext<Student | null>(null);

export const StudentProvider = StudentContext.Provider;

/** The signed-in student. Only available below <RequireStudent>. */
export function useStudent(): Student {
  const student = useContext(StudentContext);
  if (!student) throw new Error('useStudent must be used inside <RequireStudent>');
  return student;
}
