'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { copy } from '@/config/copy';
import { BrandMark } from '@/components/layout/brand-mark';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import { getProfile, saveProfile } from '@/lib/services/profile';
import { getSession } from '@/lib/services/session';
import type { AvatarChoice, DepartmentCode } from '@/lib/types';
import { AvatarPicker } from './avatar-picker';
import { ProfileFields } from './profile-fields';
import { validateProfile, type ProfileErrors, type ProfileFormValues } from './profile-validation';

const t = copy.onboarding;

const STEPS = [
  { key: 'about', fields: ['displayName', 'studentId'] },
  { key: 'studies', fields: ['department', 'level', 'email'] },
  { key: 'avatar', fields: [] },
] as const satisfies ReadonlyArray<{
  key: keyof typeof t.steps;
  fields: ReadonlyArray<keyof ProfileFormValues>;
}>;

const emptyValues: ProfileFormValues = {
  displayName: '',
  studentId: '',
  department: '',
  level: '',
  email: '',
};

export function OnboardingFlow() {
  const router = useRouter();
  const { toast } = useToast();
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [values, setValues] = useState<ProfileFormValues>(emptyValues);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [avatar, setAvatar] = useState<AvatarChoice>({ kind: 'initials', color: '#c8102e' });
  const [saving, setSaving] = useState(false);

  // Guard: need a session to be here, and an existing profile means onboarding is done.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [session, profile] = await Promise.all([getSession(), getProfile()]);
      if (cancelled) return;
      if (!session) router.replace('/student/sign-in');
      else if (profile) router.replace('/student');
      else setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const current = STEPS[step]!;
  const isLast = step === STEPS.length - 1;

  function patch(p: Partial<ProfileFormValues>) {
    setValues((v) => ({ ...v, ...p }));
    // Clear a message as soon as the person starts fixing that field.
    setErrors((e) => {
      const next = { ...e };
      (Object.keys(p) as Array<keyof ProfileFormValues>).forEach((k) => delete next[k]);
      return next;
    });
  }

  function go(delta: 1 | -1) {
    setDirection(delta);
    setStep((s) => s + delta);
  }

  function onNext() {
    const found = validateProfile(values, current.fields);
    setErrors(found);
    if (Object.keys(found).length === 0) go(1);
  }

  async function onFinish() {
    setSaving(true);
    try {
      await saveProfile({
        displayName: values.displayName,
        studentId: values.studentId,
        department: values.department as DepartmentCode,
        level: Number(values.level),
        email: values.email,
        avatar,
      });
      router.replace('/student');
    } catch {
      toast(copy.toasts.genericError, 'warn');
      setSaving(false);
    }
  }

  if (!ready) {
    return (
      <div
        className="mx-auto w-full max-w-md space-y-4 px-4 py-12"
        role="status"
        aria-label={copy.common.loading}
      >
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  const stepCopy = t.steps[current.key];

  return (
    <main
      className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 py-6 sm:justify-center sm:py-12"
      style={{ paddingBottom: 'max(1.5rem, var(--safe-bottom))' }}
    >
      <div className="mb-5 flex items-center justify-between">
        <BrandMark />
      </div>

      <Card className="p-6 sm:p-8">
        <p className="text-muted text-sm font-semibold" aria-live="polite">
          {t.stepLabel(step + 1, STEPS.length)}
        </p>
        <ProgressBar
          className="mt-2"
          value={step + 1}
          max={STEPS.length}
          label={t.stepLabel(step + 1, STEPS.length)}
        />

        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={current.key}
            custom={direction}
            initial={{ opacity: 0, x: 24 * direction }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 * direction }}
            transition={{ duration: 0.18 }}
          >
            <h1 className="mt-6 text-2xl font-extrabold tracking-tight">{stepCopy.title}</h1>
            <p className="text-muted mt-1 mb-6">{stepCopy.subtitle}</p>

            {current.key === 'about' && (
              <ProfileFields group="about" values={values} errors={errors} onChange={patch} />
            )}
            {current.key === 'studies' && (
              <ProfileFields group="studies" values={values} errors={errors} onChange={patch} />
            )}
            {current.key === 'avatar' && (
              <div className="flex flex-col gap-6">
                <div className="flex justify-center">
                  <Avatar avatar={avatar} name={values.displayName} size="xl" />
                </div>
                <AvatarPicker value={avatar} name={values.displayName} onChange={setAvatar} />
                <p className="bg-sunken text-muted flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm">
                  <Lock className="mt-0.5 size-4 shrink-0" aria-hidden />
                  {t.privacyLine}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex flex-col gap-3">
          {isLast ? (
            <Button size="lg" block onClick={onFinish} loading={saving}>
              {t.finish}
            </Button>
          ) : (
            <Button size="lg" block onClick={onNext}>
              {t.next}
            </Button>
          )}
          {step > 0 && (
            <Button variant="ghost" block onClick={() => go(-1)} disabled={saving}>
              <ArrowLeft className="size-4" aria-hidden />
              {t.back}
            </Button>
          )}
        </div>
      </Card>
    </main>
  );
}
