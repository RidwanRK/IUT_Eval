'use client';

import { Calendar, Inbox } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import {
  AVATAR_COLORS,
  Avatar,
  Badge,
  BottomSheet,
  Button,
  Card,
  CardDescription,
  CardTitle,
  Chip,
  Dialog,
  EmptyState,
  ErrorState,
  Input,
  PRESET_AVATARS,
  ProgressBar,
  Select,
  Skeleton,
  Switch,
  TextArea,
  useToast,
} from '@/components/ui';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

const swatches = [
  ['brand', 'bg-brand text-white'],
  ['brand-hover', 'bg-brand-hover text-white'],
  ['brand-50', 'bg-brand-50 text-ink'],
  ['ink', 'bg-ink text-white'],
  ['muted', 'bg-muted text-white'],
  ['canvas', 'bg-canvas text-ink border border-line'],
  ['surface', 'bg-surface text-ink border border-line'],
  ['warn-bg', 'bg-warn-bg text-warn-ink border border-warn-line'],
  ['ok-bg', 'bg-ok-bg text-ok-ink'],
] as const;

/** PROTOTYPE ONLY. Shows every base component in one place. */
export function ComponentsShowcase() {
  const { toast } = useToast();
  const [dialog, setDialog] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [chips, setChips] = useState<string[]>(['Clear explanations']);
  const [on, setOn] = useState(true);
  const [text, setText] = useState('');
  const [select, setSelect] = useState('');

  return (
    <div className="mx-auto max-w-3xl space-y-12 px-4 py-10 sm:px-6">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Components</h1>
        <p className="text-muted mt-1">
          Prototype page. Every base component in the red and white system.
        </p>
      </header>

      <Section title="Colour">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {swatches.map(([name, cls]) => (
            <div key={name} className={`rounded-control p-4 text-sm font-semibold ${cls}`}>
              {name}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Button">
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="soft">Soft</Button>
          <Button variant="ghost">Ghost</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
          <Button size="lg">Large</Button>
        </div>
      </Section>

      <Section title="Card">
        <Card>
          <CardTitle>A rounded card</CardTitle>
          <CardDescription className="mt-1">
            White surface, subtle shadow, generous space.
          </CardDescription>
        </Card>
      </Section>

      <Section title="Chip and Badge">
        <div className="flex flex-wrap gap-2">
          {['Clear explanations', 'Good examples', 'Well prepared'].map((c) => (
            <Chip
              key={c}
              selected={chips.includes(c)}
              onClick={() =>
                setChips((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]))
              }
            >
              {c}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>Upcoming</Badge>
          <Badge tone="brand">Open</Badge>
          <Badge tone="success">Submitted</Badge>
          <Badge tone="warn">Heads up</Badge>
          <Badge tone="ink">Ink</Badge>
        </div>
      </Section>

      <Section title="Switch">
        <Card>
          <Switch label="When a window opens" checked={on} onCheckedChange={setOn} />
          <Switch
            label="Disabled example"
            hint="Add an email first."
            checked={false}
            onCheckedChange={() => {}}
            disabled
          />
        </Card>
      </Section>

      <Section title="Dialog, Bottom sheet and Toast">
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => setDialog(true)}>
            Open dialog
          </Button>
          <Button variant="secondary" onClick={() => setSheet(true)}>
            Open bottom sheet
          </Button>
          <Button variant="secondary" onClick={() => toast('Saved. Thanks for that.')}>
            Show toast
          </Button>
          <Button variant="secondary" onClick={() => toast('Nothing changed.', 'info')}>
            Info toast
          </Button>
          <Button variant="secondary" onClick={() => toast('Check your connection.', 'warn')}>
            Warning toast
          </Button>
        </div>
        <Dialog
          open={dialog}
          onOpenChange={setDialog}
          title="A friendly dialog"
          description="Short, calm and easy to close."
          footer={<Button onClick={() => setDialog(false)}>Got it</Button>}
        />
        <BottomSheet
          open={sheet}
          onOpenChange={setSheet}
          title="A bottom sheet"
          description="Slides up from the bottom on phones."
        >
          <p className="text-muted">Good for lists and quick choices, reachable with one thumb.</p>
        </BottomSheet>
      </Section>

      <Section title="Progress bar">
        <Card className="space-y-4">
          <ProgressBar value={20} label="20 percent" />
          <ProgressBar value={60} label="60 percent" />
          <ProgressBar value={100} label="100 percent" />
        </Card>
      </Section>

      <Section title="Avatar">
        <div className="flex flex-wrap items-center gap-3">
          <Avatar
            avatar={{ kind: 'initials', color: AVATAR_COLORS[0] }}
            name="Rafi Ahmed"
            size="sm"
          />
          <Avatar avatar={{ kind: 'initials', color: AVATAR_COLORS[2] }} name="Rafi Ahmed" />
          <Avatar
            avatar={{ kind: 'initials', color: AVATAR_COLORS[4] }}
            name="Rafi Ahmed"
            size="lg"
          />
          {PRESET_AVATARS.map((p) => (
            <Avatar key={p.id} avatar={{ kind: 'preset', preset: p.id }} name="" />
          ))}
        </div>
      </Section>

      <Section title="Skeleton">
        <Card className="space-y-3">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </Card>
      </Section>

      <Section title="Empty and error states">
        <Card>
          <EmptyState
            icon={Inbox}
            title="Nothing new right now."
            body="When something needs you, it will show up here."
          />
        </Card>
        <ErrorState onRetry={() => toast('Trying again.', 'info')} />
      </Section>

      <Section title="Inputs">
        <Card className="flex flex-col gap-4">
          <Input label="Name" placeholder="Your first name is fine" />
          <Input
            label="Student ID"
            hint="6 to 12 digits."
            defaultValue="20004"
            error="Student ID should be 6 to 12 digits."
          />
          <Select
            label="Department"
            placeholder="Choose your department"
            value={select}
            onChange={(e) => setSelect(e.target.value)}
            options={[
              { value: 'CSE', label: 'CSE' },
              { value: 'EEE', label: 'EEE' },
            ]}
          />
          <TextArea
            label="Anything else?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={500}
            showCount
            hint="Be specific, be kind."
          />
          <div className="text-muted flex items-center gap-2 text-sm">
            <Calendar className="size-4" aria-hidden /> Icons are used sparingly.
          </div>
        </Card>
      </Section>
    </div>
  );
}
