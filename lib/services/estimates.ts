/**
 * PLACEHOLDER (Stage 2). Stage 3 replaces this with real numbers computed from the
 * question config (/config/questions.ts).
 */
import type { WindowType } from '@/lib/types';

export function getEstimatedMinutes(_window: WindowType): number {
  void _window;
  return 4;
}

export function getQuestionCount(window: WindowType): number {
  return window === 'final' ? 23 : 17;
}
