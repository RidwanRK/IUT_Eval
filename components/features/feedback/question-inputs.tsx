'use client';

import * as Slider from '@radix-ui/react-slider';
import { Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { copy } from '@/config/copy';
import { Chip } from '@/components/ui/chip';
import { TextArea } from '@/components/ui/textarea';
import type { ChipsQuestion, ScaleQuestion, SliderQuestion, TextQuestion } from '@/lib/types';
import { cn } from '@/lib/utils';

const t = copy.flow.question;

// ---------------------------------------------------------------------------
// Scale: one choice, large stacked buttons. Selected = solid red with a check.
// ---------------------------------------------------------------------------

export function ScaleInput({
  question,
  value,
  onSelect,
  onConfirm,
  labelledBy,
}: {
  question: ScaleQuestion;
  value: string | undefined;
  onSelect: (optionId: string) => void;
  /** Enter on a chosen answer: move on now instead of waiting for the short delay. */
  onConfirm: () => void;
  labelledBy: string;
}) {
  const count = question.options.length;

  // Desktop: number keys choose, Enter continues.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(target.tagName)) return;
      const n = Number(e.key);
      if (Number.isInteger(n) && n >= 1 && n <= count) {
        e.preventDefault();
        onSelect(question.options[n - 1]!.id);
      } else if (e.key === 'Enter' && value) {
        e.preventDefault();
        onConfirm();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [count, onConfirm, onSelect, question.options, value]);

  return (
    <div
      role="group"
      aria-labelledby={labelledBy}
      className={cn(
        'grid gap-3',
        count === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2',
        count % 2 === 1 && count !== 3 && 'md:[&>*:last-child]:col-span-2',
      )}
    >
      {question.options.map((option, i) => {
        const selected = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(option.id)}
            className={cn(
              'rounded-control flex min-h-14 items-center gap-3 border px-4 py-3 text-left text-base font-semibold transition-colors duration-150 active:scale-[0.99] motion-reduce:active:scale-100 md:min-h-16',
              count === 3 && 'md:flex-col md:justify-center md:text-center',
              selected
                ? 'border-brand bg-brand text-white'
                : 'border-line-strong bg-surface hover:bg-sunken text-ink',
            )}
          >
            <span
              aria-hidden
              className={cn(
                'hidden size-7 shrink-0 items-center justify-center rounded-md text-sm md:flex',
                selected ? 'bg-white/20 text-white' : 'bg-sunken text-muted',
              )}
            >
              {i + 1}
            </span>
            <span className="flex-1">{option.label}</span>
            {selected && <Check className="size-5 shrink-0" strokeWidth={3} aria-hidden />}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Chips: several choices up to a max. Exclusive options clear the others.
// ---------------------------------------------------------------------------

export function ChipsInput({
  question,
  value,
  onChange,
  labelledBy,
}: {
  question: ChipsQuestion;
  value: string[];
  onChange: (next: string[]) => void;
  labelledBy: string;
}) {
  const [limitHit, setLimitHit] = useState(false);

  function toggle(optionId: string) {
    const option = question.options.find((o) => o.id === optionId)!;
    const picked = value.includes(optionId);
    setLimitHit(false);

    if (picked) return onChange(value.filter((id) => id !== optionId));
    // Exclusive: clears everything else. Anything else: clears an exclusive pick.
    if (option.exclusive) return onChange([optionId]);

    const withoutExclusive = value.filter(
      (id) => !question.options.find((o) => o.id === id)?.exclusive,
    );
    if (withoutExclusive.length >= question.maxSelect) {
      setLimitHit(true);
      return;
    }
    onChange([...withoutExclusive, optionId]);
  }

  const atLimit =
    value.filter((id) => !question.options.find((o) => o.id === id)?.exclusive).length >=
    question.maxSelect;

  return (
    <div>
      <div role="group" aria-labelledby={labelledBy} className="flex flex-wrap gap-2.5">
        {question.options.map((option) => {
          const selected = value.includes(option.id);
          const blocked = !selected && !option.exclusive && atLimit;
          return (
            <Chip
              key={option.id}
              selected={selected}
              aria-disabled={blocked || undefined}
              className={cn(blocked && 'opacity-50')}
              onClick={() => toggle(option.id)}
            >
              {option.label}
            </Chip>
          );
        })}
      </div>
      <p className="text-muted mt-4 text-sm" aria-live="polite">
        {limitHit ? t.chipsMaxReached(question.maxSelect) : t.chipsLimit(question.maxSelect)}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Slider: hours per week. Big thumb, labelled stops you can also tap.
// ---------------------------------------------------------------------------

export function SliderInput({
  question,
  value,
  onChange,
}: {
  question: SliderQuestion;
  value: number | undefined;
  onChange: (next: number) => void;
}) {
  const { min, max, step, unit, maxLabel } = question.slider;
  const isSet = value !== undefined;
  const shown = value ?? min;
  const valueLabel = (v: number) => (v >= max ? maxLabel : String(v));
  const stops = [min, Math.round(max / 3), Math.round((max * 2) / 3), max];

  return (
    <div>
      <p className="tabular text-center text-4xl font-extrabold tracking-tight" aria-hidden>
        {isSet ? (
          <>
            {valueLabel(shown)} <span className="text-muted text-xl font-bold">{unit}</span>
          </>
        ) : (
          <span className="text-subtle text-2xl font-bold">{t.sliderNotSet}</span>
        )}
      </p>

      <Slider.Root
        className="relative mt-4 flex h-12 w-full touch-none items-center select-none"
        min={min}
        max={max}
        step={step}
        value={[shown]}
        onValueChange={([v]) => onChange(v ?? min)}
      >
        <Slider.Track className="bg-sunken relative h-3 grow rounded-full">
          <Slider.Range
            className={cn('absolute h-full rounded-full', isSet ? 'bg-brand' : 'bg-transparent')}
          />
        </Slider.Track>
        <Slider.Thumb
          aria-label={question.text}
          aria-valuetext={isSet ? t.sliderValue(valueLabel(shown), unit) : t.sliderNotSet}
          className={cn(
            'shadow-raised block size-10 rounded-full border-4 border-white transition-colors',
            isSet ? 'bg-brand' : 'bg-control',
          )}
        />
      </Slider.Root>

      <div className="relative mt-1 flex justify-between">
        {stops.map((stop) => (
          <button
            key={stop}
            type="button"
            onClick={() => onChange(stop)}
            aria-label={t.sliderValue(valueLabel(stop), unit)}
            className={cn(
              'tabular rounded-control min-h-12 min-w-12 px-2 text-base font-bold transition-colors',
              isSet && stop === value ? 'bg-brand-50 text-brand' : 'text-muted hover:bg-sunken',
            )}
          >
            {valueLabel(stop)}
          </button>
        ))}
      </div>
      <p className="text-muted mt-2 text-center text-sm">{t.sliderHint}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Text: comment box with a counter, starter chips and a gentle hint.
// ---------------------------------------------------------------------------

export function TextInput({
  question,
  value,
  onChange,
}: {
  question: TextQuestion;
  value: string;
  onChange: (next: string) => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function insert(phrase: string) {
    const next = (value.trim() ? `${value.trimEnd()} ${phrase} ` : `${phrase} `).slice(
      0,
      question.maxLength,
    );
    onChange(next);
    requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(next.length, next.length);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="bg-sunken text-muted rounded-lg px-3 py-2.5 text-sm">{question.hint}</p>
      <TextArea
        ref={ref}
        label={t.textLabel}
        hideLabel
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={question.maxLength}
        showCount
        placeholder={t.textPlaceholder}
        rows={5}
      />
      <div>
        <p className="mb-2 text-sm font-semibold">{t.startersLabel}</p>
        <div className="flex flex-wrap gap-2">
          {question.starters.map((starter) => (
            <Chip key={starter} toggle={false} onClick={() => insert(starter)}>
              {starter}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}
