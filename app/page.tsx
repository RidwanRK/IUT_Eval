import { copy } from '@/config/copy';
import { institution } from '@/config/institution';
import { LandingActions } from '@/components/features/landing/landing-actions';
import { BrandMark } from '@/components/layout/brand-mark';

export default function LandingPage() {
  return (
    <main
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-12"
      style={{
        paddingTop: 'max(3rem, var(--safe-top))',
        paddingBottom: 'max(3rem, var(--safe-bottom))',
      }}
    >
      {/* Soft red wash at the top. Decorative. */}
      <div
        aria-hidden
        className="from-brand-50 pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b to-transparent"
      />

      <div className="relative flex w-full max-w-sm flex-col items-center text-center">
        <BrandMark showName={false} size="lg" />
        <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
          {institution.appName}
        </h1>
        <p className="text-muted mt-3 text-lg">{copy.app.tagline}</p>

        <div className="mt-10 w-full">
          <LandingActions />
        </div>

        <p className="text-muted mt-10 text-sm">{copy.landing.footer}</p>
        <p className="text-muted mt-1 text-sm">{copy.landing.prototypeNote}</p>
      </div>
    </main>
  );
}
