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
      waiting: 'Feedback waiting',
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

  flow: {
    anonymity:
      'Your teacher never sees your name. Your identity is kept separate from your answers. Only authorised administrators can look it up, and only to handle abuse or misconduct.',
    helpLink: 'Help and privacy',
    exit: 'Save and leave',
    exitHint: 'Your answers are saved on this device.',

    guard: {
      upcomingTitle: 'This one is not open yet',
      upcomingBody: (windowLabel: string, date: string) =>
        `${windowLabel} feedback opens around ${date}. Come back then.`,
      closedTitle: 'This window has closed',
      closedBody: (date: string) => `It closed on ${date}. Nothing you need to do.`,
      closedSubmittedBody: (date: string) =>
        `It closed on ${date}. Thanks for sharing your feedback.`,
      viewAnswers: 'View my answers',
      backHome: 'Back to home',
      notFoundTitle: 'We could not find that',
      notFoundBody: 'This course is not in your list. Head back home and pick one from there.',
      errorTitle: 'We could not open this',
    },

    intro: {
      eyebrow: (windowLabel: string, semester: string) => `${windowLabel} feedback, ${semester}`,
      blurb: {
        midterm: 'Tell your teacher how the course is going, so the second half can get better.',
        final: 'Look back on the whole course. This helps your teacher and future batches.',
      },
      about: (minutes: number) => `About ${minutes} min`,
      skipNote: 'You can skip anything. Your answers save as you go.',
      start: 'Start',
      continueFrom: (n: number) => `Continue from question ${n}`,
      startOver: 'Start over',
      draftFound: 'You started this one earlier.',
    },

    question: {
      back: 'Back',
      skip: 'Skip',
      next: 'Next',
      counter: (n: number, total: number) => `Question ${n} of ${total}`,
      minutesLeft: (minutes: number) => `About ${minutes} min left`,
      progress: 'Progress through the questions',
      chipsLimit: (max: number) => `Pick up to ${max}`,
      chipsMaxReached: (max: number) => `That is ${max}. Unselect one to pick a different one.`,
      sliderNotSet: 'Not set yet',
      sliderValue: (value: string, unit: string) => `${value} ${unit}`,
      sliderHint: 'Drag the handle, or tap a number below.',
      textPlaceholder: 'Write here, or skip this one.',
      textLabel: 'Your comment',
      startersLabel: 'Need a way in?',
      keysHint: 'Tip: press a number key to choose, then Enter to continue.',
      groupLabel: 'Choices',
    },

    review: {
      title: 'Ready to send?',
      headerTitle: 'Review',
      summary: (answered: number, skipped: number) =>
        `${answered} answered, ${skipped} skipped. You can change any of them first.`,
      send: 'Send',
      sendUpdate: 'Send update',
      sending: 'Sending',
      skipped: 'Skipped',
      noAnswers:
        'Answer at least one question so there is something to send. Tap any question below to jump to it.',
      jumpHint: 'Tap a question to jump to it.',
      editingNote: 'You already sent this one. Sending again replaces your earlier answers.',
      sectionCount: (answered: number, total: number) => `${answered} of ${total} answered`,
      sendError: 'We could not send that. Please try again.',
      closedError: 'This window has just closed, so it can no longer take answers.',
    },

    success: {
      title: 'Thank you',
      updatedTitle: 'Updated',
      body: 'Your feedback is on its way to your teacher, without your name.',
      updatedBody: 'Your earlier answers have been replaced.',
      editUntil: (date: string) => `You can edit your answers until ${date}.`,
      backHome: 'Back to home',
      another: 'Give feedback for another course',
      nothingElse: 'That is everything that is open for you right now.',
    },

    snapshot: {
      title: 'How your class answered',
      subtitle: 'A quick look, all together. Never anyone’s individual answers.',
      most: (pct: number, phrase: string, label: string) =>
        `Most classmates (${pct}%) ${phrase} ${label}.`,
      biggest: (pct: number, phrase: string, label: string) =>
        `The biggest group of classmates (${pct}%) ${phrase} ${label}.`,
      yours: (pct: number, phrase: string, label: string) =>
        `You’re one of the ${pct}% who ${phrase} ${label}. That’s valid too.`,
      yourAnswerTag: 'You',
      notEnough: 'Class snapshot appears once more classmates have responded.',
      chartLabel: (name: string, parts: string) => `${name}. ${parts}`,
      chartPart: (label: string, pct: number) => `${label}: ${pct} percent`,
    },

    answers: {
      title: 'Your answers',
      closedNote: (date: string) =>
        `This window closed on ${date}, so these answers are read-only.`,
      skipped: 'Skipped',
      back: 'Back',
      empty: 'There are no answers to show.',
    },
  },

  settings: {
    title: 'Settings',
    subtitle: 'Your profile and reminders.',
    profile: {
      title: 'Your profile',
      body: 'Private to you. It is never shown with your feedback.',
      departmentChangeHint: 'Changing your department changes the courses you see.',
      save: 'Save changes',
      saving: 'Saving',
      unchanged: 'No changes to save.',
    },
    reminders: {
      title: 'Reminders',
      body: 'Choose how we nudge you. You can turn all of these off.',
      inApp: 'In the app',
      email: 'By email',
      windowOpens: 'When a feedback window opens',
      closingSoon: 'A day before it closes',
      emailLabel: 'Email for reminders',
      emailSave: 'Save email',
      emailSaved: 'Email saved.',
      emailMissing: 'Add an email address to turn these on.',
      emailMockNote: 'Email sending is a mock for now. Nothing is actually sent yet.',
    },
    install: {
      title: 'Install the app',
      body: 'Add IUT Eval to your home screen so it opens like any other app.',
      button: 'Install app',
      installing: 'Installing',
      iosTitle: 'On iPhone or iPad',
      iosSteps: [
        'Tap the Share button in Safari.',
        'Scroll down and tap Add to Home Screen.',
        'Tap Add.',
      ],
      otherHint: 'Look for Install or Add to Home Screen in your browser menu.',
      installed: 'Installed. Thanks!',
    },
    links: {
      title: 'More',
      privacy: 'Privacy',
      help: 'Help',
    },
    signOut: 'Sign out',
    signOutHint: 'Your profile stays on this device.',
    errorTitle: 'We could not load your settings',
  },

  help: {
    title: 'Help and privacy',
    subtitle: 'Straight answers, in plain words.',
    /** The university must review this copy before launch. See README. */
    items: {
      why: {
        title: 'Why do you ask for my feedback?',
        body: [
          'Your feedback helps teachers get better. The midterm window is for the rest of the course, so your teacher can improve things while it is still running.',
          'The final window looks back at the whole course, so future batches have a better time.',
        ],
      },
      who: {
        title: 'Who sees what?',
        body: [
          'Teachers see summaries and reviewed comments. They never see names.',
          'Your classmates never see your answers. After you send, you see a small snapshot of how the class answered, all together. It only shows up once enough classmates have responded.',
          'Your name is kept separate from your answers. Authorised administrators can link a response to a student, but only to handle abuse or misconduct. That is the only reason, and nobody else can.',
        ],
      },
      change: {
        title: 'Can I change my answers?',
        body: [
          'Yes, until the window closes. Open the course on Home and tap Edit response. Sending again replaces what you sent before.',
          'Once a window closes, you can still read what you sent, but you cannot change it.',
        ],
      },
      miss: {
        title: 'What if I miss a window?',
        body: [
          'Nothing happens to you. The window just closes, and that is okay. You can take part in the next one.',
        ],
      },
      comment: {
        title: 'Writing a helpful comment',
        body: [
          'Be specific, be kind. Talk about the teaching and the course, not the person. Say what helped and what would help more.',
        ],
        examplesTitle: 'Two examples',
        examples: [
          'The worked examples in week 5 really helped me understand recursion. More of those before quizzes would help a lot.',
          'The slides were hard to read from the back row. Bigger text, or sharing them a day earlier, would help me follow along.',
        ],
      },
      serious: {
        title: 'Something serious?',
        body: [
          'Feedback here is for improving teaching. If something serious has happened, like harassment or misconduct, please do not use a feedback form. Contact the office below instead.',
        ],
        contactTitle: 'Who to contact',
      },
    },
    placeholderNote: 'These details are placeholders until the university confirms them.',
    contactEmail: 'Email',
    contactPhone: 'Phone',
    contactHours: 'Hours',
  },

  offline: {
    title: 'You are offline',
    body: 'No worries. Anything you already answered is saved on this device and will be here when you are back.',
    sendNote: 'Sending feedback needs a connection, so give it a try once you are back online.',
    retry: 'Try again',
    banner: 'You are offline. Drafts are saved on this device. Sending needs a connection.',
    sendError:
      'You are offline, so we could not send that. Your answers are saved. Try again once you are back online.',
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
