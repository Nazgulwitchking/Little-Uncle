const CACHE_NAME = 'little-uncle-cache-v3-auto';

// ALLE wichtigen Dateien mit den EXAKTEN Pfaden für den Offline-Modus
const ASSETS = [
    './',
    './index.html',
    './CORE/core.js',
    './CORE/core.css',
    './Extensions/Stundenplan/stundenplan.js',
    './Extensions/Stundenplan/stundenplan.css',
    './Extensions/Stundenplan/stundenplan.html'
];

// Installieren des Service Workers und initiales Cachen
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // catch() fängt Fehler ab, falls eine Datei mal temporär fehlt, damit die App nicht crasht
            return cache.addAll(ASSETS).catch(err => console.warn("Cache-Fehler beim Installieren:", err));
        }).then(() => self.skipWaiting())
    );
});

// Alten Cache aufräumen
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// WICHTIG FÜR DEN UPDATE-BUTTON: Auf Befehle von der core.js hören
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// "Network First, falling back to Cache"
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                if (networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                return caches.match(event.request);
            })
    );
});
