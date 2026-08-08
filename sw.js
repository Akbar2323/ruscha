/* RUSCHA service worker.
 *
 * Strategy is deliberately network-first for the page itself. The whole app is
 * one HTML file that gets replaced on every deploy, so a cache-first worker
 * would pin visitors to an old build until they cleared their browser — a bad
 * trade for an app that ships changes often. The cached copy is only a fallback
 * for when the network is unavailable.
 *
 * Bump CACHE_VERSION whenever you want every visitor to drop their old cache.
 */

const CACHE_VERSION = "ruscha-v1";
const PRECACHE = [
  "./",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      // A single missing file must not abort the whole install, so each entry
      // is added on its own and failures are ignored.
      .then(cache => Promise.all(
        PRECACHE.map(url => cache.add(url).catch(() => null))
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;

  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Analytics and Firebase must always go to the network. Serving either from
  // cache would mean stale leaderboard data and lost visit counts.
  if (url.origin !== self.location.origin) return;
  if (url.pathname.includes("count.js")) return;

  // Page loads: try the network, fall back to cache when offline.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then(c => c.put("./", copy));
          return res;
        })
        .catch(() => caches.match("./").then(hit => hit || caches.match(req)))
    );
    return;
  }

  // Static assets: serve from cache, refresh in the background.
  event.respondWith(
    caches.match(req).then(hit => {
      const network = fetch(req)
        .then(res => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then(c => c.put(req, copy));
          }
          return res;
        })
        .catch(() => hit);
      return hit || network;
    })
  );
});
