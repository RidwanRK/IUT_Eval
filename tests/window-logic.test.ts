import { describe, expect, it } from 'vitest';
import {
  calendarDaysBetween,
  closesText,
  describeWindow,
  editableUntilText,
  formatShortDate,
  getWindowStatus,
  isClosingSoon,
} from '@/lib/services/window-logic';

// Bangladesh time is UTC+6. These are 12 Oct 00:00 and 26 Oct 23:59:59 local time.
const midterm = {
  type: 'midterm' as const,
  opensAt: '2026-10-11T18:00:00.000Z',
  closesAt: '2026-10-26T17:59:59.000Z',
};
const final = {
  type: 'final' as const,
  opensAt: '2026-12-13T18:00:00.000Z',
  closesAt: '2026-12-28T17:59:59.000Z',
};

// Local noon helper (UTC+6).
const at = (iso: string) => new Date(`${iso}T06:00:00.000Z`);

describe('getWindowStatus', () => {
  it('is upcoming before opensAt', () => {
    expect(getWindowStatus(midterm, new Date('2026-10-11T17:59:59.999Z'))).toBe('upcoming');
  });

  it('is open exactly at opensAt', () => {
    expect(getWindowStatus(midterm, new Date(midterm.opensAt))).toBe('open');
  });

  it('is open in the middle', () => {
    expect(getWindowStatus(midterm, at('2026-10-20'))).toBe('open');
  });

  it('is still open one moment before closesAt', () => {
    expect(getWindowStatus(midterm, new Date('2026-10-26T17:59:58.999Z'))).toBe('open');
  });

  it('is closed exactly at closesAt and after', () => {
    expect(getWindowStatus(midterm, new Date(midterm.closesAt))).toBe('closed');
    expect(getWindowStatus(midterm, at('2027-01-15'))).toBe('closed');
  });

  it('is computed from the dates it is given, nothing hardcoded', () => {
    const shifted = { opensAt: '2030-01-01T00:00:00.000Z', closesAt: '2030-01-10T00:00:00.000Z' };
    expect(getWindowStatus(shifted, new Date('2029-12-31T00:00:00.000Z'))).toBe('upcoming');
    expect(getWindowStatus(shifted, new Date('2030-01-05T00:00:00.000Z'))).toBe('open');
    expect(getWindowStatus(shifted, new Date('2030-01-11T00:00:00.000Z'))).toBe('closed');
  });
});

describe('date helpers', () => {
  it('formats a short date in Bangladesh time', () => {
    // 18:00 UTC on 11 Oct is already 12 Oct in Dhaka.
    expect(formatShortDate(midterm.opensAt)).toBe('12 Oct');
    expect(formatShortDate(midterm.closesAt)).toBe('26 Oct');
  });

  it('counts calendar days, not 24-hour blocks', () => {
    // 23:30 local on the 25th to 00:30 local on the 26th is one calendar day.
    expect(
      calendarDaysBetween(new Date('2026-10-25T17:30:00Z'), new Date('2026-10-25T18:30:00Z')),
    ).toBe(1);
    expect(calendarDaysBetween(at('2026-10-25'), at('2026-10-25'))).toBe(0);
    expect(calendarDaysBetween(at('2026-10-26'), at('2026-10-25'))).toBe(-1);
  });
});

describe('friendly text', () => {
  it('says when an upcoming window opens', () => {
    expect(describeWindow(midterm, at('2026-10-05'))).toBe('Opens after midterms, around 12 Oct');
    expect(describeWindow(final, at('2026-11-20'))).toBe('Opens after finals, around 14 Dec');
  });

  it('says when an open window closes', () => {
    expect(describeWindow(midterm, at('2026-10-21'))).toBe('Closes in 5 days');
    expect(describeWindow(midterm, at('2026-10-25'))).toBe('Closes tomorrow');
    expect(describeWindow(midterm, at('2026-10-26'))).toBe('Closes today');
  });

  it('says when a window closed', () => {
    expect(describeWindow(midterm, at('2026-11-20'))).toBe('Closed on 26 Oct');
  });

  it('says how long edits are possible', () => {
    expect(editableUntilText(midterm)).toBe('You can change this until 26 Oct');
  });

  it('closesText handles today, tomorrow and later', () => {
    expect(closesText(midterm, at('2026-10-26'))).toBe('Closes today');
    expect(closesText(midterm, at('2026-10-24'))).toBe('Closes in 2 days');
  });
});

describe('isClosingSoon', () => {
  it('is true on the last two days of an open window', () => {
    expect(isClosingSoon(midterm, at('2026-10-25'))).toBe(true);
    expect(isClosingSoon(midterm, at('2026-10-26'))).toBe(true);
  });

  it('is false earlier, before opening and after closing', () => {
    expect(isClosingSoon(midterm, at('2026-10-24'))).toBe(false);
    expect(isClosingSoon(midterm, at('2026-10-05'))).toBe(false);
    expect(isClosingSoon(midterm, at('2026-11-20'))).toBe(false);
  });
});
