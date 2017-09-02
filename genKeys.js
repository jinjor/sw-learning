const fs = require('fs');
const webpush = require('web-push');

const publicKeyFileName = __dirname + '/server/public.key';
const privateKeyFileName = __dirname + '/server/private.key';
const vapidKeys = webpush.generateVAPIDKeys();

fs.writeFileSync(publicKeyFileName, vapidKeys.publicKey);
fs.writeFileSync(privateKeyFileName, vapidKeys.privateKey);
