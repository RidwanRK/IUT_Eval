'use client';

import { useStudent } from '@/components/layout/student-context';

/** Placeholder. The dashboard is built in Stage 2. */
export default function StudentHomePage() {
  const student = useStudent();
  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">Hi, {student.displayName}</h1>
      <p className="text-muted mt-2">Your courses will show up here soon.</p>
    </div>
  );
}
