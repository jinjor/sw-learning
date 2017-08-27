document.getElementById('container').textContent = 'App is working!';

var url = 'https://api.github.com/repos/jinjor/sw-learning';

fetch(url).then(res => res.json()).then(json => {
  console.log(json);
  document.getElementById('result').textContent = JSON.stringify(json, null, 2);
}).catch(e => {
  document.getElementById('result').textContent = e.toString();
});
