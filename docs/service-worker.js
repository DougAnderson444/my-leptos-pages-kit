const e = /* @__PURE__ */ location.pathname.split("/").slice(0, -1).join("/"), i = [
  e + "/_app/immutable/entry/app.8e637bab.js",
  e + "/_app/immutable/assets/0.8211865c.css",
  e + "/_app/immutable/nodes/0.e73190b0.js",
  e + "/_app/immutable/nodes/1.1a28f6c7.js",
  e + "/_app/immutable/nodes/2.8bf4c53d.js",
  e + "/_app/immutable/chunks/index.7cf2deec.js",
  e + "/_app/immutable/chunks/scheduler.e108d1fd.js",
  e + "/_app/immutable/chunks/singletons.90c11950.js",
  e + "/_app/immutable/assets/counter.7ce83abd.wasm",
  e + "/_app/immutable/entry/start.f02aee03.js"
], o = [
  e + "/.nojekyll",
  e + "/favicon.ico",
  e + "/favicon.png",
  e + "/images/decrease.png",
  e + "/images/increase.png"
], l = "1687534708768", t = self, n = `static-cache-${l}`, r = i.concat(o);
t.addEventListener("install", (a) => {
  console.log("[ServiceWorker] Install"), a.waitUntil(
    caches.open(n).then((s) => (console.log("[ServiceWorker] Pre-caching offline page"), s.addAll(r).then(() => {
      t.skipWaiting();
    })))
  );
});
t.addEventListener("activate", (a) => {
  console.log("[ServiceWorker] Activate"), a.waitUntil(
    caches.keys().then(
      async (s) => Promise.all(
        s.map((c) => {
          if (c !== n)
            return console.log("[ServiceWorker] Removing old cache", c), caches.delete(c);
        })
      )
    )
  ), t.clients.claim();
});
self.addEventListener("fetch", (a) => {
  console.log("[ServiceWorker] Fetch", a.request.url), a.request.mode === "navigate" && a.respondWith(
    fetch(a.request).catch(() => caches.open(n).then((s) => s.match("offline.html")))
  );
});
