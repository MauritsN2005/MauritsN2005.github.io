const CACHE_NAME = 'c4-cache-v1';

const ASSETS = [
    '/',
    'index.html',
    'style.css',
    'app.js',
    'ai.js',
    'manifest.json',

    'icons/icon.svg',

    'sound_effects/drop.mp3',
    'sound_effects/win.mp3',
    'sound_effects/lose.mp3',
    'sound_effects/click.mp3'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(k => k !== CACHE_NAME)
                    .map(k => caches.delete(k))
            )
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});