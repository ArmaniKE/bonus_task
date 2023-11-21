importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.1.2/workbox-sw.js');

if (workbox) {
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

  workbox.routing.registerRoute(
    new RegExp('http://localhost:3000/messages'),
    new workbox.strategies.NetworkFirst({
      cacheName: 'messages-cache',
    })
  );

  workbox.routing.registerRoute(
    new RegExp('http://localhost:3000/users'),
    new workbox.strategies.NetworkFirst({
      cacheName: 'users-cache',
    })
  );
}