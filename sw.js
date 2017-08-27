console.log('sw.js');

const version = 5;
const CACHE_NAME = 'sw-learning-v' + version;

console.log('CACHE_NAME', CACHE_NAME);

var urlsToCache = [
  '.',
  './script.js'
];

self.addEventListener('install', function(event) {
  console.log('install: ', event);

  // tell which resources to cache
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function(cache) {
      console.log('put', urlsToCache.join(), 'to cache', CACHE_NAME);
      return cache.addAll(urlsToCache);
    }).catch(function(e) {
      console.log(e);
      return Promise.reject(e);
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.log('fetch:', event.request.mode, event.request.url);
  event.respondWith(
    caches.match(event.request)
    .then(function(response) {
      if (response) {
        console.log('cache hit', event.request.url)
        return response;
      }
      console.log('cache not hit', event.request.url)

      // important!
      var fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(
        function(response) {
          if (!response) {
            console.log('no response from ', fetchRequest.url);
            return;
          }
          if (response.status !== 200) {
            console.log('non-ok response', response.status, 'from', fetchRequest.url);
            return response;
          }
          if (response.type !== 'basic') {
            console.log('non-basic response', response.type, 'from', fetchRequest.url);
            // return response;
          }

          // important!
          var responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(function(cache) {
              console.log('put response to cache', event.request.url);
              cache.put(event.request, responseToCache);
            });

          return response;
        }
      );
    })
  );
});


self.addEventListener('activate', function(event) {
  console.log('activate:', event);

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      console.log('found caches', cacheNames.join());
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('delete cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
