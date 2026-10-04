import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import type { ReactNode } from 'react';
import { copy } from '@/config/copy';
import { Providers } from '@/components/layout/providers';
import { PrototypeTools } from '@/components/prototype/prototype-tools';
import { PROTOTYPE_TOOLS_ENABLED } from '@/lib/prototype/flags';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: copy.app.name, template: `%s | ${copy.app.name}` },
  description: copy.app.description,
  applicationName: copy.app.name,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#C8102E',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body>
        <Providers>
          {children}
          {PROTOTYPE_TOOLS_ENABLED && <PrototypeTools />}
        </Providers>
      </body>
    </html>
  );
}
