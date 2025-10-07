// Service worker for Grzybownik iOS Edition
const CACHE = 'grzybownik-ios-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];
self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(APP_SHELL)));
  self.skipWaiting();
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k===CACHE?null:caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e=>{
  const url = new URL(e.request.url);
  const thirdParty = url.origin !== self.location.origin;
  if (thirdParty) { return; } // network default for third-party (e.g., tiles, fonts)
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(net => {
      const copy = net.clone();
      caches.open(CACHE).then(c=>c.put(e.request, copy));
      return net;
    }).catch(()=>caches.match('./index.html')))
  );
});