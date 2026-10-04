import type { Metadata } from 'next';
import { HelpView } from '@/components/features/help/help-view';

export const metadata: Metadata = { title: 'Help and privacy' };

export default function HelpPage() {
  return <HelpView />;
}
