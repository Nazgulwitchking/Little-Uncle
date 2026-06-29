const CACHE_NAME = 'little-uncle-cache-v-auto';

// Dateien, die für den Offline-Modus wichtig sind
const ASSETS = [
    './',
    './index.html',
    './core.js',
    // Falls du eine separate style.css hast, trag sie hier ein:
    // './style.css'
];

// Installieren des Service Workers und initiales Cachen
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
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

// DIE AUTOMATIK-STRATEGIE: "Network First, falling back to Cache"
// Der Browser versucht IMMER zuerst die neueste Version aus dem Netz zu laden (auch CSS!).
// Nur wenn kein Internet da ist, greift er auf den Cache zurück.
self.addEventListener('fetch', (event) => {
    // Nur GET-Anfragen cachen (wichtig für GitHub Pages)
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // Wenn die Datei erfolgreich geladen wurde, speichern wir sie direkt im Cache ab
                if (networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // Falls kein Netz da ist (Offline), nimm die Datei aus dem Cache
                return caches.match(event.request);
            })
    );
});
