/*
 * IUT Eval service worker (hand written, no dependencies).
 *
 * What it does
 * - Keeps the app shell and static assets so the app opens offline.
 * - Serves /offline when a page is not available and the device has no connection.
 *
 * What it deliberately does NOT do
 * - It never caches data. All demo data lives in the browser's localStorage, and there is no
 *   API. Window status is computed on the device from the clock, so a cached shell can never
 *   show a stale window. Page HTML is fetched network-first for the same reason.
 *
 * It is only registered in production builds (see components/layout/service-worker.tsx).
 * Bump VERSION to drop old caches after changing this file.
 */
const VERSION = 'v1';
const STATIC_CACHE = `iut-eval-static-${VERSION}`;
const PAGE_CACHE = `iut-eval-pages-${VERSION}`;
const OFFLINE_URL = '/offline';
const PRECACHE_URLS = ['/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png'];
const MAX_PAGES = 30;

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const statics = await caches.open(STATIC_CACHE);
      const pages = await caches.open(PAGE_CACHE);

      await Promise.allSettled(PRECACHE_URLS.map((url) => statics.add(url)));

      // Cache the offline page, plus the CSS and JS it needs, so it is styled when offline.
      const response = await fetch(OFFLINE_URL, { cache: 'reload' });
      if (response.ok) {
        const html = await response.clone().text();
        await pages.put(OFFLINE_URL, response);
        const assets = new Set(html.match(/\/_next\/static\/[^"'\s\\)]+/g) || []);
        await Promise.allSettled([...assets].map((url) => statics.add(url)));
      }
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keep = new Set([STATIC_CACHE, PAGE_CACHE]);
      const names = await caches.keys();
      await Promise.all(
        names.filter((n) => n.startsWith('iut-eval-') && !keep.has(n)).map((n) => caches.delete(n)),
      );
      await self.clients.claim();
    })(),
  );
});

async function trimPages() {
  const cache = await caches.open(PAGE_CACHE);
  const keys = await cache.keys();
  const extra = keys.filter((k) => new URL(k.url).pathname !== OFFLINE_URL);
  for (const key of extra.slice(0, Math.max(0, extra.length - MAX_PAGES))) {
    await cache.delete(key);
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname === '/sw.js') return;

  // Hashed build files never change, so cache first is safe.
  const isStatic =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname === '/manifest.webmanifest';
  if (isStatic) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then(async (response) => {
            if (response.ok) (await caches.open(STATIC_CACHE)).put(request, response.clone());
            return response;
          }),
      ),
    );
    return;
  }

  // Pages: network first, so the shell is always fresh when online.
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          if (response.ok && response.type === 'basic') {
            const cache = await caches.open(PAGE_CACHE);
            await cache.put(request, response.clone());
            void trimPages();
          }
          return response;
        } catch {
          const cached = await caches.match(request);
          if (cached) return cached;
          const offline = await caches.match(OFFLINE_URL);
          return (
            offline ||
            new Response('You are offline.', { status: 503, headers: { 'Content-Type': 'text/plain' } })
          );
        }
      })(),
    );
  }
  // Everything else (such as Next.js data requests) goes straight to the network.
});
