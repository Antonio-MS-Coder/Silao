/**
 * Service Worker for Plaza Real Silao
 * Provides offline functionality and performance optimizations
 */

const CACHE_NAME = 'plaza-real-silao-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/tiendas/',
    '/tiendas/index.html',
    '/tiendas/detalle.html',
    '/espacios/',
    '/espacios/index.html',
    '/eventos/',
    '/eventos/index.html',
    '/faq/',
    '/faq/index.html',
    '/404.html',
    '/css/styles.css',
    '/css/espacios.css',
    '/css/eventos.css',
    '/css/faq.css',
    '/js/script.js',
    '/js/home.js',
    '/js/stores.js',
    '/js/store-detail.js',
    '/js/espacios.js',
    '/js/eventos.js',
    '/js/faq.js',
    '/data/stores.json',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// Install event - cache assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching files');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Clearing old cache');
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache when possible
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Skip cross-origin requests except for fonts and CDNs
    const url = new URL(event.request.url);
    const isAllowedCrossOrigin = 
        url.hostname.includes('googleapis.com') ||
        url.hostname.includes('gstatic.com') ||
        url.hostname.includes('cdnjs.cloudflare.com');
    
    if (url.origin !== location.origin && !isAllowedCrossOrigin) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                
                // Clone the request
                const fetchRequest = event.request.clone();
                
                return fetch(fetchRequest).then(response => {
                    // Check if valid response
                    if (!response || response.status !== 200 || response.type === 'opaque') {
                        return response;
                    }
                    
                    // Clone the response
                    const responseToCache = response.clone();
                    
                    // Add to cache
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                }).catch(() => {
                    // Offline fallback for navigation requests
                    if (event.request.mode === 'navigate') {
                        return caches.match('/404.html');
                    }
                    
                    // Return offline placeholder for images
                    if (event.request.destination === 'image') {
                        return new Response(
                            '<svg role="img" aria-labelledby="offline-title" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><title id="offline-title">Imagen no disponible sin conexión</title><g fill="none" fill-rule="evenodd"><path fill="#D8D8D8" d="M0 0h400v300H0z"/><text fill="#9B9B9B" font-family="Inter, sans-serif" font-size="20" x="200" y="150" text-anchor="middle">Imagen offline</text></g></svg>',
                            {
                                headers: { 'Content-Type': 'image/svg+xml' }
                            }
                        );
                    }
                });
            })
    );
});

// Background sync for form submissions
self.addEventListener('sync', event => {
    if (event.tag === 'sync-forms') {
        event.waitUntil(syncForms());
    }
});

async function syncForms() {
    try {
        const cache = await caches.open(CACHE_NAME);
        const requests = await cache.keys();
        
        const formRequests = requests.filter(request => 
            request.url.includes('formsubmit.co')
        );
        
        for (const request of formRequests) {
            try {
                const response = await fetch(request);
                if (response.ok) {
                    await cache.delete(request);
                }
            } catch (error) {
                console.error('Error syncing form:', error);
            }
        }
    } catch (error) {
        console.error('Sync failed:', error);
    }
}

// Push notification support (for future implementation)
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/images/icon-192.png',
            badge: '/images/badge-72.png',
            vibrate: [100, 50, 100],
            data: {
                url: data.url || '/'
            }
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});