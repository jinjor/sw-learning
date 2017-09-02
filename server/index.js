const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const webpush = require('web-push');
const privateKey = fs.readFileSync(__dirname + '/private.key', 'utf8');
const publicKey = fs.readFileSync(__dirname + '/public.key', 'utf8');

webpush.setGCMAPIKey('<Your GCM API Key Here>');
webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  publicKey,
  privateKey
);

app.use('/', express.static(__dirname + '/../public'));
app.use(bodyParser.json());

app.get('/pubkey', (req, res) => {
  res.send(publicKey);
});

app.post('/push', (req, res) => {
  const subscription = req.body.subscription;
  const text = req.body.data;
  console.log(subscription);
  console.log(text);
  webpush.sendNotification(subscription, text).then(() => {
    res.send();
  }).catch(e => {
    if (e.statusCode) {
      res.status(e.statusCode).send(e.body);
    } else {
      res.status(400).send(e.message);
    }
  });
});

app.listen(3000);
