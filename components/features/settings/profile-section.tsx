'use client';

import { useState } from 'react';
import { copy } from '@/config/copy';
import { AvatarPicker } from '@/components/features/onboarding/avatar-picker';
import { ProfileFields } from '@/components/features/onboarding/profile-fields';
import {
  validateProfile,
  type ProfileErrors,
  type ProfileFormValues,
} from '@/components/features/onboarding/profile-validation';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { saveProfile } from '@/lib/services/profile';
import type { AvatarChoice, DepartmentCode, Student } from '@/lib/types';

const t = copy.settings.profile;

const ALL_FIELDS = ['displayName', 'studentId', 'department', 'level', 'email'] as const;

export function profileToValues(student: Student): ProfileFormValues {
  return {
    displayName: student.displayName,
    studentId: student.studentId,
    department: student.department,
    level: String(student.level),
    email: student.email ?? '',
  };
}

function sameAvatar(a: AvatarChoice, b: AvatarChoice): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/** Edit name, student ID, department, level, email and avatar. Saves with a toast. */
export function ProfileSection({
  student,
  values,
  onValuesChange,
}: {
  student: Student;
  /** Shared with the reminders section, so the email field stays in step. */
  values: ProfileFormValues;
  onValuesChange: (patch: Partial<ProfileFormValues>) => void;
}) {
  const { toast } = useToast();
  const [avatar, setAvatar] = useState<AvatarChoice>(student.avatar);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [saving, setSaving] = useState(false);

  const saved = profileToValues(student);
  const dirty =
    ALL_FIELDS.some((k) => values[k].trim() !== saved[k].trim()) ||
    !sameAvatar(avatar, student.avatar);
  const departmentChanged = values.department !== student.department;

  function patch(p: Partial<ProfileFormValues>) {
    onValuesChange(p);
    setErrors((e) => {
      const next = { ...e };
      (Object.keys(p) as Array<keyof ProfileFormValues>).forEach((k) => delete next[k]);
      return next;
    });
  }

  async function onSave() {
    const found = validateProfile(values, ALL_FIELDS);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setSaving(true);
    try {
      await saveProfile({
        displayName: values.displayName,
        studentId: values.studentId,
        department: values.department as DepartmentCode,
        level: Number(values.level),
        email: values.email,
        avatar,
      });
      toast(copy.toasts.profileSaved);
    } catch {
      toast(copy.toasts.genericError, 'warn');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Avatar avatar={avatar} name={values.displayName || student.displayName} size="lg" />
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">{t.title}</h2>
          <p className="text-muted text-sm">{t.body}</p>
        </div>
      </div>

      <ProfileFields group="about" values={values} errors={errors} onChange={patch} />
      <ProfileFields group="studies" values={values} errors={errors} onChange={patch} />
      {departmentChanged && (
        <p className="bg-sunken text-muted rounded-lg px-3 py-2.5 text-sm">
          {t.departmentChangeHint}
        </p>
      )}

      <AvatarPicker value={avatar} name={values.displayName} onChange={setAvatar} />

      <Button size="lg" block onClick={onSave} loading={saving} disabled={!dirty}>
        {saving ? t.saving : t.save}
      </Button>
    </Card>
  );
}
