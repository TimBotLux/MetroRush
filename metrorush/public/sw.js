// Service worker de MetroRush : permet d'installer le jeu et d'y jouer hors connexion.
// - Pages : réseau d'abord (pour recevoir les mises à jour), copie en cache sinon.
// - Fichiers du jeu (JS, CSS, icônes) : cache d'abord, ils ont un nom unique à chaque version.
// - Polices Google : copie en cache, rafraîchie en arrière-plan.
// VERSION change à chaque build (remplacé par vite.config.js) : les téléphones remplacent alors l'ancien cache.
const VERSION = 'metrorush-__BUILD_ID__';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function put(request, response) {
  if (response && (response.ok || response.type === 'opaque')) {
    const copy = response.clone();
    caches.open(VERSION).then((cache) => cache.put(request, copy));
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then((res) => put(request, res))
        .catch(() => caches.match(request).then((hit) => hit || caches.match('./index.html')))
    );
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(caches.match(request).then((hit) => hit || fetch(request).then((res) => put(request, res))));
    return;
  }

  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.match(request).then((hit) => {
        const fresh = fetch(request).then((res) => put(request, res)).catch(() => hit);
        return hit || fresh;
      })
    );
  }
});
