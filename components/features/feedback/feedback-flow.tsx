'use client';

import { AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { copy } from '@/config/copy';
import { estimateMinutes, getQuestionSet, minutesLeft, sections } from '@/config/questions';
import { ErrorState } from '@/components/ui/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useService } from '@/lib/hooks/use-service';
import { isAnswered } from '@/lib/services/answers';
import { clearDraft, saveDraft } from '@/lib/services/drafts';
import {
  FeedbackError,
  getFeedbackSession,
  submitFeedback,
  type FeedbackSession,
  type SubmitResult,
} from '@/lib/services/feedback';
import type { AnswerMap, AnswerValue, Question, WindowType } from '@/lib/types';
import { AnswersView } from './answers-view';
import { FlowFrame } from './flow-frame';
import { FlowHeader } from './flow-header';
import { ClosedState, NotFoundState, UpcomingState } from './guard-state';
import { IntroCard } from './intro-card';
import { QuestionBody } from './question-body';
import { QuestionFooter } from './question-footer';
import { ReviewScreen } from './review-screen';
import { SuccessScreen } from './success-screen';

type Phase = 'intro' | 'questions' | 'review' | 'success';

/** Delay before a scale answer moves on. Long enough to see the choice, short enough to feel quick. */
const AUTO_ADVANCE_MS = 300;

function LeaveHeader({ title }: { title: string }) {
  return (
    <div className="mx-auto flex w-full max-w-xl items-center gap-1 px-2 py-1 sm:px-4">
      <Link
        href="/student"
        aria-label={copy.flow.exit}
        className="hover:bg-sunken flex size-12 items-center justify-center rounded-full"
      >
        <X className="size-5" aria-hidden />
      </Link>
      <p className="text-sm font-bold">{title}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Loads the session, then hands over to the controller.
// ---------------------------------------------------------------------------

export function FeedbackFlow({
  assignmentId,
  window: win,
  viewAnswers,
}: {
  assignmentId: string;
  window: WindowType;
  /** Opened from History: go straight to the read-only answers. */
  viewAnswers: boolean;
}) {
  const { data, error, loading, reload } = useService(() => getFeedbackSession(assignmentId, win));
  // The controller owns its own state after the first load. Later reloads (caused by
  // autosave) must not reset it, so we keep the first session we got.
  const [session, setSession] = useState<FeedbackSession | null>(null);
  if (data && !session) setSession(data);

  if (error) {
    return (
      <FlowFrame header={<LeaveHeader title="" />}>
        <ErrorState title={copy.flow.guard.errorTitle} onRetry={reload} />
      </FlowFrame>
    );
  }
  if (!session && loading) {
    return (
      <FlowFrame header={<LeaveHeader title="" />}>
        <div role="status" aria-label={copy.common.loading} className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-64 w-full" />
        </div>
      </FlowFrame>
    );
  }
  if (!session) {
    return (
      <FlowFrame header={<LeaveHeader title="" />}>
        <NotFoundState />
      </FlowFrame>
    );
  }

  return <FlowController session={session} viewAnswers={viewAnswers} />;
}

// ---------------------------------------------------------------------------
// The flow itself.
// ---------------------------------------------------------------------------

function FlowController({
  session,
  viewAnswers,
}: {
  session: FeedbackSession;
  viewAnswers: boolean;
}) {
  const { context, window: win, receipt, sentAnswers, draft, status } = session;
  const assignmentId = context.assignment.id;
  const questions = getQuestionSet(win).questions;
  const last = questions.length - 1;
  const editing = receipt !== null;
  const t = copy.flow;

  const hadDraft = !editing && draft !== null && Object.keys(draft.answers).length > 0;

  const [phase, setPhase] = useState<Phase>(editing ? 'review' : 'intro');
  const [answers, setAnswers] = useState<AnswerMap>(() => draft?.answers ?? sentAnswers ?? {});
  const [skipped, setSkipped] = useState<string[]>(() => draft?.skipped ?? []);
  const [index, setIndex] = useState(() => Math.min(Math.max(draft?.position ?? 0, 0), last));
  const [direction, setDirection] = useState<1 | -1>(1);
  const [fromReview, setFromReview] = useState(false);
  const [draftOffered, setDraftOffered] = useState(hadDraft);
  const [dirty, setDirty] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [showAnswers, setShowAnswers] = useState(viewAnswers);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelAdvance = useCallback(() => {
    if (timer.current !== null) {
      globalThis.clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);
  useEffect(() => cancelAdvance, [cancelAdvance]);

  // Autosave after every change. Skipped until the student actually changes something.
  useEffect(() => {
    if (!dirty || phase === 'success') return;
    void saveDraft({ assignmentId, window: win, answers, skipped, position: index });
  }, [answers, skipped, index, dirty, phase, assignmentId, win]);

  // --- guards ---------------------------------------------------------------
  if (status === 'upcoming') {
    return (
      <FlowFrame header={<LeaveHeader title="" />}>
        <UpcomingState context={context} window={win} />
      </FlowFrame>
    );
  }
  if (status === 'closed') {
    if (receipt && showAnswers) {
      return (
        <FlowFrame>
          <AnswersView
            context={context}
            window={win}
            answers={sentAnswers ?? {}}
            backHref={viewAnswers ? '/student/history' : '/student'}
          />
        </FlowFrame>
      );
    }
    return (
      <FlowFrame header={<LeaveHeader title="" />}>
        <ClosedState
          context={context}
          window={win}
          submitted={receipt !== null}
          onViewAnswers={() => setShowAnswers(true)}
        />
      </FlowFrame>
    );
  }

  // --- handlers --------------------------------------------------------------
  const question = questions[index]!;

  function toReview() {
    setFromReview(false);
    setDirection(1);
    setPhase('review');
  }

  function goNext() {
    cancelAdvance();
    if (fromReview) return toReview();
    if (index < last) {
      setDirection(1);
      setIndex(index + 1);
    } else toReview();
  }

  function goBack() {
    cancelAdvance();
    if (fromReview) return toReview();
    setDirection(-1);
    if (index > 0) setIndex(index - 1);
    else setPhase(editing ? 'review' : 'intro');
  }

  function setAnswer(q: Question, value: AnswerValue) {
    setDirty(true);
    setAnswers((current) => {
      const next = { ...current };
      if (isAnswered(q, value)) next[q.id] = value;
      else delete next[q.id];
      return next;
    });
    setSkipped((current) => current.filter((id) => id !== q.id));
  }

  function onChange(value: AnswerValue) {
    setAnswer(question, value);
    // Single choice moves on by itself. Back or Skip cancels it cleanly.
    if (question.type === 'scale') {
      cancelAdvance();
      timer.current = globalThis.setTimeout(goNext, AUTO_ADVANCE_MS);
    }
  }

  function skip() {
    cancelAdvance();
    setDirty(true);
    setAnswers((current) => {
      const next = { ...current };
      delete next[question.id];
      return next;
    });
    setSkipped((current) => (current.includes(question.id) ? current : [...current, question.id]));
    goNext();
  }

  function jumpTo(i: number) {
    setFromReview(true);
    setDirection(1);
    setIndex(i);
    setPhase('questions');
  }

  async function startOver() {
    await clearDraft(assignmentId, win);
    setAnswers({});
    setSkipped([]);
    setIndex(0);
    setDraftOffered(false);
    setDirty(false);
    setDirection(1);
    setPhase('questions');
  }

  async function send() {
    setSending(true);
    setSendError(null);
    try {
      setResult(await submitFeedback(assignmentId, win, answers));
      setDirection(1);
      setPhase('success');
    } catch (err) {
      setSendError(
        err instanceof FeedbackError && err.code === 'WINDOW_NOT_OPEN'
          ? t.review.closedError
          : t.review.sendError,
      );
    } finally {
      setSending(false);
    }
  }

  // --- screens ---------------------------------------------------------------
  if (phase === 'intro') {
    return (
      <FlowFrame header={<LeaveHeader title="" />}>
        <IntroCard
          context={context}
          window={win}
          minutes={estimateMinutes(questions)}
          draftPosition={draftOffered || (dirty && Object.keys(answers).length > 0) ? index : null}
          onStart={() => {
            setDirection(1);
            setPhase('questions');
          }}
          onContinue={() => {
            setDirection(1);
            setPhase('questions');
          }}
          onStartOver={startOver}
        />
      </FlowFrame>
    );
  }

  if (phase === 'success' && result) {
    return (
      <FlowFrame>
        <SuccessScreen
          assignmentId={assignmentId}
          window={win}
          updated={result.updated}
          closesAt={result.closesAt}
          answers={answers}
        />
      </FlowFrame>
    );
  }

  if (phase === 'review') {
    return (
      <FlowFrame
        header={
          <FlowHeader
            sectionTitle={t.review.headerTitle}
            progress={questions.length}
            total={questions.length}
            minutesLeft={null}
          />
        }
      >
        <ReviewScreen
          questions={questions}
          answers={answers}
          editing={editing}
          sending={sending}
          error={sendError}
          onJump={jumpTo}
          onSend={send}
        />
      </FlowFrame>
    );
  }

  const firstOfSection = index === 0 || questions[index - 1]?.section !== question.section;
  const answered = isAnswered(question, answers[question.id]);

  return (
    <FlowFrame
      header={
        <FlowHeader
          sectionTitle={sections[question.section]?.title ?? ''}
          progress={index}
          total={questions.length}
          minutesLeft={minutesLeft(questions, index)}
          counter={t.question.counter(index + 1, questions.length)}
        />
      }
      footer={<QuestionFooter answered={answered} onBack={goBack} onSkip={skip} onNext={goNext} />}
    >
      <AnimatePresence mode="wait" initial={false}>
        <QuestionBody
          key={question.id}
          question={question}
          subtitle={firstOfSection ? (sections[question.section]?.subtitle ?? null) : null}
          value={answers[question.id]}
          direction={direction}
          onChange={onChange}
          onConfirm={goNext}
          onSwipeNext={() => (answered ? goNext() : skip())}
          onSwipeBack={goBack}
        />
      </AnimatePresence>
    </FlowFrame>
  );
}
