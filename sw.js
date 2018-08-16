self.addEventListener("install", () => {
  console.log("[ServiceWorker] Install..");
});

importScripts("https://g.alicdn.com/kg/workbox/3.3.0/workbox-sw.js");
workbox.setConfig({
  modulePathPrefix: "https://g.alicdn.com/kg/workbox/3.3.0/",
  debug: true
});

workbox.core.setCacheNameDetails({
  prefix: "my-app",
  suffix: "v1",
  precache: "precache",
  runtime: "runtime"
});

const staticCachePlugin = new workbox.expiration.Plugin({
  maxAgeSeconds: 30 * 24 * 60 * 60 //30 Day
});

// set strateies with query params
workbox.routing.registerRoute(
  /strategies=staleWhileRevalidate/,
  workbox.strategies.staleWhileRevalidate()
);

workbox.routing.registerRoute(
  /strategies=networkFirst/,
  workbox.strategies.networkFirst()
);

workbox.routing.registerRoute(
  /strategies=cacheFirst/,
  workbox.strategies.cacheFirst()
);

workbox.routing.registerRoute(
  /strategies=networkOnly/,
  workbox.strategies.networkOnly()
);

// Caching Images
workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg|woff2?)$/,
  workbox.strategies.cacheFirst({
    cacheName: "images",
    plugins: [staticCachePlugin]
  })
);

// Cache CSS and JavaScript Files
workbox.routing.registerRoute(
  /\.(?:bundle|swr)\.(?:js|css)/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: "static-resources"
  })
);

workbox.routing.registerRoute(
  /\.min\.(?:js|css)$/,
  workbox.strategies.cacheFirst({
    cacheName: "static-resources",
    plugins: [staticCachePlugin]
  })
);

// Force a Timeout on Network Requests
workbox.routing.registerRoute(
  /test\/timeout/,
  workbox.strategies.networkFirst({
    networkTimeoutSeconds: 3,
    cacheName: "long-time",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60 // 5 minutes
      })
    ]
  })
);


