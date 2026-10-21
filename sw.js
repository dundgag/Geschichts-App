/* Zeitgerüst: Offline-Speicher. Version 113fe3045c */
var CACHE = "zeitgeruest-113fe3045c";
var FILES = ["./", "index.html", "apple-touch-icon.png"];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(FILES.map(function (f) { return c.add(f).catch(function () {}); }));
  }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var r = e.request;
  if (r.method !== "GET" || r.headers.get("range") || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r).then(function (res) {
    var cp = res.clone();
    if (res.status === 200) caches.open(CACHE).then(function (c) { return c.put(r, cp); }).catch(function () {});
    return res;
  }).catch(function () {
    return caches.match(r).then(function (m) { return m || caches.match("index.html"); });
  }));
});
