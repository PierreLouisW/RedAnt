// v3 : les icones etaient referencees sous icons/, dossier inexistant - le cache
// precedent contient donc un shell incomplet, il faut le remplacer.
const CACHE_NAME = 'redant-lmp3-shell-v3';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ne jamais intercepter les appels vers Supabase (auth + donnees).
  if (url.hostname.includes('supabase.co')) return;
  // Autres origines (CDN...) : reseau normal.
  if (url.origin !== self.location.origin) return;

  // HTML / navigation : RESEAU D'ABORD (pour toujours avoir la derniere version),
  // cache en secours si hors-ligne.
  const isDoc = event.request.mode === 'navigate' ||
                url.pathname.endsWith('/') ||
                url.pathname.endsWith('.html');
  if (isDoc) {
    event.respondWith(
      fetch(event.request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      }).catch(() =>
        caches.match(event.request).then((c) => c || caches.match('./index.html'))
      )
    );
    return;
  }

  // Autres fichiers de l'app (icones, manifest...) : cache d'abord, reseau en secours.
  event.respondWith(
    caches.match(event.request).then((cached) =>
      cached || fetch(event.request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      }).catch(() => cached)
    )
  );
});
