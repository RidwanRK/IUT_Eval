import { ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';
import { copy } from '@/config/copy';
import { getQuestionSet, sections } from '@/config/questions';
import { Badge } from '@/components/ui/badge';
import { buttonStyles } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatAnswer } from '@/lib/services/answers';
import type { AssignmentContext } from '@/lib/services/teaching';
import { formatShortDate } from '@/lib/services/window-logic';
import type { AnswerMap, Question, WindowType } from '@/lib/types';

const t = copy.flow.answers;

/** Read-only "Your answers", for windows that have closed. Also used by History. */
export function AnswersView({
  context,
  window,
  answers,
  backHref,
}: {
  context: AssignmentContext;
  window: WindowType;
  answers: AnswerMap;
  backHref: string;
}) {
  const { course, instructor, assignment, semester } = context;
  const questions = getQuestionSet(window).questions;

  const groups: Array<{ section: string; items: Question[] }> = [];
  for (const q of questions) {
    const last = groups[groups.length - 1];
    if (last && last.section === q.section) last.items.push(q);
    else groups.push({ section: q.section, items: [q] });
  }

  return (
    <div className="flex flex-col gap-5">
      <Link
        href={backHref}
        className="text-muted hover:text-ink rounded-control -ml-2 inline-flex min-h-12 items-center gap-2 self-start px-2 font-semibold"
      >
        <ArrowLeft className="size-5" aria-hidden />
        {t.back}
      </Link>

      <div>
        <p className="text-brand text-sm font-bold">
          {copy.flow.intro.eyebrow(copy.windows[window], semester.label)}
        </p>
        <h1 className="mt-1 text-3xl leading-tight font-extrabold tracking-tight">{t.title}</h1>
        <p className="mt-2 font-bold">
          {course.code} {course.title}
        </p>
        <p className="text-muted mt-1 flex flex-wrap items-center gap-x-2 text-sm">
          {instructor.name}
          <Badge>{copy.windows.roles[assignment.role]}</Badge>
          {assignment.note && <span>{assignment.note}</span>}
        </p>
      </div>

      <p className="bg-sunken text-muted flex items-start gap-3 rounded-xl p-3.5 text-sm">
        <Lock className="mt-0.5 size-5 shrink-0" aria-hidden />
        {t.closedNote(formatShortDate(context.windows[window].closesAt))}
      </p>

      {groups.map((group) => (
        <Card key={group.section} className="p-0">
          <h2 className="border-line border-b px-5 py-3 font-bold">
            {sections[group.section]?.title ?? group.section}
          </h2>
          <dl className="divide-line divide-y">
            {group.items.map((q) => {
              const text = formatAnswer(q, answers[q.id]);
              return (
                <div key={q.id} className="px-5 py-3.5">
                  <dt className="text-muted text-sm font-medium">{q.text}</dt>
                  <dd className={text ? 'mt-1 font-semibold' : 'text-muted mt-1 italic'}>
                    {text ?? t.skipped}
                  </dd>
                </div>
              );
            })}
          </dl>
        </Card>
      ))}

      <Link href={backHref} className={buttonStyles({ variant: 'secondary', block: true })}>
        {t.back}
      </Link>
    </div>
  );
}
