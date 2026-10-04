/** Shared domain types. Kept free of runtime code so a real backend can reuse them. */

export type DepartmentCode = 'CSE' | 'EEE' | 'ME' | 'CEE' | 'IPE' | 'BTM' | 'TVE';

export type WindowType = 'midterm' | 'final';
export type WindowStatus = 'upcoming' | 'open' | 'closed';
export type AssignmentRole = 'theory' | 'lab';

export type PresetAvatarId =
  'book' | 'compass' | 'leaf' | 'coffee' | 'lightbulb' | 'telescope' | 'bird' | 'mountain';

export type AvatarChoice =
  { kind: 'initials'; color: string } | { kind: 'preset'; preset: PresetAvatarId };

export interface Student {
  /** Internal id. Receipts point at this, never at the visible student ID. */
  id: string;
  /** The ID printed on the student card. Digits only, 6 to 12. */
  studentId: string;
  displayName: string;
  department: DepartmentCode;
  /** Semester level, 1 to 8 (year 1 semester 1 = 1). */
  level: number;
  /** Optional. Used only for reminders. */
  email?: string;
  avatar: AvatarChoice;
  createdAt: string;
}

export interface Semester {
  id: string;
  label: string;
  startsOn: string;
  endsOn: string;
  isCurrent: boolean;
}

export interface Instructor {
  id: string;
  name: string;
  department: DepartmentCode;
}

export interface Course {
  id: string;
  /** Department code plus four digits, for example "CSE 4501". */
  code: string;
  title: string;
  department: DepartmentCode;
  credits: number;
}

export interface CourseOffering {
  id: string;
  courseId: string;
  semesterId: string;
}

/** The unit that gets rated: one instructor, in one role, for one course offering. */
export interface TeachingAssignment {
  id: string;
  offeringId: string;
  instructorId: string;
  role: AssignmentRole;
  /** Optional extra label, for example "First half" when two people teach theory. */
  note?: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  offeringId: string;
}

/** One window per offering and type. It applies to every teaching assignment in the offering. */
export interface FeedbackWindow {
  id: string;
  offeringId: string;
  type: WindowType;
  /** ISO timestamps. Status is always computed from these and getNow(). */
  opensAt: string;
  closesAt: string;
}

// ---------------------------------------------------------------------------
// Questions and answers
// ---------------------------------------------------------------------------

export type QuestionType = 'scale' | 'chips' | 'slider' | 'text';

export interface QuestionOption {
  id: string;
  label: string;
  /** Exclusive options clear every other choice when picked (chips only). */
  exclusive?: boolean;
}

export interface SliderSettings {
  min: number;
  max: number;
  step: number;
  unit: string;
  /** Label for the last stop, for example "15+". */
  maxLabel: string;
}

interface QuestionBase {
  id: string;
  section: string;
  text: string;
  /** Every question is skippable. */
  optional: true;
}

export interface ScaleQuestion extends QuestionBase {
  type: 'scale';
  options: readonly QuestionOption[];
}

export interface ChipsQuestion extends QuestionBase {
  type: 'chips';
  options: readonly QuestionOption[];
  maxSelect: number;
}

export interface SliderQuestion extends QuestionBase {
  type: 'slider';
  slider: SliderSettings;
}

export interface TextQuestion extends QuestionBase {
  type: 'text';
  maxLength: number;
  starters: readonly string[];
  hint: string;
}

export type Question = ScaleQuestion | ChipsQuestion | SliderQuestion | TextQuestion;

/**
 * An answer value depends on the question type:
 * scale: option id, chips: option ids, slider: number, text: string.
 */
export type AnswerValue = string | string[] | number;

export interface Answer {
  questionId: string;
  value: AnswerValue;
}

export type AnswerMap = Record<string, AnswerValue>;

/**
 * What a student wrote. It must NEVER hold a student identifier or a precise timestamp.
 * See lib/services/responses.ts.
 */
export interface AnonymousResponse {
  id: string;
  assignmentId: string;
  window: WindowType;
  /** Bumps each time the student edits and resends. */
  version: number;
  answers: Answer[];
}

/**
 * The only record that links a student to a response. It powers completion tracking,
 * "edit until close" and admin lookups. See lib/services/receipts.ts.
 */
export interface SubmissionReceipt {
  id: string;
  studentId: string;
  assignmentId: string;
  window: WindowType;
  responseId: string;
  status: 'submitted';
  /** Date only (YYYY-MM-DD). */
  updatedOn: string;
}

export interface Draft {
  assignmentId: string;
  window: WindowType;
  answers: AnswerMap;
  /** Question ids the student skipped on purpose. */
  skipped: string[];
  /** Index of the last question the student was on. */
  position: number;
}

export interface SnapshotItem {
  questionId: string;
  /** Count per option, in the same order as the question's options. */
  counts: number[];
  total: number;
}

export interface ClassSnapshot {
  assignmentId: string;
  window: WindowType;
  responseCount: number;
  items: SnapshotItem[];
}

export interface ReminderChannelPrefs {
  /** When a feedback window opens. */
  windowOpens: boolean;
  /** A day before it closes. */
  closingSoon: boolean;
}

export interface ReminderPrefs {
  inApp: ReminderChannelPrefs;
  email: ReminderChannelPrefs;
}

export interface AppNotification {
  /** Stable id, so read state survives refreshes. */
  id: string;
  kind: 'window-open' | 'closing-soon';
  /** One reminder per course and window, however many teachers the course has. */
  offeringId: string;
  window: WindowType;
  title: string;
  /** Short detail line, for example the teacher and "Closes in 3 days". */
  body: string;
  /** Where tapping the reminder goes. */
  href: string;
  read: boolean;
}
