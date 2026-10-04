# IUT Eval: working rules

**Read `docs/BRIEF.md` first.** It is the source of truth for scope and anonymity.

## Hard rules

- Student portal prototype only. No teacher side, admin, backend, real auth or gamification.
- Anonymity: `AnonymousResponse` never holds a student id. `SubmissionReceipt` is the only link. They live in separate service modules and separate storage keys.
- All user-facing copy lives in `/config` (`copy.ts`, `questions.ts`, `institution.ts`). Components import copy, they do not hardcode it.
- Components never touch localStorage. Go through async functions in `/lib/services`. Storage goes through `/lib/storage`.
- Window status is always computed with `getWindowStatus(window, getNow())`. Never hardcode it.
- Prototype-only code lives in `/components/prototype` and `/lib/prototype` so it can be deleted in one go. `NEXT_PUBLIC_PROTOTYPE_TOOLS=false` hides it.

## Tone and design

- Casual, friendly, respectful, short plain sentences. Avoid "evaluate", "respondent", "survey", "instrument", "satisfaction". No emojis. No slang about teachers.
- Red is the brand colour. Never use red for error or bad. Use amber or neutral with an icon and text. No red-to-green scales. Selected state is solid red with a check icon.
- Light mode only. Mobile-first, 48px minimum tap targets, respect `prefers-reduced-motion`.

## Commands

`npm run dev`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`. Service worker only runs in production (`npm run build && npm start`).
