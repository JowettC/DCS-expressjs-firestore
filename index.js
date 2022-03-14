
const {
	errorHandler,
	NotFoundError,
	requireAuth,
	currentUser,
	validateRequest,
} = require('@smudsc/express');
const {
	signUp,
	signIn,
	signOut,
	getCurrentUser,
} = require('./routes/authController');


const fs = require('./config/firebase-config');
const db = fs.firestore();




const express = require('express');
const { body } = require('express-validator');
const cookieSession = require('cookie-session');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// import firebase config

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(
	cookieSession({
		name: 'session',
		signed: false,
	})
);

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.get('/api/users/currentuser', currentUser, getCurrentUser);
app.post(
	'/api/users/signin',
	[
		body('email').isEmail().withMessage('Email must be valid'),
		body('password')
			.trim()
			.notEmpty()
			.withMessage('You must supply a password'),
	],
	validateRequest,
	signIn
);
app.post('/api/users/signout', signOut);
app.post(
	'/api/users/signup',
	[
		body('email').isEmail().withMessage('Email must be valid'),
		body('password')
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage('Password must be between 4 and 20 characters'),
	],
	validateRequest,
	signUp
);

// get list of products
app.get('/api/products', async (req,res) => {
	const itemRef = db.collection('items');
	const snapshot = await itemRef.get();
	const items = await snapshot.docs.map((doc) => doc.data());
	// console.log(items)
	res.status(200).send(items);
	
});

// get items in user's cart
app.get('/api/cart/:email', async (req,res) => {
	const userRef = db.collection('users');
	const snapshot = await userRef.where('email', '==', req.params.email).get();
	if (snapshot.empty) {
		res.status(404).send({
			msg: "No existing Email"
		})
		return;
	  }  
	const userCart = snapshot.docs.map((doc) => doc.data().cart);
	res.status(200).send({ userCart:  userCart});
});

// make changes in user cart
app.post('/api/cart/:email', async (req,res) => {
	data = req.body;
	email = req.params.email;
	
	const userRef = db.collection('users');
	const snapshot = await userRef.where('email', '==', req.params.email).get()
	if (snapshot.empty) {
		res.status(404).send({
			msg: "No existing Email"
		})
		return;
	  }  
	const doc_id = snapshot.docs.map((doc) => doc.id);
	userRef.doc(doc_id[0]).update({
		cart:data.items
	})
	res.status(200).send({data:data.items});
});

app.all('*', () => {
	throw new NotFoundError();
});

app.use(errorHandler);

var server = app.listen(8080, function () {
	var host = 'localhost';
	var port = server.address().port;
	console.log('Express app listening at http://%s:%s', host, port);
});
