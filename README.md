# IUT Eval

A student-friendly course feedback app for the Islamic University of Technology (IUT). This repo is the **student portal prototype**: sign in (mock), set up a profile, give feedback on each teacher in each course, edit until a window closes, and see past semesters. Everything is mock data stored in the browser, so the demo survives refreshes with no backend.

Start with [docs/BRIEF.md](docs/BRIEF.md) for the product brief and [CLAUDE.md](CLAUDE.md) for the working rules.

> **Before launch the university must review all privacy and help copy.** That means `config/copy.ts` (`help`, `flow.anonymity`, `onboarding.privacyLine`), the contact details in `config/institution.ts`, and the question wording in `config/questions.ts`. All of it is draft text. The contact details, department list and semester names are placeholders.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

| Command             | What it does                                           |
| ------------------- | ------------------------------------------------------ |
| `npm run dev`       | Dev server. The service worker is off in dev.          |
| `npm run typecheck` | `tsc --noEmit` with strict settings.                   |
| `npm run lint`      | ESLint (Next.js core web vitals and TypeScript rules). |
| `npm test`          | Vitest.                                                |
| `npm run build`     | Production build.                                      |
| `npm start`         | Serve the production build.                            |
| `npm run icons`     | Regenerate the placeholder app icons (needs `sharp`).  |

**The service worker only runs in production builds.** To test installing and offline use:

```bash
npm run build && npm start     # then open http://localhost:3000
```

Turn the prototype tools off with `NEXT_PUBLIC_PROTOTYPE_TOOLS=false` (see `.env.example`). It is read at build time.

## Route map

| Route                                       | What it is                                                                                                                  |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `/`                                         | Landing. Student sign-in button, and a "coming soon" dialog for teachers.                                                   |
| `/student/sign-in`                          | Mock sign-in. Any input works.                                                                                              |
| `/student/welcome`                          | Profile creation, three short steps.                                                                                        |
| `/student`                                  | Dashboard: current courses, one row per teacher, two windows each.                                                          |
| `/student/history`                          | Past semesters, collapsible, with Submitted or Not submitted.                                                               |
| `/student/settings`                         | Profile, reminders, install help, sign out.                                                                                 |
| `/student/help`                             | Help and privacy (accordion). `#who-sees-what` opens that section.                                                          |
| `/student/feedback/[assignmentId]/[window]` | The feedback flow. `window` is `midterm` or `final`. Add `?view=answers` to open the read-only answers (History does this). |
| `/offline`                                  | Offline fallback page, served by the service worker.                                                                        |
| `/prototype/components`                     | Hidden component gallery. 404 when prototype tools are off.                                                                 |
| `/manifest.webmanifest`                     | Web app manifest.                                                                                                           |

## Folder structure

```
app/                  Routes. (app) group has the tab bar/sidebar shell, (flow) group is full screen.
components/
  ui/                 Design system: Button, Card, Chip, Badge, Switch, Dialog, BottomSheet, Toast,
                      ProgressBar, Avatar, Skeleton, EmptyState, ErrorState, Input, Select, TextArea
  layout/             App shell, providers, route guard, offline notice, service worker registration
  features/           One folder per feature: auth, onboarding, dashboard, history, notifications,
                      feedback, settings, help, landing
  prototype/          PROTOTYPE ONLY. Floating tools and the component gallery.
config/
  copy.ts             All UI copy (translatable later)
  questions.ts        Question sets, option sets, time estimates, snapshot wording
  institution.ts      App and university names, departments, semester labels, contacts. Placeholders.
lib/
  services/           The only way components get or change data. Async functions.
  mock/               Mock catalog (courses, teachers, offerings, windows)
  storage/            localStorage adapter with versioned keys and safe fallbacks
  types/              Domain types
  hooks/              useService, useMediaQuery, useOnlineStatus, useInstallState
  prototype/          PROTOTYPE ONLY. Demo scenarios, flags, other-department course sets.
public/sw.js          Service worker
tests/                Vitest tests
docs/BRIEF.md         Product brief
```

## Demo scenarios

Open **Prototype tools** (the round button, bottom right) and pick a **Demo scenario**. This changes the date the app thinks it is. Window status is always computed from each window's open and close times and that date. Nothing is hardcoded.

| Scenario            | Date               | What you see                                                                              |
| ------------------- | ------------------ | ----------------------------------------------------------------------------------------- |
| Midterm window open | around 25 Oct 2026 | Midterm feedback open (one course closes tomorrow), finals upcoming. This is the default. |
| Between windows     | around 20 Nov 2026 | Midterm closed, final upcoming. Shows "View my answers" or a quiet "Closed".              |
| Final window open   | around 27 Dec 2026 | Final feedback open.                                                                      |
| Semester over       | around 15 Jan 2027 | Both windows closed. Shows the calm "closed" summary.                                     |
| Fresh start         | same as midterm    | Clears this semester's drafts and sent feedback. Past semesters stay.                     |

Other tips:

- **Reset all demo data** in the same sheet clears everything, including the profile.
- CSE and EEE have their own course sets. Other departments reuse the CSE set with their own prefix (for example `ME 4501`). Prototype only.
- Database Systems has separate theory and lab teachers. Computer Networks has two theory teachers.
- Lab groups are small on purpose, so their classmate snapshot shows "appears once more classmates have responded".
- All teacher names are obviously fictional.

## How the services layer gets replaced by a real API

Components never touch storage or mock data. They call async functions in `lib/services`, so each module can be rewritten to call a backend without changing any component.

| Service module                                         | Becomes                                                                                    |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `session.ts`                                           | Real sign-in (university SSO), session or token handling                                   |
| `profile.ts`                                           | `GET/PUT /me`                                                                              |
| `enrollments.ts`, `teaching.ts`, `lib/mock/catalog.ts` | Registrar sync: courses, offerings, teachers, enrolments, windows                          |
| `clock.ts` (`getNow`)                                  | Server time (or just `new Date()`)                                                         |
| `dashboard.ts`, `history.ts`                           | Read endpoints that return the same view models                                            |
| `drafts.ts`                                            | Stays on the device, or `PUT /drafts` if drafts should sync                                |
| `feedback.ts` (`submitFeedback`)                       | `POST /feedback`. The server writes the response and the receipt separately.               |
| `responses.ts`                                         | Response store (no student identity)                                                       |
| `receipts.ts`                                          | Receipt store (student, assignment, window, response id)                                   |
| `snapshots.ts`                                         | `GET /snapshot` with aggregates only, and the minimum-responses rule applied on the server |
| `notifications.ts`, `reminders.ts`                     | Reminder preferences endpoint. Notifications can stay derived from window state.           |
| `history-seed.ts`                                      | Delete. Real history comes from the server.                                                |

Keep the function signatures, and keep pure logic (`window-logic.ts`, `answers.ts`, `notification-rules.ts`, `dashboard-summary.ts`, `snapshot-logic.ts`) as it is. `lib/storage` and `lib/mock` then become unused.

To remove the prototype: delete `components/prototype`, `lib/prototype`, `app/prototype`, and the one import of `lib/prototype/department-sets` in `lib/mock/catalog.ts`, then remove `<PrototypeTools />` from `app/layout.tsx`.

## Anonymity and privacy rules the UI assumes

These are product promises the copy makes. The real system has to keep them.

1. **Teachers and classmates never see who wrote what.**
2. **Authorised administrators can link a response to a student, only to handle abuse or misconduct.** All privacy copy says this. Do not remove it.
3. **`AnonymousResponse` never contains a student identifier**, and carries no precise timestamp (only a version number). See `lib/services/responses.ts`.
4. **`SubmissionReceipt` is the only link** between a student, an assignment, a window and a response id. See `lib/services/receipts.ts`. It holds no answers. It powers completion tracking, "edit until the window closes" and administrator lookups.
5. The two are separate modules and use **separate storage keys** (`responses.anonymous` and `receipts.submission`). In production they should be **separate, access-controlled stores**, so reading answers never reveals identities.
6. Teachers see summaries and **reviewed** comments (a moderation step, not built yet).
7. The classmate snapshot only appears when the offering has at least `REVEAL_MIN_RESPONSES` responses (10, in `config/questions.ts`), shows only combined bars, and never individual answers. The server must enforce the minimum too.
8. The student profile is private and never shown with feedback.
9. Missing a window has no consequence, and nothing in the UI shames or pressures. No points, badges, streaks or leaderboards.

A test (`tests/anonymity.test.ts`) checks that stored responses contain no student identifier.

## PWA

- Manifest at `/manifest.webmanifest`, standalone, red theme colour, white background, standard and maskable icons, Apple touch icon.
- The icons are **placeholders** (red square, white "IE"). Replace them with real artwork and run `npm run icons` if you want to regenerate the placeholders.
- `public/sw.js` is a small hand-written worker. It keeps the app shell and hashed static files, fetches pages network-first, and serves `/offline` when a page is not available. It never caches data. There is no API, and window status is computed on the device from the clock, so a cached shell cannot show a stale window.
- Installing: Chromium browsers use `beforeinstallprompt`. iPhone and iPad show "Add to Home Screen" steps. Settings hides the section once installed.
- Offline: drafts live in the browser, so they are safe. Sending needs a connection (the flow blocks it with a friendly message).

## What is intentionally not implemented

- Real authentication (sign-in accepts anything)
- Registrar enrolment sync
- Backend and database (everything is localStorage)
- Admin tools and traceability controls (the receipt link exists, nothing reads it)
- Comment moderation or review
- Real email and push notifications (email reminders are only a saved preference; in-app reminders are real)
- Teacher side
- Public stats pages
- Bangla translation (copy is in `/config`, ready for it)
- Dark mode (light only, by design)

## Tests

`npm test` covers window status and friendly dates, the notification generator and reminder preferences, dashboard actions and the summary line, the question config (unique ids, valid options, reveal questions, time estimates), answer cleaning, the snapshot rules, copy tone (banned words, emojis, honest anonymity wording) and that stored responses hold no student identifier.
