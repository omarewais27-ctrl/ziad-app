/* service worker: يخلّي التطبيق يفتح بدون إنترنت */
const VER='ziad-v1';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VER).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VER).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const req=e.request;if(req.method!=='GET')return;
 const url=new URL(req.url);
 if(req.mode==='navigate'){
  e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(VER).then(c=>c.put('index.html',cp));return r}).catch(()=>caches.match('index.html')));return}
 const sameOrigin=url.origin===location.origin,fonts=/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
 if(!sameOrigin&&!fonts)return; /* الإطارات الخارجية (وقتي) والصور الخارجية تعدّي زي ما هي */
 e.respondWith(caches.match(req).then(hit=>{
  const net=fetch(req).then(r=>{if(r&&(r.ok||r.type==='opaque')){const cp=r.clone();caches.open(VER).then(c=>c.put(req,cp))}return r}).catch(()=>hit);
  return hit||net}))});
