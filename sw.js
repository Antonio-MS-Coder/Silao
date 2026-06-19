/**
 * Service Worker for Plaza Real Silao (redesign)
 * Strategy:
 *  - Navigations + /data/*.json  → network-first (fresh content, offline fallback)
 *  - Other same-origin GET       → stale-while-revalidate (fast, self-updating)
 *  - Cross-origin (GA, maps)     → passthrough (never cached)
 */

const CACHE = 'plaza-real-silao-v2';
const SHELL = [
    '/',
    '/css/main.css',
    '/js/components.js',
    '/js/script.js',
    '/js/home.js',
    '/images/icons/sprite.svg',
    '/images/logo-silao.webp',
    '/fonts/inter-400.woff2',
    '/fonts/inter-600.woff2',
    '/fonts/fraunces-600.woff2',
    '/data/stores.json',
    '/404.html'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE)
            .then(cache => cache.addAll(SHELL).catch(() => {})) // tolerate any single miss
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const req = event.request;
    if (req.method !== 'GET') return;

    const url = new URL(req.url);
    if (url.origin !== location.origin) return; // GA, Google Maps, etc. → passthrough

    const isData = url.pathname.startsWith('/data/');
    const isNav = req.mode === 'navigate';

    // Network-first for pages and data so content stays fresh.
    if (isNav || isData) {
        event.respondWith(
            fetch(req)
                .then(res => {
                    const copy = res.clone();
                    caches.open(CACHE).then(c => c.put(req, copy));
                    return res;
                })
                .catch(() => caches.match(req).then(r => r || (isNav ? caches.match('/404.html') : Response.error())))
        );
        return;
    }

    // Stale-while-revalidate for static assets.
    event.respondWith(
        caches.match(req).then(cached => {
            const network = fetch(req).then(res => {
                if (res && res.status === 200 && res.type === 'basic') {
                    const copy = res.clone();
                    caches.open(CACHE).then(c => c.put(req, copy));
                }
                return res;
            }).catch(() => cached);
            return cached || network;
        })
    );
});
