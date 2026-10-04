'use client';

import { Mail } from 'lucide-react';
import { useState } from 'react';
import { copy } from '@/config/copy';
import {
  validateProfile,
  type ProfileFormValues,
} from '@/components/features/onboarding/profile-validation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/toast';
import { useService } from '@/lib/hooks/use-service';
import { saveProfile } from '@/lib/services/profile';
import { getReminderPrefs, saveReminderPrefs } from '@/lib/services/reminders';
import type { ReminderChannelPrefs, ReminderPrefs, Student } from '@/lib/types';

const t = copy.settings.reminders;

type Channel = keyof ReminderPrefs;
type Key = keyof ReminderChannelPrefs;

export function RemindersSection({
  student,
  values,
  onValuesChange,
}: {
  student: Student;
  values: ProfileFormValues;
  onValuesChange: (patch: Partial<ProfileFormValues>) => void;
}) {
  const { toast } = useToast();
  const { data: prefs, error, reload } = useService(getReminderPrefs);
  const [emailError, setEmailError] = useState<string | undefined>();
  const [savingEmail, setSavingEmail] = useState(false);

  const hasEmail = Boolean(student.email);
  const emailDirty = values.email.trim() !== (student.email ?? '');

  async function toggle(channel: Channel, key: Key, checked: boolean) {
    if (!prefs) return;
    await saveReminderPrefs({ ...prefs, [channel]: { ...prefs[channel], [key]: checked } });
  }

  async function saveEmail() {
    const found = validateProfile(values, ['email']);
    setEmailError(found.email);
    if (found.email) return;
    setSavingEmail(true);
    try {
      await saveProfile({
        displayName: student.displayName,
        studentId: student.studentId,
        department: student.department,
        level: student.level,
        email: values.email,
        avatar: student.avatar,
      });
      toast(t.emailSaved);
    } catch {
      toast(copy.toasts.genericError, 'warn');
    } finally {
      setSavingEmail(false);
    }
  }

  return (
    <Card className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-extrabold tracking-tight">{t.title}</h2>
        <p className="text-muted text-sm">{t.body}</p>
      </div>

      {error ? (
        <ErrorState title={copy.settings.errorTitle} onRetry={reload} />
      ) : !prefs ? (
        <div role="status" aria-label={copy.common.loading} className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <>
          <fieldset>
            <legend className="mb-1 font-bold">{t.inApp}</legend>
            <div className="divide-line divide-y">
              <Switch
                label={t.windowOpens}
                checked={prefs.inApp.windowOpens}
                onCheckedChange={(c) => void toggle('inApp', 'windowOpens', c)}
              />
              <Switch
                label={t.closingSoon}
                checked={prefs.inApp.closingSoon}
                onCheckedChange={(c) => void toggle('inApp', 'closingSoon', c)}
              />
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 flex items-center gap-2 font-bold">
              <Mail className="text-muted size-4" aria-hidden />
              {t.email}
            </legend>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
              <Input
                label={t.emailLabel}
                type="email"
                value={values.email}
                onChange={(e) => {
                  onValuesChange({ email: e.target.value });
                  setEmailError(undefined);
                }}
                error={emailError}
                autoComplete="email"
                className="flex-1"
              />
              <Button
                variant="secondary"
                onClick={saveEmail}
                loading={savingEmail}
                disabled={!emailDirty}
                className="sm:mt-7"
              >
                {t.emailSave}
              </Button>
            </div>

            <div className="divide-line mt-2 divide-y">
              <Switch
                label={t.windowOpens}
                checked={prefs.email.windowOpens && hasEmail}
                disabled={!hasEmail}
                hint={hasEmail ? undefined : t.emailMissing}
                onCheckedChange={(c) => void toggle('email', 'windowOpens', c)}
              />
              <Switch
                label={t.closingSoon}
                checked={prefs.email.closingSoon && hasEmail}
                disabled={!hasEmail}
                hint={hasEmail ? undefined : t.emailMissing}
                onCheckedChange={(c) => void toggle('email', 'closingSoon', c)}
              />
            </div>
            <p className="text-muted mt-2 text-sm">{t.emailMockNote}</p>
          </fieldset>
        </>
      )}
    </Card>
  );
}
