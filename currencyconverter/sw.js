// Service worker file
const staticCacheName = 'CurrencyConverter-static-v3';

const filesCache = [
  '../',
  '../index.html',
  '../assets/scripts/appcontroller.js',
  // '../assets/scripts/idb.js',
  '../assets/style.css',
  '../assets/img/icon.png',
  'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/bulma/0.6.2/css/bulma.min.css',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll(filesCache);
    }).catch( err => console.log(`Error: ${err}`))
  );
});


self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('CurrencyConverter-') && staticCacheName !== cacheName;
        }).map(function(cacheName) {
          if(staticCacheName !== cacheName){
              return caches.delete(cacheName);
          }
        })
      );
    })
  );
});


self.addEventListener('fetch', function(event) {
  let requestUrl = new URL(event.request.url);
  

  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname === '/') {
      caches.match(event.request).then(response => {
        if (response) {
           event.respondWith(caches.match('../index.html'));
           return;
        }
      });
    }
  }
 
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    }).catch(error => {
      return error;
    })
  );

});

// self.addEventListener('message', function(event) {
//   if (event.data.action === 'skipWaiting') {
//     self.skipWaiting();
//   }
// });