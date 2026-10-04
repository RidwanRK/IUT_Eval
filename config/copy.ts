/**
 * All user-facing copy lives here so it can be translated later.
 * Tone: casual, friendly, respectful. Plain words, short sentences. No emojis.
 * Avoid "evaluate", "respondent", "survey", "instrument", "satisfaction".
 */
import { institution } from './institution';

export const copy = {
  app: {
    name: institution.appName,
    tagline:
      'Share how your courses are going. It takes a few minutes, and your name stays private.',
    description: 'Quick, friendly course feedback for IUT students.',
  },

  nav: {
    home: 'Home',
    history: 'History',
    settings: 'Settings',
    primaryLabel: 'Main',
    skipToContent: 'Skip to content',
    notifications: 'Notifications',
  },

  landing: {
    studentButton: 'Sign in as student',
    teacherButton: 'Sign in as teacher',
    teacherDialog: {
      title: 'Teacher access is coming soon',
      body: 'For now, IUT Eval is open to students only. Teacher access will arrive in a later version.',
      close: 'Got it',
    },
    footer: `${institution.universityName}`,
    prototypeNote: 'Prototype. Nothing you enter here leaves your device.',
  },

  signIn: {
    title: 'Welcome back',
    subtitle: 'Sign in with your student ID.',
    studentIdLabel: 'Student ID',
    studentIdPlaceholder: 'For example 200041123',
    passwordLabel: 'Password',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    continue: 'Continue',
    prototypeNote: 'This is a prototype, so any input works. There is no real sign-in yet.',
    back: 'Back',
  },

  onboarding: {
    title: 'Let us set you up',
    stepLabel: (n: number, total: number) => `Step ${n} of ${total}`,
    steps: {
      about: {
        title: 'A little about you',
        subtitle: 'Just the basics. Takes under a minute.',
      },
      studies: {
        title: 'Your studies',
        subtitle: 'We use this to find your courses.',
      },
      avatar: {
        title: 'Pick an avatar',
        subtitle: 'Only you see this.',
      },
    },
    fields: {
      displayName: {
        label: 'What should we call you?',
        placeholder: 'Your first name is fine',
        error: 'Add a name so we can say hi.',
      },
      studentId: {
        label: 'Student ID',
        placeholder: 'Digits only',
        hint: '6 to 12 digits.',
        error: 'Student ID should be 6 to 12 digits.',
      },
      department: {
        label: 'Department',
        placeholder: 'Choose your department',
        error: 'Pick your department.',
      },
      level: {
        label: 'Year and semester',
        placeholder: 'Choose your level',
        error: 'Pick your year and semester.',
      },
      email: {
        label: 'Email (optional)',
        placeholder: 'you@example.com',
        hint: 'Only used to send reminders, if you want them.',
        error: 'That email does not look right.',
      },
    },
    avatarInitials: 'Initials',
    avatarPresets: 'Or pick a picture',
    avatarColor: 'Colour',
    avatarLabels: {
      book: 'Book',
      compass: 'Compass',
      leaf: 'Leaf',
      coffee: 'Coffee cup',
      lightbulb: 'Light bulb',
      telescope: 'Telescope',
      bird: 'Bird',
      mountain: 'Mountain',
    },
    privacyLine: 'Your profile is private. It is never shown with your feedback.',
    next: 'Next',
    back: 'Back',
    finish: 'Finish and go to home',
  },

  toasts: {
    profileSaved: 'Profile saved.',
    signedOut: 'You are signed out.',
    demoReset: 'Demo data cleared. Starting fresh.',
    scenarioChanged: (label: string) => `Demo date set: ${label}.`,
    genericError: 'Something went wrong. Please try again.',
  },

  prototypeTools: {
    open: 'Prototype tools',
    title: 'Prototype tools',
    description: 'These tools are only for the demo. They are not part of the real app.',
    reset: 'Reset all demo data',
    resetConfirmTitle: 'Reset everything?',
    resetConfirmBody:
      'This clears your profile, drafts and sent feedback on this device, and puts the demo back to the start.',
    resetConfirm: 'Yes, reset',
    cancel: 'Cancel',
    signOut: 'Sign out',
    scenarioLabel: 'Demo scenario',
    scenarioHint: 'Changes the date the app thinks it is.',
    close: 'Close',
  },

  windows: {
    midterm: 'Midterm',
    final: 'Final',
    status: { upcoming: 'Upcoming', open: 'Open', closed: 'Closed' },
    opensAfter: {
      midterm: (date: string) => `Opens after midterms, around ${date}`,
      final: (date: string) => `Opens after finals, around ${date}`,
    },
    closesToday: 'Closes today',
    closesTomorrow: 'Closes tomorrow',
    closesInDays: (days: number) => `Closes in ${days} days`,
    closedOn: (date: string) => `Closed on ${date}`,
    canChangeUntil: (date: string) => `You can change this until ${date}`,
    roles: { theory: 'Theory', lab: 'Lab' },
    aboutMinutes: (minutes: number) => `About ${minutes} min`,
  },

  dashboard: {
    greeting: (name: string) => `Hi, ${name}`,
    title: 'Home',
    summary: {
      open: (courses: number, minutes: number) =>
        `${courses} ${courses === 1 ? 'course is' : 'courses are'} open for your feedback. Each takes about ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}.`,
      nothingOpen: 'Nothing is open for your feedback right now.',
      nextOpening: (date: string) => `The next window opens around ${date}.`,
      caughtUpTitle: "You're all caught up",
      caughtUpBody:
        'Thanks for sharing. You can still change your answers until each window closes.',
      allClosed: 'This semester’s feedback windows have closed. Thanks for taking part.',
    },
    actions: {
      start: 'Start',
      continue: 'Continue',
      edit: 'Edit response',
      view: 'View my answers',
    },
    draftProgress: (answered: number, total: number) => `${answered} of ${total} answered`,
    chips: {
      draft: 'Draft saved',
      submitted: 'Submitted',
    },
    courseCredits: (credits: number) => `${credits} credits`,
    instructorLabel: 'Teacher',
    emptyTitle: 'No courses yet',
    emptyBody:
      'We could not find any courses for this semester. They will show up here once they are added.',
    errorTitle: 'We could not load your courses',
  },

  history: {
    title: 'History',
    subtitle: 'Feedback you gave in past semesters.',
    emptyTitle: 'Nothing here yet',
    emptyBody: 'Once a semester is over, your courses will show up here.',
    submitted: 'Submitted',
    notSubmitted: 'Not submitted',
    viewAnswers: 'View my answers',
    courseCount: (n: number) => `${n} ${n === 1 ? 'course' : 'courses'}`,
    errorTitle: 'We could not load your history',
  },

  notifications: {
    title: 'Notifications',
    description: 'Reminders about feedback windows.',
    empty: 'Nothing new right now.',
    emptyBody: 'When a feedback window opens, you will see it here.',
    bell: (unread: number) => (unread === 0 ? 'Notifications' : `Notifications, ${unread} unread`),
    windowOpen: (window: string, course: string) => `${window} feedback for ${course} is open`,
    closingSoon: (when: string, course: string, window: string) =>
      `${when}: ${course} ${window.toLowerCase()} feedback`,
    closesTomorrowShort: 'Closes tomorrow',
    closesTodayShort: 'Closes today',
    teachersWaiting: (n: number) => `${n} teachers to give feedback on`,
    errorBody: 'We could not load your notifications.',
  },

  common: {
    loading: 'Loading',
    retry: 'Try again',
    close: 'Close',
    back: 'Back',
    cancel: 'Cancel',
    save: 'Save',
    done: 'Done',
    gotIt: 'Got it',
    errorTitle: 'We could not load this',
    errorBody: 'Check your connection and try again.',
  },
} as const;
