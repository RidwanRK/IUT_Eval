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
import { CourseItem } from './course-item';
import { SummaryLine } from './summary-line';

const t = copy.dashboard;

function DashboardSkeleton() {
  return (
    <div role="status" aria-label={copy.common.loading} className="flex flex-col gap-4">
      <Skeleton className="h-16 w-full" />
      <Card padded={false} className="divide-line divide-y">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-2 px-5 py-4 sm:px-6">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        ))}
      </Card>
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
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Card padded={false} className="overflow-hidden">
              <ul className="divide-line divide-y">
                {data.courses.map((card) => (
                  <CourseItem key={card.offering.id} card={card} now={data.now} />
                ))}
              </ul>
            </Card>
          </motion.div>
        </>
      ) : null}
    </div>
  );
}
