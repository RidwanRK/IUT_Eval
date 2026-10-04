/**
 * Pure helpers for answers: what counts as answered, cleaning before sending, and turning
 * stored answers into readable text.
 */
import { getQuestionSet } from '@/config/questions';
import type { Answer, AnswerMap, AnswerValue, Question, WindowType } from '@/lib/types';

export function isAnswered(question: Question, value: AnswerValue | undefined): boolean {
  if (value === undefined) return false;
  switch (question.type) {
    case 'scale':
      return typeof value === 'string' && question.options.some((o) => o.id === value);
    case 'chips':
      return Array.isArray(value) && value.length > 0;
    case 'slider':
      return typeof value === 'number';
    case 'text':
      return typeof value === 'string' && value.trim().length > 0;
  }
}

/**
 * Keeps only valid answers for known questions. Drops anything unknown, empty or out of range,
 * so the stored response is always clean.
 */
export function sanitizeAnswers(window: WindowType, map: AnswerMap): Answer[] {
  const answers: Answer[] = [];
  for (const question of getQuestionSet(window).questions) {
    const raw = map[question.id];
    if (!isAnswered(question, raw)) continue;

    switch (question.type) {
      case 'scale':
        answers.push({ questionId: question.id, value: raw as string });
        break;
      case 'chips': {
        const valid = (raw as string[]).filter((id) => question.options.some((o) => o.id === id));
        const exclusive = valid.find((id) => question.options.find((o) => o.id === id)?.exclusive);
        const picked = exclusive ? [exclusive] : valid.slice(0, question.maxSelect);
        if (picked.length > 0) answers.push({ questionId: question.id, value: picked });
        break;
      }
      case 'slider': {
        const { min, max } = question.slider;
        const value = Math.min(max, Math.max(min, Math.round(raw as number)));
        answers.push({ questionId: question.id, value });
        break;
      }
      case 'text':
        answers.push({
          questionId: question.id,
          value: (raw as string).trim().slice(0, question.maxLength),
        });
        break;
    }
  }
  return answers;
}

export function answersToMap(answers: readonly Answer[]): AnswerMap {
  return Object.fromEntries(answers.map((a) => [a.questionId, a.value]));
}

/** A short readable form of an answer, for the review list and the read-only view. */
export function formatAnswer(question: Question, value: AnswerValue | undefined): string | null {
  if (!isAnswered(question, value)) return null;
  switch (question.type) {
    case 'scale':
      return question.options.find((o) => o.id === value)?.label ?? null;
    case 'chips':
      return (value as string[])
        .map((id) => question.options.find((o) => o.id === id)?.label)
        .filter(Boolean)
        .join(', ');
    case 'slider': {
      const v = value as number;
      const label = v >= question.slider.max ? question.slider.maxLabel : String(v);
      return `${label} ${question.slider.unit}`;
    }
    case 'text':
      return (value as string).trim();
  }
}
