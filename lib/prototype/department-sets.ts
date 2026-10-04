/**
 * PROTOTYPE ONLY.
 *
 * Departments other than CSE and EEE have no mock course data of their own, so they
 * reuse the CSE set with the department prefix swapped (CSE 4501 becomes ME 4501).
 * The real registrar feed replaces this.
 */
import { CSE_SPEC, EEE_SPEC, type DepartmentSpec } from '@/lib/mock/specs';
import type { DepartmentCode } from '@/lib/types';

export function specForDepartment(department: DepartmentCode): DepartmentSpec {
  if (department === 'CSE') return CSE_SPEC;
  if (department === 'EEE') return EEE_SPEC;
  // Same courses, same fictional instructors. The prefix is applied by the catalog builder.
  return CSE_SPEC;
}
