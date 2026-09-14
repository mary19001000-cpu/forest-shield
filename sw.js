const CACHE_NAME = 'forest-shield-v4';
const urlsToCache = ['./','./index.html','./manifest.json','./assets/icon-192.png','./assets/icon-512.png'];
self.addEventListener('install', e => { self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(urlsToCache).catch(()=>{}))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ns =>
  Promise.all(ns.filter(n=>n!==CACHE_NAME).map(n=>caches.delete(n)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = e.request.url;
  if (u.includes('firestore.googleapis.com') || u.includes('router.project-osrm.org') ||
      u.includes('googleapis.com') || u.includes('openstreetmap.org')) return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res=>{
    if (e.request.method==='GET' && res.status===200 && (u.includes('unpkg.com')||u.includes(location.origin)===false&&u.startsWith(location.origin))) {
      const copy=res.clone(); caches.open(CACHE_NAME).then(c=>c.put(e.request,copy));
    }
    return res;
  }).catch(()=>caches.match('./index.html'))));
});