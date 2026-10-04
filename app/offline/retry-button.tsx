'use client';

import { Button } from '@/components/ui/button';

export function RetryButton({ label }: { label: string }) {
  return (
    <Button size="lg" className="mt-8" onClick={() => window.location.reload()}>
      {label}
    </Button>
  );
}
