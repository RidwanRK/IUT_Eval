'use client';

import { motion, useDragControls, type PanInfo } from 'framer-motion';
import { useEffect, useId, useRef } from 'react';
import type { AnswerValue, Question } from '@/lib/types';
import { ChipsInput, ScaleInput, SliderInput, TextInput } from './question-inputs';

const SWIPE_DISTANCE = 90;
const SWIPE_VELOCITY = 600;

/**
 * One question on one card. Buttons always work. On touch screens you can also swipe the
 * card: left moves on, right goes back. Scale and chip cards swipe from anywhere; slider and
 * text cards swipe only from the heading, so dragging a slider never moves the card.
 */
export function QuestionBody({
  question,
  subtitle,
  value,
  direction,
  onChange,
  onConfirm,
  onSwipeNext,
  onSwipeBack,
}: {
  question: Question;
  /** Section intro, shown inside the first card of a section only. */
  subtitle: string | null;
  value: AnswerValue | undefined;
  direction: 1 | -1;
  onChange: (value: AnswerValue) => void;
  /** Enter on a chosen scale answer. */
  onConfirm: () => void;
  onSwipeNext: () => void;
  onSwipeBack: () => void;
}) {
  const headingId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const controls = useDragControls();
  const justDragged = useRef(false);
  const swipeFromAnywhere = question.type === 'scale' || question.type === 'chips';

  // Move focus to the question so keyboard and screen reader users start in the right place.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  function onDragEnd(_: unknown, info: PanInfo) {
    window.setTimeout(() => (justDragged.current = false), 60);
    if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) onSwipeNext();
    else if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) onSwipeBack();
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 28 * direction }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -28 * direction }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      <motion.div
        drag="x"
        dragListener={swipeFromAnywhere}
        dragControls={controls}
        dragDirectionLock
        dragSnapToOrigin
        dragElastic={0.3}
        dragConstraints={{ left: 0, right: 0 }}
        onDragStart={() => (justDragged.current = true)}
        onDragEnd={onDragEnd}
        // A swipe must never also count as a tap on an option underneath it.
        onClickCapture={(e) => {
          if (justDragged.current) {
            e.stopPropagation();
            e.preventDefault();
          }
        }}
        style={{ touchAction: swipeFromAnywhere ? 'pan-y' : undefined }}
        className="border-line bg-surface shadow-card rounded-card border p-5 sm:p-8"
      >
        <div
          onPointerDown={swipeFromAnywhere ? undefined : (e) => controls.start(e)}
          style={{ touchAction: swipeFromAnywhere ? undefined : 'none' }}
        >
          {subtitle && <p className="text-brand mb-2 text-sm font-bold">{subtitle}</p>}
          <h1
            id={headingId}
            ref={headingRef}
            tabIndex={-1}
            className="text-2xl leading-snug font-extrabold tracking-tight outline-none"
          >
            {question.text}
          </h1>
        </div>

        <div className="mt-6">
          {question.type === 'scale' && (
            <ScaleInput
              question={question}
              value={typeof value === 'string' ? value : undefined}
              onSelect={onChange}
              onConfirm={onConfirm}
              labelledBy={headingId}
            />
          )}
          {question.type === 'chips' && (
            <ChipsInput
              question={question}
              value={Array.isArray(value) ? value : []}
              onChange={onChange}
              labelledBy={headingId}
            />
          )}
          {question.type === 'slider' && (
            <SliderInput
              question={question}
              value={typeof value === 'number' ? value : undefined}
              onChange={onChange}
            />
          )}
          {question.type === 'text' && (
            <TextInput
              question={question}
              value={typeof value === 'string' ? value : ''}
              onChange={onChange}
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
