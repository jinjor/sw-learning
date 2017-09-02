document.getElementById('container').textContent = 'App is working!';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').then(registration => {
    console.log('ServiceWorker registration successful with scope: ', registration.scope);

    document.getElementById('push').addEventListener('click', e => {
      registration.pushManager.getSubscription().then(subscription => {
        return fetch('/push', {
          method: 'POST',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            subscription: subscription,
            data: 'foo'
          })
        });
      }).catch(e => {
        console.log(e);
      });
    });
    return fetch('/pubkey').then(res => res.text()).then(vapidPublicKey => {
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
      registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });
    });
  }).catch(err => {
    console.log('ServiceWorker registration failed: ', err);
  });
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// main logic
const url = 'https://api.github.com/repos/jinjor/sw-learning';

fetch(url).then(res => res.json()).then(json => {
  document.getElementById('result').textContent = JSON.stringify(json, null, 2);
}).catch(e => {
  document.getElementById('result').textContent = e.toString();
});
