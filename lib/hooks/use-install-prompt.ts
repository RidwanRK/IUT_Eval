'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

/** The non-standard event Chromium fires when the app can be installed. */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function subscribeDisplayMode(onChange: () => void) {
  const mql = window.matchMedia('(display-mode: standalone)');
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

function isStandalone(): boolean {
  const iosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return window.matchMedia('(display-mode: standalone)').matches || iosStandalone;
}

function isIos(): boolean {
  const ua = navigator.userAgent;
  const iPadOs = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return /iPad|iPhone|iPod/.test(ua) || iPadOs;
}

export type InstallState =
  | { kind: 'installed' }
  | { kind: 'prompt'; install: () => Promise<void> }
  | { kind: 'ios' }
  | { kind: 'other' };

/**
 * What the Settings screen should show for installing the app. `beforeinstallprompt` only
 * fires in Chromium browsers, on a production build with a service worker.
 */
export function useInstallState(): InstallState {
  const standalone = useSyncExternalStore(subscribeDisplayMode, isStandalone, () => false);
  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [justInstalled, setJustInstalled] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- needs the browser, so it cannot run on the server
    setIos(isIos());
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvent(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setEvent(null);
      setJustInstalled(true);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (!event) return;
    await event.prompt();
    const choice = await event.userChoice;
    if (choice.outcome === 'accepted') setJustInstalled(true);
    setEvent(null);
  }, [event]);

  if (standalone || justInstalled) return { kind: 'installed' };
  if (event) return { kind: 'prompt', install };
  if (ios) return { kind: 'ios' };
  return { kind: 'other' };
}
