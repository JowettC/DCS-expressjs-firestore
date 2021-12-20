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
	
});

// get items in user's cart
app.get('/api/cart',requireAuth, async (req,res) => {
	
});

// make changes in user cart
app.post('/api/cart',requireAuth, async (req,res) => {
	
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
