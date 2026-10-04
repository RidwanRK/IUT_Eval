import { describe, expect, it } from 'vitest';
import {
  CHIP_OPTION_SETS,
  ESTIMATED_SECONDS,
  FINAL_QUESTIONS,
  MIDTERM_QUESTIONS,
  QUESTION_SETS,
  REVEAL_MIN_RESPONSES,
  REVEAL_PHRASES,
  estimateMinutes,
  estimateSeconds,
  minutesLeft,
  optionSets,
  sections,
} from '@/config/questions';
import { getEstimatedMinutes, getQuestionCount } from '@/lib/services/estimates';
import type { Question } from '@/lib/types';

const sets = [
  ['final', FINAL_QUESTIONS],
  ['midterm', MIDTERM_QUESTIONS],
] as const;

describe('question config', () => {
  it('has the expected number of questions', () => {
    expect(FINAL_QUESTIONS).toHaveLength(23);
    expect(MIDTERM_QUESTIONS).toHaveLength(17);
  });

  it('has globally unique question ids', () => {
    const ids = [...FINAL_QUESTIONS, ...MIDTERM_QUESTIONS].map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(sets)(
    'every question in %s has text, a known section and is skippable',
    (_, questions) => {
      for (const q of questions) {
        expect(q.text.trim().length).toBeGreaterThan(0);
        expect(sections[q.section], `${q.id} section`).toBeDefined();
        expect(q.optional).toBe(true);
      }
    },
  );

  it('every scale and chips question has valid, unique options', () => {
    for (const q of [...FINAL_QUESTIONS, ...MIDTERM_QUESTIONS]) {
      if (q.type !== 'scale' && q.type !== 'chips') continue;
      expect(q.options.length, q.id).toBeGreaterThanOrEqual(3);
      const ids = q.options.map((o) => o.id);
      expect(new Set(ids).size, `${q.id} option ids`).toBe(ids.length);
      for (const o of q.options) expect(o.label.trim().length).toBeGreaterThan(0);
    }
  });

  it('scale questions use one of the named option sets', () => {
    const known = Object.values(optionSets);
    for (const q of [...FINAL_QUESTIONS, ...MIDTERM_QUESTIONS]) {
      if (q.type === 'scale') expect(known, q.id).toContain(q.options);
    }
  });

  it('chips questions have a sensible max and at most one exclusive option', () => {
    for (const q of [...FINAL_QUESTIONS, ...MIDTERM_QUESTIONS]) {
      if (q.type !== 'chips') continue;
      expect(q.maxSelect).toBe(3);
      expect(q.options.filter((o) => o.exclusive).length).toBeLessThanOrEqual(1);
    }
    expect(CHIP_OPTION_SETS.changeChips.find((o) => o.exclusive)?.label).toBe(
      "Nothing, it's good as it is",
    );
    expect(CHIP_OPTION_SETS.secondHalfChips.find((o) => o.exclusive)?.label).toBe(
      'Keep things exactly as they are',
    );
  });

  it('slider is 0 to 15 hours in steps of 1 with a "15+" last stop', () => {
    const sliders = [...FINAL_QUESTIONS, ...MIDTERM_QUESTIONS].filter((q) => q.type === 'slider');
    expect(sliders).toHaveLength(2);
    for (const q of sliders) {
      if (q.type !== 'slider') continue;
      expect(q.slider).toMatchObject({ min: 0, max: 15, step: 1, maxLabel: '15+' });
    }
  });

  it('text questions are 500 characters with starters and the kindness hint', () => {
    for (const q of [...FINAL_QUESTIONS, ...MIDTERM_QUESTIONS]) {
      if (q.type !== 'text') continue;
      expect(q.maxLength).toBe(500);
      expect(q.starters.length).toBeGreaterThan(0);
      expect(q.hint).toContain('Be specific, be kind');
    }
  });

  it('keeps option sets free of banned wording', () => {
    const banned = /evaluat|respondent|survey|instrument|satisfaction/i;
    for (const q of [...FINAL_QUESTIONS, ...MIDTERM_QUESTIONS]) {
      expect(q.text, q.id).not.toMatch(banned);
    }
  });
});

describe('reveal questions', () => {
  it.each(Object.entries(QUESTION_SETS))(
    '%s reveal questions exist and are single-choice scales',
    (_, set) => {
      expect(set.revealQuestions.length).toBeGreaterThan(0);
      expect(set.revealQuestions.length).toBeLessThanOrEqual(3);
      for (const id of set.revealQuestions) {
        const q: Question | undefined = set.questions.find((x) => x.id === id);
        expect(q, `${id} exists`).toBeDefined();
        expect(q?.type, `${id} is a scale`).toBe('scale');
        expect(REVEAL_PHRASES[id], `${id} has snapshot wording`).toBeDefined();
      }
    },
  );

  it('matches the brief: final 5, 13, 20 and midterm 3, 10', () => {
    expect(QUESTION_SETS.final.revealQuestions).toEqual(['f05', 'f13', 'f20']);
    expect(QUESTION_SETS.midterm.revealQuestions).toEqual(['m03', 'm10']);
    // The questions behind those ids are the pace, exam difficulty and workload ones.
    expect(FINAL_QUESTIONS[4]?.id).toBe('f05');
    expect(FINAL_QUESTIONS[12]?.id).toBe('f13');
    expect(FINAL_QUESTIONS[19]?.id).toBe('f20');
    expect(MIDTERM_QUESTIONS[2]?.id).toBe('m03');
    expect(MIDTERM_QUESTIONS[9]?.id).toBe('m10');
  });

  it('has a minimum response count of 10 by default', () => {
    expect(REVEAL_MIN_RESPONSES).toBe(10);
  });
});

describe('time estimates', () => {
  it('uses the per-type seconds from config', () => {
    expect(ESTIMATED_SECONDS).toEqual({ scale: 8, chips: 15, slider: 10, text: 30 });
  });

  it('computes seconds from the question mix', () => {
    // Final: 19 scales, 1 slider, 2 chips, 1 text.
    expect(estimateSeconds(FINAL_QUESTIONS)).toBe(19 * 8 + 10 + 2 * 15 + 30);
    // Midterm: 13 scales, 1 slider, 2 chips, 1 text.
    expect(estimateSeconds(MIDTERM_QUESTIONS)).toBe(13 * 8 + 10 + 2 * 15 + 30);
  });

  it('rounds to whole minutes and never goes below 1', () => {
    expect(estimateMinutes(FINAL_QUESTIONS)).toBe(4);
    expect(estimateMinutes(MIDTERM_QUESTIONS)).toBe(3);
    expect(estimateMinutes([])).toBe(1);
  });

  it('time left rounds up and shrinks as you go', () => {
    const start = minutesLeft(FINAL_QUESTIONS, 0);
    const middle = minutesLeft(FINAL_QUESTIONS, 12);
    const end = minutesLeft(FINAL_QUESTIONS, 22);
    expect(start).toBeGreaterThanOrEqual(middle);
    expect(middle).toBeGreaterThanOrEqual(end);
    expect(end).toBe(1);
  });

  it('the dashboard estimate comes from the same config', () => {
    expect(getEstimatedMinutes('final')).toBe(estimateMinutes(FINAL_QUESTIONS));
    expect(getEstimatedMinutes('midterm')).toBe(estimateMinutes(MIDTERM_QUESTIONS));
    expect(getQuestionCount('final')).toBe(23);
    expect(getQuestionCount('midterm')).toBe(17);
  });
});
