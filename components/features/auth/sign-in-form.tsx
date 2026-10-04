'use client';

import { ArrowLeft, Eye, EyeOff, Info } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { copy } from '@/config/copy';
import { BrandMark } from '@/components/layout/brand-mark';
import { Button, IconButton } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { signIn } from '@/lib/services/session';
import { useToast } from '@/components/ui/toast';

export function SignInForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const t = copy.signIn;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { hasProfile } = await signIn(studentId, password);
      router.push(hasProfile ? '/student' : '/student/welcome');
    } catch {
      toast(copy.toasts.genericError, 'warn');
      setBusy(false);
    }
  }

  return (
    <main
      className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 py-6 sm:justify-center sm:py-12"
      style={{ paddingBottom: 'max(1.5rem, var(--safe-bottom))' }}
    >
      <Link
        href="/"
        className="rounded-control text-muted hover:text-ink mb-4 -ml-2 inline-flex min-h-12 items-center gap-2 self-start px-2 font-semibold"
      >
        <ArrowLeft className="size-5" aria-hidden />
        {t.back}
      </Link>

      <Card className="p-6 sm:p-8">
        <BrandMark />
        <h1 className="mt-6 text-2xl font-extrabold tracking-tight">{t.title}</h1>
        <p className="text-muted mt-1">{t.subtitle}</p>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4" noValidate>
          <Input
            label={t.studentIdLabel}
            placeholder={t.studentIdPlaceholder}
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            inputMode="numeric"
            autoComplete="username"
          />
          <Input
            label={t.passwordLabel}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            trailing={
              <IconButton
                label={showPassword ? t.hidePassword : t.showPassword}
                onClick={() => setShowPassword((v) => !v)}
                className="size-10"
              >
                {showPassword ? (
                  <EyeOff className="size-5" aria-hidden />
                ) : (
                  <Eye className="size-5" aria-hidden />
                )}
              </IconButton>
            }
          />

          <p className="bg-sunken text-muted flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
            {t.prototypeNote}
          </p>

          <Button type="submit" size="lg" block loading={busy}>
            {t.continue}
          </Button>
        </form>
      </Card>
    </main>
  );
}
