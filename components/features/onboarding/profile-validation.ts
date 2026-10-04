import { copy } from '@/config/copy';

export interface ProfileFormValues {
  displayName: string;
  studentId: string;
  department: string;
  level: string;
  email: string;
}

export type ProfileErrors = Partial<Record<keyof ProfileFormValues, string>>;

const f = copy.onboarding.fields;

export function validateProfile(
  values: ProfileFormValues,
  fields: ReadonlyArray<keyof ProfileFormValues>,
): ProfileErrors {
  const errors: ProfileErrors = {};
  if (fields.includes('displayName') && values.displayName.trim().length === 0) {
    errors.displayName = f.displayName.error;
  }
  if (fields.includes('studentId') && !/^\d{6,12}$/.test(values.studentId.trim())) {
    errors.studentId = f.studentId.error;
  }
  if (fields.includes('department') && values.department === '') {
    errors.department = f.department.error;
  }
  if (fields.includes('level') && values.level === '') {
    errors.level = f.level.error;
  }
  if (
    fields.includes('email') &&
    values.email.trim() !== '' &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())
  ) {
    errors.email = f.email.error;
  }
  return errors;
}
