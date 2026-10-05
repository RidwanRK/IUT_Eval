'use client';

import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { copy } from '@/config/copy';
import { Badge } from '@/components/ui/badge';
import type { CourseCard } from '@/lib/services/dashboard';
import { cn } from '@/lib/utils';
import { WindowLine } from './window-line';

/** One course in the dashboard list. Collapsed by default, opens to show each teacher and window. */
export function CourseItem({ card, now }: { card: CourseCard; now: Date }) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} asChild>
      <li>
        <h2>
          <Collapsible.Trigger className="hover:bg-canvas flex min-h-16 w-full items-center justify-between gap-3 px-5 py-3 text-left sm:px-6">
            <span className="min-w-0">
              <span className="text-muted tabular block text-sm font-semibold">
                {card.course.code}
              </span>
              <span className="block text-lg font-extrabold tracking-tight">
                {card.course.title}
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-3">
              {card.needsFeedback && <Badge tone="brand">{copy.dashboard.chips.waiting}</Badge>}
              <ChevronDown
                className={cn('text-muted size-5 transition-transform', open && 'rotate-180')}
                aria-hidden
              />
            </span>
          </Collapsible.Trigger>
        </h2>
        <Collapsible.Content>
          <div className="divide-line border-line divide-y border-t">
            {card.rows.map((row) => (
              <section key={row.assignment.id} className="px-5 py-4 sm:px-6">
                <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <h3 className="font-bold">{row.instructor.name}</h3>
                  <Badge tone="neutral">{copy.windows.roles[row.assignment.role]}</Badge>
                  {row.assignment.note && (
                    <span className="text-muted text-sm">{row.assignment.note}</span>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <WindowLine
                    line={row.lines.midterm}
                    assignmentId={row.assignment.id}
                    context={`${card.course.title}, ${row.instructor.name}`}
                    now={now}
                  />
                  <WindowLine
                    line={row.lines.final}
                    assignmentId={row.assignment.id}
                    context={`${card.course.title}, ${row.instructor.name}`}
                    now={now}
                  />
                </div>
              </section>
            ))}
          </div>
        </Collapsible.Content>
      </li>
    </Collapsible.Root>
  );
}
