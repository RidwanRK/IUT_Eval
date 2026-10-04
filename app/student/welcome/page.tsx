import type { Metadata } from 'next';
import { OnboardingFlow } from '@/components/features/onboarding/onboarding-flow';

export const metadata: Metadata = { title: 'Welcome' };

export default function WelcomePage() {
  return <OnboardingFlow />;
}
