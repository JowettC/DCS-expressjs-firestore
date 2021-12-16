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

// constructors
const User = require('./models/user')

// add user
app.post('/user', async function (req, res) {
    try {
        const data = req.body
        const results =  await db.collection('users').doc(data.username).set(data)
        res.end("Successfully Created");
    } catch (e){
        res.json({error:e})
    }
});


app.get('/users', async function (req, res) {
    try {
        const user = await db.collection('users').get();
        var response = []
        user.forEach(doc => {
            res.push(doc.data())
          });
        res.json({data:response})
    }
    catch(e){
        res.end("error: " + e);
    }
    
});

var server = app.listen(8080, function () {
    var host = "localhost"
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})
