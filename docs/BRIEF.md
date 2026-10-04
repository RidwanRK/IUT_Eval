# IUT Eval: product brief

Student portal prototype for "IUT Eval", a student-friendly course feedback platform for the Islamic University of Technology (IUT).

## What it is

Students give feedback on one instructor, for one course, in one semester. If a course has several instructors (for example theory and lab), the student gives separate feedback for each. The unit being rated is a **teaching assignment** (course offering + instructor + role).

## Windows

Two per course offering per semester.

- **Midterm window**: opens after midterms. Forward-looking, so teachers can improve the rest of the course.
- **Final window**: opens after finals. Looks back at the whole course.
- Status: `upcoming`, `open`, `closed`. A student can edit a submitted response until the window closes.

## Student portal scope

Mock sign-in, profile creation, dashboard of current courses, feedback flow, editing until close, history list of past semesters, in-app notifications, settings (profile, reminders), privacy and help.

Students do **not** see results, course discovery or public pages. The only "result" they see is a small classmate snapshot right after submitting.

## Out of scope

Teacher side, public stats pages, admin, real auth, backend, and gamification of any kind (no points, badges, streaks, goals, leaderboards, perks).

## Anonymity (design the data model around this)

- Teachers and classmates never see who wrote what.
- Authorised administrators can link a response to a student, only to handle abuse or misconduct. All privacy copy must say this honestly.
- Response content (`AnonymousResponse`) never contains a student identifier. A separate `SubmissionReceipt` links student, assignment, window and response id. It powers completion tracking, "edit until close" and admin lookups. Keep them in separate modules and separate storage keys, with a comment that production would use separate access-controlled stores.

## Tone of all copy

Casual, friendly, respectful. Plain words, short sentences. It must not feel like an official form, so avoid "evaluate", "respondent", "survey", "instrument", "satisfaction". Never use slang that sounds disrespectful toward teachers. No emojis anywhere in the UI. Use lucide-react icons sparingly.

## Visual design

- Red and white, matching IUT. White surfaces, one red accent (around #C8102E, tuned for WCAG AA with white text), near-black text, very light neutral background, rounded cards, generous spacing, subtle shadows.
- Because red is the brand colour, do not use red to mean "error" or "bad". Show validation and warnings with an icon, text and an amber or neutral treatment. Rating options must not use a red-to-green scale. Selected state is solid red with a check icon.
- Friendly, legible typeface via next/font. Light mode only.
- Mobile-first and fully responsive (check at 360, 375, 768, 1280px). Minimum 48px tap targets, usable one-handed. Subtle motion with Framer Motion, respecting `prefers-reduced-motion`.

## Tech

Next.js (App Router), TypeScript (strict), Tailwind CSS, Radix primitives, Framer Motion, lucide-react, Vitest. English only, but all user-facing copy lives in `/config` so it can be translated later.

## Persistence

Everything is mock. Data persists in localStorage so the demo survives refreshes. Access it only through async functions in `/lib/services`, so the real backend can replace them later without touching components. Services use mock data from `/lib/mock`.

## Staging

1. Foundation, design system, app shell, mock sign-in, profile creation.
2. Dashboard, window logic, history, in-app notifications.
3. Feedback flow (question config, screens, classmate snapshot, saving and editing).
4. Settings, help and privacy, PWA, polish, documentation.
