'use client';

import { GraduationCap, Presentation } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { copy } from '@/config/copy';
import { Button, buttonStyles } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';

export function LandingActions() {
  const [teacherOpen, setTeacherOpen] = useState(false);
  const { teacherDialog } = copy.landing;

  return (
    <>
      <div className="flex w-full flex-col gap-3">
        <Link href="/student/sign-in" className={buttonStyles({ size: 'lg', block: true })}>
          <GraduationCap className="size-5" aria-hidden />
          {copy.landing.studentButton}
        </Link>
        <Button variant="secondary" size="lg" block onClick={() => setTeacherOpen(true)}>
          <Presentation className="size-5" aria-hidden />
          {copy.landing.teacherButton}
        </Button>
      </div>

      <Dialog
        open={teacherOpen}
        onOpenChange={setTeacherOpen}
        title={teacherDialog.title}
        description={teacherDialog.body}
        footer={<Button onClick={() => setTeacherOpen(false)}>{teacherDialog.close}</Button>}
      />
    </>
  );
}
