/* THE STANDARD v8.0 Service Worker */
const CACHE_NAME='the-standard-v8-0-cache';
const APP_SHELL=[
  './',
  './index.html',
  './manifest.json',
  './styles/00-theme.css',
  './styles/10-base.css',
  './styles/20-components.css',
  './styles/30-mobile.css',
  './styles/90-overrides.css',
  './scripts/00-config.js',
  './scripts/10-legacy-app.js',
  './scripts/80-schema.js',
  './scripts/90-v8-bootstrap.js',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];
self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_SHELL).catch(()=>null)));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(u.hostname.includes('supabase.co')){e.respondWith(fetch(r));return}
  if(r.mode==='navigate'){e.respondWith(fetch(r).catch(()=>caches.match('./index.html')));return}
  e.respondWith(caches.match(r).then(c=>c||fetch(r).then(res=>{
    const copy=res.clone();
    caches.open(CACHE_NAME).then(cache=>{if(r.method==='GET'&&res.status===200)cache.put(r,copy)});
    return res;
  }).catch(()=>c)));
});
