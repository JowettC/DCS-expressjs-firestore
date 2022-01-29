// Import the functions you need from the SDKs you need

var fs = require('firebase-admin');

var serviceAccount = require('./serviceAccountKey.json');

var db = fs.initializeApp({
	credential: fs.credential.cert(serviceAccount),
});

module.exports = db;
