/** Time estimates, computed from the question config. */
import { estimateMinutes, getQuestionSet } from '@/config/questions';
import type { WindowType } from '@/lib/types';

export function getEstimatedMinutes(window: WindowType): number {
  return estimateMinutes(getQuestionSet(window).questions);
}

export function getQuestionCount(window: WindowType): number {
  return getQuestionSet(window).questions.length;
}
