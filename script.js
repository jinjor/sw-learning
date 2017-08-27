console.log('script.js', 'v10.1');

document.getElementById('container').textContent = 'App is working!';

const expiration = 1000 * 60 * 15;
const reqTime = Math.floor(Date.now() / expiration);
const url = 'https://api.github.com/repos/jinjor/sw-learning?request-time=' + reqTime;

fetch(url).then(res => res.json()).then(json => {
  document.getElementById('result').textContent = JSON.stringify(json, null, 2);
}).catch(e => {
  document.getElementById('result').textContent = e.toString();
});
