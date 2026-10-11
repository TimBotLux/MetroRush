// Service worker de MetroRush : permet d'installer le jeu et d'y jouer hors connexion.
// - Pages : réseau d'abord (pour recevoir les mises à jour), copie en cache sinon.
// - Fichiers du jeu (JS, CSS, icônes) : cache d'abord, ils ont un nom unique à chaque version.
// - Polices Google : copie en cache, rafraîchie en arrière-plan.
// VERSION change à chaque build et PRECACHE liste tous les fichiers du build (remplacés par vite.config.js) :
// tout est téléchargé dès l'installation, pour jouer hors connexion même sans avoir rouvert le jeu.
const VERSION = 'metrorush-__BUILD_ID__';
const PRECACHE = ['./', ...__PRECACHE__];

// Polices Google : on lit leur adresse dans index.html, puis on met en cache la feuille de style
// et chaque fichier de police qu'elle référence. En cas d'échec, le jeu garde les polices de secours.
async function precacheFonts(cache) {
  const html = await fetch('./index.html').then((r) => r.text());
  const href = (html.match(/href="(https:\/\/fonts\.googleapis\.com\/[^"]+)"/) || [])[1];
  if (!href) return;
  const cssUrl = href.replace(/&amp;/g, '&');
  const css = await fetch(cssUrl, { mode: 'cors' });
  await cache.put(cssUrl, css.clone());
  const fonts = [...(await css.text()).matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)].map((m) => m[1]);
  // Une police variable sert plusieurs graisses : sans dédoublonnage, addAll refuserait toute la liste
  await cache.addAll([...new Set(fonts)]);
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION)
      .then((cache) => cache.addAll(PRECACHE).then(() => precacheFonts(cache).catch(() => {})))
      .then(() => self.skipWaiting())
  );
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
    // ignoreVary : la copie mise en cache à l'installation sert aussi à la feuille de style de la page
    event.respondWith(
      caches.match(request, { ignoreVary: true }).then((hit) => {
        const fresh = fetch(request).then((res) => put(request, res)).catch(() => hit);
        return hit || fresh;
      })
    );
  }
});
