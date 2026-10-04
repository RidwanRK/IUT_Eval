'use client';

import { LogOut, RotateCcw, Wrench } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { copy } from '@/config/copy';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { useToast } from '@/components/ui/toast';
import { useService } from '@/lib/hooks/use-service';
import {
  SCENARIOS,
  applyScenario,
  getActiveScenarioId,
  type ScenarioId,
} from '@/lib/prototype/scenarios';
import { signOut } from '@/lib/services/session';
import { storage } from '@/lib/storage';

const t = copy.prototypeTools;

const scenarioOptions = SCENARIOS.map((s) => ({ value: s.id, label: s.label }));

/**
 * PROTOTYPE ONLY. A floating button with demo helpers. Rendered from the root layout only
 * when NEXT_PUBLIC_PROTOTYPE_TOOLS is not "false". Delete this folder to remove it.
 */
export function PrototypeTools() {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const { data: scenarioId } = useService(getActiveScenarioId);

  // Keep the feedback screens clear: their buttons sit where this button would be.
  if (pathname.startsWith('/student/feedback')) return null;

  const active = SCENARIOS.find((s) => s.id === scenarioId);

  function close(next: boolean) {
    setOpen(next);
    if (!next) setConfirmReset(false);
  }

  async function onScenario(id: ScenarioId) {
    const scenario = await applyScenario(id);
    toast(copy.toasts.scenarioChanged(scenario.label), 'info');
  }

  async function onSignOut() {
    await signOut();
    close(false);
    toast(copy.toasts.signedOut, 'info');
    router.push('/');
  }

  function onReset() {
    storage.clearAll();
    // Full reload so every screen starts from a clean slate.
    window.location.replace('/');
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border-line-strong bg-surface shadow-raised hover:bg-sunken fixed right-4 z-40 flex size-12 items-center justify-center gap-2 rounded-full border text-sm font-semibold sm:w-auto sm:px-4 lg:bottom-6"
        style={{ bottom: 'calc(var(--tabbar-height) + var(--safe-bottom) + 0.75rem)' }}
      >
        <Wrench className="size-4" aria-hidden />
        <span className="sr-only sm:not-sr-only">{t.open}</span>
      </button>

      <BottomSheet open={open} onOpenChange={close} title={t.title} description={t.description}>
        <p className="text-muted mb-4 text-sm">{t.description}</p>
        <div className="flex flex-col gap-4">
          <Select
            label={t.scenarioLabel}
            hint={active?.description ?? t.scenarioHint}
            options={scenarioOptions}
            value={scenarioId ?? 'midterm-open'}
            onChange={(e) => void onScenario(e.target.value as ScenarioId)}
          />
          {confirmReset ? (
            <div className="rounded-control border-warn-line bg-warn-bg border p-4">
              <p className="text-warn-ink font-semibold">{t.resetConfirmTitle}</p>
              <p className="text-warn-ink mt-1 text-sm">{t.resetConfirmBody}</p>
              <div className="mt-4 flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setConfirmReset(false)}
                  className="flex-1"
                >
                  {t.cancel}
                </Button>
                <Button onClick={onReset} className="flex-1">
                  {t.resetConfirm}
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="secondary" block onClick={() => setConfirmReset(true)}>
              <RotateCcw className="size-4" aria-hidden />
              {t.reset}
            </Button>
          )}
          <Button variant="secondary" block onClick={onSignOut}>
            <LogOut className="size-4" aria-hidden />
            {t.signOut}
          </Button>
        </div>
      </BottomSheet>
    </>
  );
}
