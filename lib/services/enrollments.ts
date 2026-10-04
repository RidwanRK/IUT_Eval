/**
 * Mock enrolments. In production these come from the registrar. Here we enrol the student
 * in every offering of their department, across the current and past semesters.
 */
import { getCatalog } from '@/lib/mock/catalog';
import { KEYS, storage } from '@/lib/storage';
import type { Enrollment, Student } from '@/lib/types';
import { seedHistory } from './history-seed';

export async function getEnrollments(): Promise<Enrollment[]> {
  return storage.get<Enrollment[]>(KEYS.enrollments, []);
}

export async function seedEnrollments(student: Student): Promise<Enrollment[]> {
  const catalog = getCatalog();
  const enrollments: Enrollment[] = Object.values(catalog.offerings)
    .filter((offering) => catalog.courses[offering.courseId]?.department === student.department)
    .map((offering) => ({
      id: `enr-${student.id}-${offering.id}`,
      studentId: student.id,
      offeringId: offering.id,
    }));
  storage.set(KEYS.enrollments, enrollments);
  await seedHistory(student, enrollments);
  return enrollments;
}
