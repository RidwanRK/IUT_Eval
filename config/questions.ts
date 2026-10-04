/**
 * Feedback questions. All question copy lives here and nowhere else, so it can be reviewed,
 * changed and translated in one place. Every question is skippable.
 *
 * Answer values: scale = option id, chips = option ids, slider = number, text = string.
 */
import type {
  ChipsQuestion,
  Question,
  QuestionOption,
  QuestionType,
  ScaleQuestion,
  SliderQuestion,
  TextQuestion,
  WindowType,
} from '@/lib/types';

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

/**
 * The classmate snapshot only appears once an offering has at least this many responses,
 * so nobody can guess who answered what in a tiny class.
 */
export const REVEAL_MIN_RESPONSES = 10;

/** Rough seconds a person needs per question type. Used for every "About N min". */
export const ESTIMATED_SECONDS: Record<QuestionType, number> = {
  scale: 8,
  chips: 15,
  slider: 10,
  text: 30,
};

// ---------------------------------------------------------------------------
// Option sets
// ---------------------------------------------------------------------------

function slug(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function options(labels: readonly string[]): QuestionOption[] {
  return labels.map((label) => ({ id: slug(label), label }));
}

export const optionSets = {
  quality5: options(['Poor', 'Fair', 'Good', 'Very good', 'Excellent']),
  learned5: options([
    'Much less than I expected',
    'A bit less',
    'About what I expected',
    'A bit more',
    'Much more',
  ]),
  recommend5: options(['Definitely not', 'Probably not', 'Not sure', 'Probably', 'Definitely']),
  clarity5: options([
    'Hard to follow',
    'Sometimes unclear',
    'Mostly clear',
    'Clear',
    'Crystal clear',
  ]),
  pace3: options(['Too slow', 'Just right', 'Too fast']),
  engage5: options(['Boring', 'A bit dull', 'Okay', 'Interesting', 'Really engaging']),
  useful5: options(['Not useful', 'Barely useful', 'Somewhat useful', 'Useful', 'Very useful']),
  comfort5: options(['Not at all', 'Not really', 'Sometimes', 'Mostly', 'Very much']),
  freq5: options(['Never', 'Rarely', 'Sometimes', 'Mostly', 'Always']),
  freq4: options(['Rarely', 'Sometimes', 'Mostly', 'Always']),
  difficulty5: options(['Far too easy', 'A bit easy', 'About right', 'A bit hard', 'Far too hard']),
  match4: options(['Barely', 'Partly', 'Mostly', 'Fully']),
  clear4: options(['Often confusing', 'Sometimes confusing', 'Mostly clear', 'Very clear']),
  time3: options(['Not enough', 'Just enough', 'More than enough']),
  fair5: options(['Not fair', 'Somewhat unfair', 'Not sure', 'Mostly fair', 'Very fair']),
  load4: options(['Too light', 'Manageable', 'Heavy', 'Too heavy']),
} as const satisfies Record<string, QuestionOption[]>;

export type OptionSetId = keyof typeof optionSets;

const hours = { min: 0, max: 15, step: 1, unit: 'hours', maxLabel: '15+' } as const;

const bestChips: QuestionOption[] = options([
  'Clear explanations',
  'Good examples',
  'Real-world connections',
  'Encouraged questions',
  'Patient with students',
  'Well prepared',
  'Useful assignments',
  'Helpful notes and slides',
  'Fair exams',
  'Good use of class time',
]);

const changeList: QuestionOption[] = options([
  'Slow down',
  'Speed up',
  'More examples',
  'More practice problems',
  'Share materials earlier',
  'Revise before exams',
  'Clearer expectations',
  'Return marks faster',
  'More time for questions',
  'Start classes on time',
  'Exams closer to class content',
]);

const changeChips: QuestionOption[] = [
  ...changeList,
  { id: 'nothing-good-as-is', label: "Nothing, it's good as it is", exclusive: true },
];

const secondHalfChips: QuestionOption[] = [
  ...changeList,
  { id: 'keep-exactly-as-is', label: 'Keep things exactly as they are', exclusive: true },
];

export const CHIP_OPTION_SETS = { bestChips, changeChips, secondHalfChips } as const;

// ---------------------------------------------------------------------------
// Question builders
// ---------------------------------------------------------------------------

type Meta = { id: string; section: string };

function scale(meta: Meta, text: string, set: OptionSetId): ScaleQuestion {
  return { ...meta, type: 'scale', text, options: optionSets[set], optional: true };
}

function chips(meta: Meta, text: string, list: QuestionOption[], maxSelect = 3): ChipsQuestion {
  return { ...meta, type: 'chips', text, options: list, maxSelect, optional: true };
}

function slider(meta: Meta, text: string): SliderQuestion {
  return { ...meta, type: 'slider', text, slider: hours, optional: true };
}

const TEXT_HINT = 'Be specific, be kind. Talk about the teaching, not the person.';
const TEXT_STARTERS = [
  'One thing that helped me...',
  "One thing I'd change...",
  "I'd love to see more...",
] as const;

function text(meta: Meta, prompt: string): TextQuestion {
  return {
    ...meta,
    type: 'text',
    text: prompt,
    maxLength: 500,
    starters: TEXT_STARTERS,
    hint: TEXT_HINT,
    optional: true,
  };
}

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

export interface SectionInfo {
  title: string;
  /** Shown inside the first card of the section. No extra screens. */
  subtitle: string;
}

const SECTIONS = {
  overall: { title: 'Overall', subtitle: 'First, the big picture.' },
  now: { title: 'So far', subtitle: "First, how it's going so far." },
  teaching: { title: 'Teaching', subtitle: 'Now, the teaching.' },
  behaviour: { title: 'Teacher behaviour', subtitle: 'Next, how it felt in class.' },
  exams: { title: 'Exams and marks', subtitle: 'Now, the exams.' },
  midterm: { title: 'The midterm and marks', subtitle: 'Now, the midterm.' },
  workload: { title: 'Workload', subtitle: 'Next, the workload.' },
  highlights: { title: 'Highlights', subtitle: 'Almost there. A few highlights.' },
  ahead: { title: 'Looking ahead', subtitle: 'Last part. Looking ahead to the second half.' },
  more: { title: 'Anything else', subtitle: 'One last thing.' },
} as const satisfies Record<string, SectionInfo>;

export type SectionId = keyof typeof SECTIONS;
export const sections: Record<string, SectionInfo> = SECTIONS;

const s = (id: string, section: SectionId): Meta => ({ id, section });

// ---------------------------------------------------------------------------
// Question sets
// ---------------------------------------------------------------------------

export const FINAL_QUESTIONS: readonly Question[] = [
  scale(s('f01', 'overall'), 'How was this course for you, overall?', 'quality5'),
  scale(s('f02', 'overall'), 'How much did you learn compared to what you expected?', 'learned5'),
  scale(
    s('f03', 'overall'),
    'Would you suggest this course with this teacher to a friend?',
    'recommend5',
  ),

  scale(s('f04', 'teaching'), 'Do the lectures click for you?', 'clarity5'),
  scale(s('f05', 'teaching'), 'How was the pace?', 'pace3'),
  scale(s('f06', 'teaching'), 'How engaging were the classes?', 'engage5'),
  scale(s('f07', 'teaching'), 'How useful were the slides, notes and other materials?', 'useful5'),
  scale(s('f08', 'teaching'), 'Did classes follow the course outline?', 'freq4'),

  scale(
    s('f09', 'behaviour'),
    'How comfortable did you feel asking questions, in class or outside it?',
    'comfort5',
  ),
  scale(s('f10', 'behaviour'), 'Did you feel respected in this class?', 'freq5'),
  scale(s('f11', 'behaviour'), 'Did the teacher treat all students fairly?', 'freq5'),
  scale(s('f12', 'behaviour'), 'Did classes start on time and run as scheduled?', 'freq5'),

  scale(s('f13', 'exams'), 'How hard were the exam questions?', 'difficulty5'),
  scale(s('f14', 'exams'), 'Did the exam questions match what was taught in class?', 'match4'),
  scale(s('f15', 'exams'), 'Were the exam questions clearly worded?', 'clear4'),
  scale(s('f16', 'exams'), 'Was the exam time enough?', 'time3'),
  scale(s('f17', 'exams'), 'Did the marking feel fair?', 'fair5'),
  scale(s('f18', 'exams'), 'Did you get quiz and assignment marks back in good time?', 'freq5'),

  slider(
    s('f19', 'workload'),
    'Roughly how many hours a week did you spend on this course outside class?',
  ),
  scale(s('f20', 'workload'), 'How did the workload feel?', 'load4'),

  chips(s('f21', 'highlights'), 'What worked best? Pick up to 3.', bestChips),
  chips(s('f22', 'highlights'), 'What should change? Pick up to 3.', changeChips),

  text(s('f23', 'more'), "Anything you'd like your teacher to know?"),
];

export const MIDTERM_QUESTIONS: readonly Question[] = [
  scale(s('m01', 'now'), 'So far, how is this course going for you?', 'quality5'),

  scale(s('m02', 'teaching'), 'Do the lectures click for you?', 'clarity5'),
  scale(s('m03', 'teaching'), "How's the pace so far?", 'pace3'),
  scale(s('m04', 'teaching'), 'How engaging are the classes?', 'engage5'),
  scale(s('m05', 'teaching'), 'How useful are the slides, notes and other materials?', 'useful5'),

  scale(s('m06', 'behaviour'), 'How comfortable do you feel asking questions?', 'comfort5'),
  scale(s('m07', 'behaviour'), 'Do you feel respected in this class?', 'freq5'),
  scale(s('m08', 'behaviour'), 'Does the teacher treat all students fairly?', 'freq5'),
  scale(s('m09', 'behaviour'), 'Do classes start on time and run as scheduled?', 'freq5'),

  scale(s('m10', 'midterm'), 'How hard was the midterm?', 'difficulty5'),
  scale(s('m11', 'midterm'), 'Did the midterm match what was taught in class?', 'match4'),
  scale(s('m12', 'midterm'), 'Was the midterm time enough?', 'time3'),
  scale(
    s('m13', 'midterm'),
    'Are you getting quiz and assignment marks back in good time?',
    'freq5',
  ),

  slider(
    s('m14', 'workload'),
    'Roughly how many hours a week are you spending on this course outside class?',
  ),

  chips(s('m15', 'ahead'), 'What should your teacher keep doing? Pick up to 3.', bestChips),
  chips(
    s('m16', 'ahead'),
    'For the second half, what would help most? Pick up to 3.',
    secondHalfChips,
  ),
  text(s('m17', 'more'), 'What is one thing that would help you learn better in the second half?'),
];

export interface QuestionSet {
  window: WindowType;
  questions: readonly Question[];
  /** Up to 3 single-choice scale questions that feed the classmate snapshot. */
  revealQuestions: readonly string[];
}

export const QUESTION_SETS: Record<WindowType, QuestionSet> = {
  final: { window: 'final', questions: FINAL_QUESTIONS, revealQuestions: ['f05', 'f13', 'f20'] },
  midterm: { window: 'midterm', questions: MIDTERM_QUESTIONS, revealQuestions: ['m03', 'm10'] },
};

export function getQuestionSet(window: WindowType): QuestionSet {
  return QUESTION_SETS[window];
}

/**
 * Wording for the classmate snapshot, per reveal question. The sentence is built as:
 * "Most classmates (68%) {most} {option label in lower case}."
 * and, if the student's answer differs:
 * "You're one of the 12% who {own} {option label in lower case}. That's valid too."
 */
export const REVEAL_PHRASES: Record<string, { name: string; most: string; own: string }> = {
  f05: { name: 'The pace', most: 'felt the pace was', own: 'felt it was' },
  f13: { name: 'Exam difficulty', most: 'found the exam questions', own: 'found them' },
  f20: { name: 'The workload', most: 'felt the workload was', own: 'felt it was' },
  m03: { name: 'The pace', most: 'felt the pace was', own: 'felt it was' },
  m10: { name: 'Midterm difficulty', most: 'found the midterm', own: 'found it' },
};

// ---------------------------------------------------------------------------
// Time estimates
// ---------------------------------------------------------------------------

export function estimateSeconds(questions: readonly Question[]): number {
  return questions.reduce((sum, q) => sum + ESTIMATED_SECONDS[q.type], 0);
}

/** Rounded to whole minutes, never less than 1. */
export function estimateMinutes(questions: readonly Question[]): number {
  return Math.max(1, Math.round(estimateSeconds(questions) / 60));
}

/** For "About N min left": rounds up so it never promises less time than it takes. */
export function minutesLeft(questions: readonly Question[], fromIndex: number): number {
  return Math.max(1, Math.ceil(estimateSeconds(questions.slice(fromIndex)) / 60));
}
