'use client';

import { Download, Share } from 'lucide-react';
import { useState } from 'react';
import { copy } from '@/config/copy';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useInstallState } from '@/lib/hooks/use-install-prompt';

const t = copy.settings.install;

/** Install help. Hidden once the app is installed. */
export function InstallSection() {
  const state = useInstallState();
  const [busy, setBusy] = useState(false);

  if (state.kind === 'installed') return null;

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-extrabold tracking-tight">{t.title}</h2>
        <p className="text-muted text-sm">{t.body}</p>
      </div>

      {state.kind === 'prompt' && (
        <Button
          size="lg"
          block
          loading={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await state.install();
            } finally {
              setBusy(false);
            }
          }}
        >
          <Download className="size-5" aria-hidden />
          {t.button}
        </Button>
      )}

      {state.kind === 'ios' && (
        <div>
          <p className="flex items-center gap-2 font-bold">
            <Share className="text-muted size-4" aria-hidden />
            {t.iosTitle}
          </p>
          <ol className="text-muted mt-2 list-decimal space-y-1.5 pl-5">
            {t.iosSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {state.kind === 'other' && <p className="text-muted">{t.otherHint}</p>}
    </Card>
  );
}
