/* RUSCHA service worker
   Kesh versiyasi: saytni yangilaganingizda VERSION raqamini oshiring. */
const VERSION = 'ruscha-v8';
const CORE = [
  './',
  './index.html',
  './lib/react.production.min.js',
  './lib/react-dom.production.min.js',
  './assets/dc-runtime.js',
  './assets/ruscha-data.js',
  './assets/ruscha-pismo.js',
  './assets/ruscha-esse.js',
  './manifest.json',
  './icon-192.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSION)
      .then((c) => c.addAll(CORE).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Boshqa domenlar (Firebase, Gemini worker, GoatCounter) — hech qachon keshlanmaydi
  if (url.origin !== self.location.origin) return;

  // HTML sahifa: avval tarmoq, ishlamasa kesh (yangilanish darhol ko'rinsin)
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html').then((r) => r || caches.match('./')))
    );
    return;
  }

  // Statik fayllar: avval kesh, fonda yangilab turadi
  e.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
