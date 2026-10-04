import { describe, expect, it } from 'vitest';
import { copy } from '@/config/copy';
import { institution } from '@/config/institution';
import { FINAL_QUESTIONS, MIDTERM_QUESTIONS, sections } from '@/config/questions';

/** Collects every string in a config object. Functions are called with sample arguments. */
function collect(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') out.push(value);
  else if (typeof value === 'function') {
    try {
      const result = (value as (...args: unknown[]) => unknown)(3, 'Sample', 'Sample', 'Sample');
      collect(result, out);
    } catch {
      /* ignore functions that need other arguments */
    }
  } else if (Array.isArray(value)) value.forEach((v) => collect(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => collect(v, out));
  return out;
}

const banned = /\b(evaluate|evaluation|respondent|survey|instrument|satisfaction)/i;

describe('copy tone', () => {
  const strings = [
    ...collect(copy),
    ...collect(sections),
    ...[...FINAL_QUESTIONS, ...MIDTERM_QUESTIONS].flatMap((q) => collect(q)),
  ];

  it('collects a healthy amount of copy', () => {
    expect(strings.length).toBeGreaterThan(200);
  });

  it('avoids official-form wording', () => {
    for (const s of strings) expect(s, s).not.toMatch(banned);
  });

  it('has no emojis', () => {
    for (const s of strings) expect(s, s).not.toMatch(/\p{Extended_Pictographic}/u);
  });

  it('does not use gamification words', () => {
    for (const s of strings)
      expect(s, s).not.toMatch(/\b(points?|badges?|streaks?|leaderboard|rewards?|perks?)\b/i);
  });

  it('is honest about the administrator exception to anonymity', () => {
    // The honest privacy sentence must mention authorised administrators and misconduct.
    expect(copy.flow.anonymity).toMatch(/authorised administrators/i);
    expect(copy.flow.anonymity).toMatch(/abuse or misconduct/);
    expect(copy.help.items.who.body.join(' ')).toMatch(/authorised administrators/i);
  });

  it('marks institution details as placeholders', () => {
    expect(institution.seriousConcerns.note.toLowerCase()).toContain('placeholder');
  });
});
