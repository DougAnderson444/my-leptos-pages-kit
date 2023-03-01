const l = [
  "/my-leptos-pages-kit/_app/immutable/entry/app.a52b88d6.js",
  "/my-leptos-pages-kit/_app/immutable/chunks/0.ed28e857.js",
  "/my-leptos-pages-kit/_app/immutable/chunks/1.12528ef0.js",
  "/my-leptos-pages-kit/_app/immutable/chunks/2.776194f6.js",
  "/my-leptos-pages-kit/_app/immutable/chunks/_layout.da46b06b.js",
  "/my-leptos-pages-kit/_app/immutable/chunks/index.f98f3a93.js",
  "/my-leptos-pages-kit/_app/immutable/chunks/singletons.5ea2ee9b.js",
  "/my-leptos-pages-kit/_app/immutable/assets/leptos_counter.7ab947cc.wasm",
  "/my-leptos-pages-kit/_app/immutable/entry/start.1d8dce74.js",
  "/my-leptos-pages-kit/_app/immutable/entry/error.svelte.632aa0bb.js",
  "/my-leptos-pages-kit/_app/immutable/assets/_layout.177663e8.css",
  "/my-leptos-pages-kit/_app/immutable/entry/_layout.js.984db11e.js",
  "/my-leptos-pages-kit/_app/immutable/entry/_layout.svelte.a7647e36.js",
  "/my-leptos-pages-kit/_app/immutable/entry/_page.svelte.2fb6d642.js"
], i = [
  "/my-leptos-pages-kit/.nojekyll",
  "/my-leptos-pages-kit/decrease.png",
  "/my-leptos-pages-kit/favicon.ico",
  "/my-leptos-pages-kit/favicon.png",
  "/my-leptos-pages-kit/increase.png"
], o = "1677687904525", s = self, p = `static-cache-${o}`, n = l.concat(i);
s.addEventListener("install", (e) => {
  console.log("[ServiceWorker] Install"), e.waitUntil(
    caches.open(p).then((t) => (console.log("[ServiceWorker] Pre-caching offline page"), t.addAll(n).then(() => {
      s.skipWaiting();
    })))
  );
});
s.addEventListener("activate", (e) => {
  console.log("[ServiceWorker] Activate"), e.waitUntil(
    caches.keys().then(
      async (t) => Promise.all(
        t.map((a) => {
          if (a !== p)
            return console.log("[ServiceWorker] Removing old cache", a), caches.delete(a);
        })
      )
    )
  ), s.clients.claim();
});
self.addEventListener("fetch", (e) => {
  console.log("[ServiceWorker] Fetch", e.request.url), e.request.mode === "navigate" && e.respondWith(
    fetch(e.request).catch(() => caches.open(p).then((t) => t.match("offline.html")))
  );
});
