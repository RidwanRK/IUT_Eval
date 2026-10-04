import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ComponentsShowcase } from '@/components/prototype/components-showcase';
import { PROTOTYPE_TOOLS_ENABLED } from '@/lib/prototype/flags';

export const metadata: Metadata = { title: 'Components', robots: { index: false } };

export default function ComponentsPage() {
  if (!PROTOTYPE_TOOLS_ENABLED) notFound();
  return <ComponentsShowcase />;
}
