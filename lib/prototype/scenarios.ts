/**
 * PROTOTYPE ONLY. Demo scenarios move the simulated date so every window state can be shown.
 * They work by setting the clock override in the services layer. The choice is persisted.
 */
import { MOCK_DEFAULT_NOW, getCatalog } from '@/lib/mock/catalog';
import { KEYS, storage } from '@/lib/storage';
import { setClockOverride } from '@/lib/services/clock';
import { clearDraftsFor } from '@/lib/services/drafts';
import { requireProfile } from '@/lib/services/profile';
import { deleteReceiptsFor } from '@/lib/services/receipts';
import { deleteResponses } from '@/lib/services/responses';

export type ScenarioId =
  'midterm-open' | 'between-windows' | 'final-open' | 'semester-over' | 'fresh-start';

export interface Scenario {
  id: ScenarioId;
  label: string;
  description: string;
  /** The simulated "now" (Bangladesh time). */
  now: string;
}

export const SCENARIOS: readonly Scenario[] = [
  {
    id: 'midterm-open',
    label: 'Midterm window open',
    description: 'Around 25 Oct 2026. Midterm feedback is open, finals are upcoming.',
    now: MOCK_DEFAULT_NOW,
  },
  {
    id: 'between-windows',
    label: 'Between windows',
    description: 'Around 20 Nov 2026. Midterm has closed, final has not opened yet.',
    now: '2026-11-20T06:00:00.000Z',
  },
  {
    id: 'final-open',
    label: 'Final window open',
    description: 'Around 27 Dec 2026. Final feedback is open.',
    now: '2026-12-27T06:00:00.000Z',
  },
  {
    id: 'semester-over',
    label: 'Semester over',
    description: 'Around 15 Jan 2027. Both windows have closed.',
    now: '2027-01-15T06:00:00.000Z',
  },
  {
    id: 'fresh-start',
    label: 'Fresh start',
    description: 'Midterm window open, and this semester’s drafts and sent feedback are cleared.',
    now: MOCK_DEFAULT_NOW,
  },
];

export const DEFAULT_SCENARIO: ScenarioId = 'midterm-open';

export async function getActiveScenarioId(): Promise<ScenarioId> {
  return storage.get<ScenarioId>(KEYS.scenario, DEFAULT_SCENARIO);
}

/** Clears drafts and sent feedback for the current semester. History stays. */
async function clearCurrentSemesterActivity(): Promise<void> {
  const catalog = getCatalog();
  const assignmentIds = new Set(
    Object.values(catalog.assignments)
      .filter((a) => catalog.offerings[a.offeringId]?.semesterId === currentSemesterId())
      .map((a) => a.id),
  );
  const profile = await requireProfile().catch(() => null);
  if (profile) {
    const responseIds = await deleteReceiptsFor(profile.id, assignmentIds);
    await deleteResponses(new Set(responseIds));
  }
  await clearDraftsFor(assignmentIds);
  storage.remove(KEYS.notificationsRead);
}

function currentSemesterId(): string {
  return getCatalog().semesters.find((s) => s.isCurrent)?.id ?? '';
}

export async function applyScenario(id: ScenarioId): Promise<Scenario> {
  const scenario = SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[0]!;
  if (scenario.id === 'fresh-start') await clearCurrentSemesterActivity();
  await setClockOverride(scenario.now);
  storage.set(KEYS.scenario, scenario.id);
  return scenario;
}
