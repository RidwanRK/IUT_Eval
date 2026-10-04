'use client';

import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { copy } from '@/config/copy';
import { useStudent } from '@/components/layout/student-context';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useService } from '@/lib/hooks/use-service';
import { getDashboard } from '@/lib/services/dashboard';
import { summarizeDashboard } from '@/lib/services/dashboard-summary';
import { CourseCard } from './course-card';
import { SummaryLine } from './summary-line';

const t = copy.dashboard;

function DashboardSkeleton() {
  return (
    <div role="status" aria-label={copy.common.loading} className="flex flex-col gap-4">
      <Skeleton className="h-16 w-full" />
      <div className="grid items-start gap-4 lg:grid-cols-2">
        {[0, 1].map((i) => (
          <Card key={i} className="space-y-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </Card>
        ))}
      </div>
    </div>
  );
}

export function DashboardView() {
  const student = useStudent();
  const { data, error, loading, reload } = useService(getDashboard);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">
          {t.greeting(student.displayName)}
        </h1>
        <p className="text-muted mt-1 font-medium">{data?.semester?.label ?? ' '}</p>
      </header>

      {error ? (
        <ErrorState title={t.errorTitle} onRetry={reload} />
      ) : loading && !data ? (
        <DashboardSkeleton />
      ) : data && data.courses.length === 0 ? (
        <Card>
          <EmptyState icon={BookOpen} title={t.emptyTitle} body={t.emptyBody} />
        </Card>
      ) : data ? (
        <>
          <SummaryLine summary={summarizeDashboard(data.courses)} />
          <div className="grid items-start gap-4 lg:grid-cols-2">
            {data.courses.map((card, i) => (
              <motion.div
                key={card.offering.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(i, 5) * 0.04 }}
              >
                <CourseCard card={card} now={data.now} />
              </motion.div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
