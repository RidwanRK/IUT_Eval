import { copy } from '@/config/copy';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { CourseCard as CourseCardData } from '@/lib/services/dashboard';
import { WindowLine } from './window-line';

export function CourseCard({ card, now }: { card: CourseCardData; now: Date }) {
  return (
    <Card padded={false} className="overflow-hidden">
      <div className="p-5 pb-3 sm:p-6 sm:pb-3">
        <p className="text-muted tabular text-sm font-semibold">{card.course.code}</p>
        <h2 className="text-xl font-extrabold tracking-tight">{card.course.title}</h2>
      </div>
      <div className="divide-line divide-y">
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
    </Card>
  );
}
