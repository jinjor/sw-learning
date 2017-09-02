console.log('sw.js');

const version = 29;
const CACHE_APP = 'sw-learning/' + version;
const CACHE_DATA = 'sw-learning/' + version + '/data';
const validCache = [CACHE_APP, CACHE_DATA]

console.log('validCache', validCache);

self.addEventListener('install', event => {
  console.log('install: ', event);

  var urlsToCache = [
    '.',
    './script.js'
  ];

  // tell which resources to cache
  event.waitUntil(
    caches.open(CACHE_APP).then(cache => {
      console.log('put', urlsToCache.join(), 'to cache', CACHE_APP);
      return cache.addAll(urlsToCache);
    }).catch(e => {
      console.log(e);
      return Promise.reject(e);
    })
  );
});

self.addEventListener('fetch', event => {
  console.log('fetch:', event.request.mode, event.request.url);
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        console.log('cache hit', event.request.url)
        return response;
      }
      console.log('cache not hit', event.request.url)

      // important!
      var fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(response => {
        if (!response) {
          console.log('no response from ', fetchRequest.url);
          return;
        }
        if (response.status !== 200) {
          console.log('non-ok response', response.status, 'from', fetchRequest.url);
          return response;
        }
        if (response.type !== 'basic' && event.request.method === 'GET') {
          var responseToCache = response.clone(); // important!
          caches.open(CACHE_DATA)
            .then(cache => {
              console.log('put resource', event.request.url, 'to cache', CACHE_DATA);
              cache.put(event.request, responseToCache);
            });
        } else if (event.request.method === 'GET') {
          var responseToCache = response.clone(); // important!
          caches.open(CACHE_APP)
            .then(cache => {
              console.log('put resource', event.request.url, 'to cache', CACHE_APP);
              cache.put(event.request, responseToCache);
            });
        }
        return response;
      });
    })
  );
});


self.addEventListener('activate', event => {
  console.log('activate:', event);

  event.waitUntil(
    caches.keys().then(cacheNames => {
      console.log('found caches', cacheNames.join());
      return Promise.all(
        cacheNames.map(cacheName => {
          if (validCache.indexOf(cacheName) < 0) {
            console.log('delete cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
