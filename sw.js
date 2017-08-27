console.log('sw.js');

const version = 9;
const CACHE_APP = 'sw-learning/' + version;
const CACHE_DATA = 'sw-learning/' + version + '/' + Math.floor(Date.now() / (1000 * 60 * 60));
const validCache = [CACHE_APP, CACHE_DATA]

console.log('validCache', validCache);

self.addEventListener('install', function(event) {
  console.log('install: ', event);

  var urlsToCache = [
    '.',
    './script.js'
  ];

  // tell which resources to cache
  event.waitUntil(
    caches.open(CACHE_APP)
    .then(function(cache) {
      console.log('put', urlsToCache.join(), 'to cache', CACHE_APP);
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
            var responseToCache = response.clone(); // important!
            caches.open(CACHE_DATA)
              .then(function(cache) {
                console.log('put resource', event.request.url, 'to cache', CACHE_DATA);
                cache.put(event.request, responseToCache);
              });
          } else {
            var responseToCache = response.clone(); // important!
            caches.open(CACHE_APP)
              .then(function(cache) {
                console.log('put resource', event.request.url, 'to cache', CACHE_APP);
                cache.put(event.request, responseToCache);
              });
          }
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
          if (validCache.indexOf(cacheName) < 0) {
            console.log('delete cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
