self.addEventListener("install", () => {
  console.log("[ServiceWorker] Install..");
});

importScripts("https://g.alicdn.com/kg/workbox/3.3.0/workbox-sw.js");
workbox.setConfig({
  modulePathPrefix: "https://g.alicdn.com/kg/workbox/3.3.0/",
  debug: true
});

workbox.core.setCacheNameDetails({
  prefix: "ynw",
  suffix: "v1",
  precache: "ynw-precache",
  runtime: "ynw-runtime"
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
    cacheName: "ynw-images",
    plugins: [staticCachePlugin]
  })
);

workbox.routing.registerRoute(
  /\.min\.(?:js|css)$/,
  workbox.strategies.cacheFirst({
    cacheName: "ynw-static",
    plugins: [staticCachePlugin]
  })
);

// Cache CSS and JavaScript Files
workbox.routing.registerRoute(
  /\.(?:bundle|swr)\.(?:js|css)/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: "ynw-static"
  })
);

// Force a Timeout on Network Requests
workbox.routing.registerRoute(
  /forceTimeout/,
  workbox.strategies.networkFirst({
    networkTimeoutSeconds: 3,
    cacheName: "ynw-timeout",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60 // 5 minutes
      })
    ]
  })
);
