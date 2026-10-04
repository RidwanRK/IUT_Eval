'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { AlertTriangle, ChevronDown, ChevronRight, Lock } from 'lucide-react';
import { useState } from 'react';
import { copy } from '@/config/copy';
import { sections } from '@/config/questions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatAnswer, isAnswered } from '@/lib/services/answers';
import type { AnswerMap, Question } from '@/lib/types';

const t = copy.flow.review;

function groupBySection(questions: readonly Question[]) {
  const groups: Array<{ section: string; items: Array<{ question: Question; index: number }> }> =
    [];
  questions.forEach((question, index) => {
    const last = groups[groups.length - 1];
    if (last && last.section === question.section) last.items.push({ question, index });
    else groups.push({ section: question.section, items: [{ question, index }] });
  });
  return groups;
}

/** "Ready to send?": counts, a compact list grouped by section, the privacy note and Send. */
export function ReviewScreen({
  questions,
  answers,
  editing,
  sending,
  error,
  onJump,
  onSend,
}: {
  questions: readonly Question[];
  answers: AnswerMap;
  /** The student already sent this one and is changing it. */
  editing: boolean;
  sending: boolean;
  error: string | null;
  onJump: (index: number) => void;
  onSend: () => void;
}) {
  const [showNoAnswers, setShowNoAnswers] = useState(false);
  const answeredCount = questions.filter((q) => isAnswered(q, answers[q.id])).length;
  const skippedCount = questions.length - answeredCount;
  const groups = groupBySection(questions);

  function handleSend() {
    if (answeredCount === 0) {
      setShowNoAnswers(true);
      return;
    }
    onSend();
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">{t.title}</h1>
        <p className="text-muted mt-1.5">{t.summary(answeredCount, skippedCount)}</p>
        {editing && <p className="text-muted mt-1.5 text-sm font-medium">{t.editingNote}</p>}
      </div>

      <Card padded={false} className="overflow-hidden">
        <p className="text-muted px-5 pt-4 text-sm">{t.jumpHint}</p>
        <Accordion.Root type="multiple" className="mt-2">
          {groups.map((group) => {
            const info = sections[group.section];
            const done = group.items.filter((i) =>
              isAnswered(i.question, answers[i.question.id]),
            ).length;
            return (
              <Accordion.Item
                key={group.section}
                value={group.section}
                className="border-line border-t"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="hover:bg-canvas group flex min-h-14 w-full items-center justify-between gap-3 px-5 py-3 text-left">
                    <span>
                      <span className="block font-bold">{info?.title ?? group.section}</span>
                      <span className="text-muted block text-sm">
                        {t.sectionCount(done, group.items.length)}
                      </span>
                    </span>
                    <ChevronDown
                      className="text-muted size-5 transition-transform group-data-[state=open]:rotate-180"
                      aria-hidden
                    />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content>
                  <ul className="pb-2">
                    {group.items.map(({ question, index }) => {
                      const text = formatAnswer(question, answers[question.id]);
                      return (
                        <li key={question.id}>
                          <button
                            type="button"
                            onClick={() => onJump(index)}
                            className="hover:bg-canvas flex min-h-14 w-full items-center justify-between gap-3 px-5 py-2.5 text-left"
                          >
                            <span className="min-w-0">
                              <span className="block text-[0.95rem] leading-snug font-semibold">
                                {question.text}
                              </span>
                              <span
                                className={
                                  text
                                    ? 'text-ink mt-0.5 line-clamp-2 block text-sm'
                                    : 'text-muted mt-0.5 block text-sm italic'
                                }
                              >
                                {text ?? t.skipped}
                              </span>
                            </span>
                            <ChevronRight className="text-muted size-5 shrink-0" aria-hidden />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </Accordion.Content>
              </Accordion.Item>
            );
          })}
        </Accordion.Root>
      </Card>

      <p className="bg-sunken flex items-start gap-3 rounded-xl p-3.5 text-sm">
        <Lock className="text-muted mt-0.5 size-5 shrink-0" aria-hidden />
        <span>{copy.flow.anonymity}</span>
      </p>

      {(showNoAnswers && answeredCount === 0) || error ? (
        <p
          role="alert"
          className="border-warn-line bg-warn-bg text-warn-ink flex items-start gap-2 rounded-xl border px-4 py-3 text-sm font-medium"
        >
          <AlertTriangle className="text-warn-icon mt-0.5 size-4 shrink-0" aria-hidden />
          {error ?? t.noAnswers}
        </p>
      ) : null}

      <Button size="lg" block onClick={handleSend} loading={sending}>
        {sending ? t.sending : editing ? t.sendUpdate : t.send}
      </Button>
    </div>
  );
}
