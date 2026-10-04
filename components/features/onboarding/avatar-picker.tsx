'use client';

import { Check } from 'lucide-react';
import { useId } from 'react';
import { copy } from '@/config/copy';
import { AVATAR_COLORS, Avatar, PRESET_AVATARS } from '@/components/ui/avatar';
import type { AvatarChoice, PresetAvatarId } from '@/lib/types';
import { cn } from '@/lib/utils';

function encode(choice: AvatarChoice): string {
  return choice.kind === 'initials' ? `initials:${choice.color}` : `preset:${choice.preset}`;
}

/**
 * Initials on a colour, or one of 8 simple pictures. No photo upload.
 * Built from native radio inputs, so arrow keys and screen readers work for free.
 */
export function AvatarPicker({
  value,
  name,
  onChange,
}: {
  value: AvatarChoice;
  /** Used to draw the initials. */
  name: string;
  onChange: (choice: AvatarChoice) => void;
}) {
  const group = useId();
  const current = encode(value);
  const t = copy.onboarding;

  function option(choice: AvatarChoice, label: string) {
    const id = encode(choice);
    const selected = id === current;
    return (
      <label key={id} className="relative cursor-pointer">
        <input
          type="radio"
          name={group}
          value={id}
          checked={selected}
          onChange={() => onChange(choice)}
          className="peer sr-only"
        />
        <span className="sr-only">{label}</span>
        <span
          aria-hidden
          className={cn(
            'peer-focus-visible:outline-ink flex size-14 items-center justify-center rounded-full transition-shadow peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2',
            selected
              ? 'ring-brand ring-offset-surface ring-[3px] ring-offset-2'
              : 'hover:ring-line-strong hover:ring-2',
          )}
        >
          <Avatar avatar={choice} name={name || '?'} size="md" className="size-14" />
        </span>
        {selected && (
          <span
            aria-hidden
            className="bg-brand ring-surface absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full text-white ring-2"
          >
            <Check className="size-3.5" strokeWidth={3} />
          </span>
        )}
      </label>
    );
  }

  return (
    <fieldset className="flex flex-col gap-5">
      <legend className="sr-only">{t.steps.avatar.title}</legend>
      <div>
        <p className="mb-3 text-[0.95rem] font-semibold">
          {t.avatarInitials}
          <span className="sr-only">. {t.avatarColor}</span>
        </p>
        <div className="flex flex-wrap gap-4">
          {AVATAR_COLORS.map((color, i) =>
            option({ kind: 'initials', color }, `${t.avatarInitials}, ${t.avatarColor} ${i + 1}`),
          )}
        </div>
      </div>
      <div>
        <p className="mb-3 text-[0.95rem] font-semibold">{t.avatarPresets}</p>
        <div className="flex flex-wrap gap-4">
          {PRESET_AVATARS.map((p) =>
            option({ kind: 'preset', preset: p.id as PresetAvatarId }, t.avatarLabels[p.id]),
          )}
        </div>
      </div>
    </fieldset>
  );
}
