'use client';

import { copy } from '@/config/copy';
import { institution } from '@/config/institution';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { ProfileErrors, ProfileFormValues } from './profile-validation';

const f = copy.onboarding.fields;

const departmentOptions = institution.departments.map((d) => ({
  value: d.code,
  label: `${d.code}, ${d.name}`,
}));
const levelOptions = institution.levels.map((l) => ({ value: l.value, label: l.label }));

type Group = 'about' | 'studies';

/** The profile inputs, shared by onboarding and Settings. */
export function ProfileFields({
  group,
  values,
  errors,
  onChange,
}: {
  group: Group;
  values: ProfileFormValues;
  errors: ProfileErrors;
  onChange: (patch: Partial<ProfileFormValues>) => void;
}) {
  if (group === 'about') {
    return (
      <div className="flex flex-col gap-4">
        <Input
          label={f.displayName.label}
          placeholder={f.displayName.placeholder}
          value={values.displayName}
          onChange={(e) => onChange({ displayName: e.target.value })}
          error={errors.displayName}
          autoComplete="given-name"
          maxLength={40}
        />
        <Input
          label={f.studentId.label}
          placeholder={f.studentId.placeholder}
          hint={f.studentId.hint}
          value={values.studentId}
          onChange={(e) => onChange({ studentId: e.target.value.replace(/\D/g, '').slice(0, 12) })}
          error={errors.studentId}
          inputMode="numeric"
          autoComplete="off"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Select
        label={f.department.label}
        placeholder={f.department.placeholder}
        options={departmentOptions}
        value={values.department}
        onChange={(e) => onChange({ department: e.target.value })}
        error={errors.department}
      />
      <Select
        label={f.level.label}
        placeholder={f.level.placeholder}
        options={levelOptions}
        value={values.level}
        onChange={(e) => onChange({ level: e.target.value })}
        error={errors.level}
      />
      <Input
        label={f.email.label}
        placeholder={f.email.placeholder}
        hint={f.email.hint}
        type="email"
        value={values.email}
        onChange={(e) => onChange({ email: e.target.value })}
        error={errors.email}
        autoComplete="email"
      />
    </div>
  );
}
