'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { copy } from '@/config/copy';
import { institution } from '@/config/institution';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const t = copy.help;

/** Accordion item ids. `who-sees-what` is the target of the Privacy link in Settings. */
const ITEMS = [
  { id: 'why', key: 'why' },
  { id: 'who-sees-what', key: 'who' },
  { id: 'change', key: 'change' },
  { id: 'miss', key: 'miss' },
  { id: 'comment', key: 'comment' },
  { id: 'serious', key: 'serious' },
] as const;

function Paragraphs({ text }: { text: readonly string[] }) {
  return (
    <div className="text-muted space-y-3">
      {text.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  );
}

function ItemBody({ itemKey }: { itemKey: (typeof ITEMS)[number]['key'] }) {
  const item = t.items[itemKey];
  const contact = institution.seriousConcerns;

  return (
    <>
      <Paragraphs text={item.body} />
      {itemKey === 'comment' && (
        <div className="mt-4">
          <p className="mb-2 font-bold">{t.items.comment.examplesTitle}</p>
          <ul className="space-y-2">
            {t.items.comment.examples.map((example) => (
              <li
                key={example}
                className="border-brand bg-brand-50 rounded-r-xl border-l-4 px-4 py-3 text-[0.95rem]"
              >
                {example}
              </li>
            ))}
          </ul>
        </div>
      )}
      {itemKey === 'serious' && (
        <div className="bg-sunken mt-4 rounded-xl p-4">
          <p className="font-bold">{t.items.serious.contactTitle}</p>
          <p className="mt-1">{contact.officeName}</p>
          <dl className="mt-2 space-y-1 text-[0.95rem]">
            <div className="flex gap-2">
              <dt className="text-muted w-16 shrink-0">{t.contactEmail}</dt>
              <dd className="min-w-0 break-words">
                <a className="text-brand font-semibold underline" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-muted w-16 shrink-0">{t.contactPhone}</dt>
              <dd>{contact.phone}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-muted w-16 shrink-0">{t.contactHours}</dt>
              <dd>{contact.hours}</dd>
            </div>
          </dl>
          <p className="text-muted mt-3 text-sm">{t.placeholderNote}</p>
        </div>
      )}
    </>
  );
}

export function HelpView() {
  const [open, setOpen] = useState<string>('why');

  // Open the section named in the link, for example /student/help#who-sees-what.
  useEffect(() => {
    const id = window.location.hash.replace('#', '');
    if (ITEMS.some((i) => i.id === id)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reads the URL hash, which only exists in the browser
      setOpen(id);
      document.getElementById(id)?.scrollIntoView({ block: 'start' });
    }
  }, []);

  return (
    <div className="mx-auto max-w-2xl lg:mx-0">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">{t.title}</h1>
        <p className="text-muted mt-1">{t.subtitle}</p>
      </header>

      <Card padded={false}>
        <Accordion.Root
          type="single"
          collapsible
          value={open}
          onValueChange={setOpen}
          className="divide-line divide-y"
        >
          {ITEMS.map(({ id, key }) => (
            <Accordion.Item key={id} value={id} id={id} className="scroll-mt-24">
              <Accordion.Header>
                <Accordion.Trigger
                  className={cn(
                    'hover:bg-canvas group flex min-h-16 w-full items-center justify-between gap-4 px-5 py-4 text-left text-lg font-bold tracking-tight sm:px-6',
                  )}
                >
                  {t.items[key].title}
                  <ChevronDown
                    className="text-muted size-5 shrink-0 transition-transform group-data-[state=open]:rotate-180"
                    aria-hidden
                  />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="px-5 pb-5 sm:px-6">
                <ItemBody itemKey={key} />
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </Card>
    </div>
  );
}
