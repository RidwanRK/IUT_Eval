import { KEYS, storage } from '@/lib/storage';
import type { AvatarChoice, DepartmentCode, Student } from '@/lib/types';
import { uid } from '@/lib/utils';
import { seedEnrollments } from './enrollments';

export interface ProfileInput {
  displayName: string;
  studentId: string;
  department: DepartmentCode;
  level: number;
  email?: string;
  avatar: AvatarChoice;
}

export async function getProfile(): Promise<Student | null> {
  return storage.get<Student | null>(KEYS.profile, null);
}

/** Creates the profile, or updates it if one exists. Enrolments follow the department. */
export async function saveProfile(input: ProfileInput): Promise<Student> {
  const existing = await getProfile();
  const email = input.email?.trim();
  const student: Student = {
    id: existing?.id ?? uid('stu'),
    studentId: input.studentId.trim(),
    displayName: input.displayName.trim(),
    department: input.department,
    level: input.level,
    ...(email ? { email } : {}),
    avatar: input.avatar,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };
  storage.set(KEYS.profile, student);

  if (!existing || existing.department !== student.department) {
    await seedEnrollments(student);
  }
  return student;
}

/** For services that only make sense with a signed-in student. */
export async function requireProfile(): Promise<Student> {
  const profile = await getProfile();
  if (!profile) throw new Error('No student profile yet');
  return profile;
}
