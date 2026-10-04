import {
  BookOpen,
  Bird,
  Compass,
  Coffee,
  Leaf,
  Lightbulb,
  Mountain,
  Telescope,
  type LucideIcon,
} from 'lucide-react';
import type { AvatarChoice, PresetAvatarId } from '@/lib/types';
import { cn, initialsOf } from '@/lib/utils';

export const PRESET_AVATARS: ReadonlyArray<{
  id: PresetAvatarId;
  icon: LucideIcon;
  color: string;
}> = [
  { id: 'book', icon: BookOpen, color: '#c8102e' },
  { id: 'compass', icon: Compass, color: '#1f2937' },
  { id: 'leaf', icon: Leaf, color: '#0f766e' },
  { id: 'coffee', icon: Coffee, color: '#b45309' },
  { id: 'lightbulb', icon: Lightbulb, color: '#4338ca' },
  { id: 'telescope', icon: Telescope, color: '#475569' },
  { id: 'bird', icon: Bird, color: '#0369a1' },
  { id: 'mountain', icon: Mountain, color: '#6d28d9' },
];

/** Colours for initials avatars. All hold 4.5:1 or better against white text. */
export const AVATAR_COLORS = [
  '#c8102e',
  '#1f2937',
  '#0f766e',
  '#b45309',
  '#4338ca',
  '#475569',
] as const;

const sizes = {
  sm: 'size-9 text-xs',
  md: 'size-12 text-sm',
  lg: 'size-16 text-xl',
  xl: 'size-24 text-3xl',
} as const;

const iconSizes = { sm: 'size-4', md: 'size-6', lg: 'size-8', xl: 'size-12' } as const;

export function Avatar({
  avatar,
  name,
  size = 'md',
  className,
}: {
  avatar: AvatarChoice;
  name: string;
  size?: keyof typeof sizes;
  className?: string;
}) {
  if (avatar.kind === 'preset') {
    const preset = PRESET_AVATARS.find((p) => p.id === avatar.preset) ?? PRESET_AVATARS[0]!;
    const Icon = preset.icon;
    return (
      <span
        aria-hidden
        className={cn(
          'inline-flex shrink-0 items-center justify-center rounded-full text-white',
          sizes[size],
          className,
        )}
        style={{ backgroundColor: preset.color }}
      >
        <Icon className={iconSizes[size]} />
      </span>
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white',
        sizes[size],
        className,
      )}
      style={{ backgroundColor: avatar.color }}
    >
      {initialsOf(name)}
    </span>
  );
}
