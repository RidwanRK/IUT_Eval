/**
 * Pure helpers for the classmate snapshot: percentages and friendly sentences.
 * Kept free of storage and the clock so they are easy to test.
 */
import { copy } from '@/config/copy';
import { REVEAL_PHRASES } from '@/config/questions';
import type { AnswerValue, ScaleQuestion, SnapshotItem } from '@/lib/types';

export interface SnapshotSegment {
  id: string;
  label: string;
  pct: number;
  isTop: boolean;
  isOwn: boolean;
}

export interface SnapshotView {
  questionId: string;
  name: string;
  /** For example "Most classmates (68%) felt the pace was just right." */
  headline: string;
  /** Shown only when the student's answer differs from the biggest group. */
  yours: string | null;
  segments: SnapshotSegment[];
}

const t = copy.flow.snapshot;

export function describeSnapshotItem(
  question: ScaleQuestion,
  item: SnapshotItem,
  own: AnswerValue | undefined,
): SnapshotView | null {
  if (item.total === 0) return null;
  const phrases = REVEAL_PHRASES[question.id];
  if (!phrases) return null;

  const pcts = item.counts.map((c) => Math.round((c / item.total) * 100));
  const topIndex = item.counts.indexOf(Math.max(...item.counts));
  const ownIndex = typeof own === 'string' ? question.options.findIndex((o) => o.id === own) : -1;

  const lower = (i: number) => question.options[i]!.label.toLowerCase();
  const topPct = pcts[topIndex]!;
  const headline =
    topPct > 50
      ? t.most(topPct, phrases.most, lower(topIndex))
      : t.biggest(topPct, phrases.most, lower(topIndex));

  const yours =
    ownIndex >= 0 && ownIndex !== topIndex
      ? t.yours(pcts[ownIndex]!, phrases.own, lower(ownIndex))
      : null;

  return {
    questionId: question.id,
    name: phrases.name,
    headline,
    yours,
    segments: question.options.map((o, i) => ({
      id: o.id,
      label: o.label,
      pct: pcts[i]!,
      isTop: i === topIndex,
      isOwn: i === ownIndex,
    })),
  };
}
