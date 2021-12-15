const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('firebase-admin');
// import firebase config
const config = require('./config/firebase-config');

app.use(express.json());
app.use(cors());
app.use(bodyParser.json())

// database stuff
const db = fs.firestore();
const usersDb = db.collection('users'); 




app.get('/', async function(req,res){
    const user = await db.collection('users').doc('CMbXajCUBYHAI8cF8k5S').get();
    console.log(user)
    res.end(user);
});

var server = app.listen(8080, function () {
    var host =  "localhost"
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
 })
