'use client';

import { useEffect } from 'react';

/**
 * Registers the service worker in production builds only. In development it removes any
 * worker left over from an earlier production run, so stale files never confuse debugging.
 */
export function ServiceWorker() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    if (process.env.NODE_ENV !== 'production') {
      void navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => registrations.forEach((r) => void r.unregister()));
      return;
    }

    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
      // The app works fine without it. Offline support just will not be available.
    });
  }, []);

  return null;
}
