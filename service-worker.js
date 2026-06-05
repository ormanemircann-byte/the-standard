/* THE STANDARD v7.2 Service Worker */
const CACHE_NAME='the-standard-v7-2-cache';
const APP_SHELL=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_SHELL).catch(()=>null)))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(u.hostname.includes('supabase.co')){e.respondWith(fetch(r));return}if(r.mode==='navigate'){e.respondWith(fetch(r).catch(()=>caches.match('./index.html')));return}e.respondWith(caches.match(r).then(c=>c||fetch(r).then(res=>{const copy=res.clone();caches.open(CACHE_NAME).then(cache=>{if(r.method==='GET'&&res.status===200)cache.put(r,copy)});return res}).catch(()=>c)))});
