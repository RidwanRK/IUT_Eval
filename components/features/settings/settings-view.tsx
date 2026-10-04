'use client';

import { ChevronRight, HelpCircle, LogOut, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { copy } from '@/config/copy';
import type { ProfileFormValues } from '@/components/features/onboarding/profile-validation';
import { useStudent } from '@/components/layout/student-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { signOut } from '@/lib/services/session';
import { InstallSection } from './install-section';
import { ProfileSection, profileToValues } from './profile-section';
import { RemindersSection } from './reminders-section';

const t = copy.settings;

export function SettingsView() {
  const router = useRouter();
  const { toast } = useToast();
  const student = useStudent();
  // One set of values for the profile form and the reminder email field, so they never disagree.
  const [values, setValues] = useState<ProfileFormValues>(() => profileToValues(student));
  const patch = (p: Partial<ProfileFormValues>) => setValues((v) => ({ ...v, ...p }));

  async function onSignOut() {
    await signOut();
    toast(copy.toasts.signedOut, 'info');
    router.push('/');
  }

  const links = [
    { href: '/student/help#who-sees-what', label: t.links.privacy, icon: ShieldCheck },
    { href: '/student/help', label: t.links.help, icon: HelpCircle },
  ];

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 lg:mx-0">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">{t.title}</h1>
        <p className="text-muted mt-1">{t.subtitle}</p>
      </header>

      <ProfileSection student={student} values={values} onValuesChange={patch} />
      <RemindersSection student={student} values={values} onValuesChange={patch} />
      <InstallSection />

      <Card padded={false}>
        <h2 className="px-5 pt-5 text-xl font-extrabold tracking-tight sm:px-6">{t.links.title}</h2>
        <ul className="divide-line mt-2 divide-y pb-1">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="hover:bg-canvas flex min-h-14 items-center justify-between gap-3 px-5 sm:px-6"
              >
                <span className="flex items-center gap-3 font-semibold">
                  <l.icon className="text-muted size-5" aria-hidden />
                  {l.label}
                </span>
                <ChevronRight className="text-muted size-5" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      <div className="flex flex-col gap-2">
        <Button variant="secondary" size="lg" block onClick={onSignOut}>
          <LogOut className="size-5" aria-hidden />
          {t.signOut}
        </Button>
        <p className="text-muted text-center text-sm">{t.signOutHint}</p>
      </div>
    </div>
  );
}
