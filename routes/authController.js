const jwt = require('jsonwebtoken');
const { Password, BadRequestError } = require('@smudsc/express');
require('dotenv').config();
const fs = require('../config/firebase-config');
const db = fs.firestore();

const signUp = async (req, res) => {
	const { email, password } = req.body;

	const userRef = db.collection('users');
	const snapshot = await userRef.where('email', '==', email).get();
	const existingUser = snapshot.docs.map((doc) => doc.data());

	if (existingUser.length) {
		res.status(400).send('Email in use!');
		throw new BadRequestError('Email in use!');
	}

	const hashedPassword = await Password.toHash(password);
	const data = { email, password: hashedPassword };

	await db.collection('users').doc().set(data);

	// Generate JWT
	const userJwt = jwt.sign({ email: email }, process.env.JWT_KEY);

	// Store it on session object
	req.session = { jwt: userJwt };

	res.status(201).send(data.email);
};

const signIn = async (req, res) => {
	const { email, password } = req.body;

	const userRef = db.collection('users');
	const snapshot = await userRef.where('email', '==', email).get();
	const existingUser = snapshot.docs.map((doc) => doc.data());

	if (!existingUser.length) {
		res.status(400).send('Invalid Credentials!');
		throw new BadRequestError('Invalid Credentials!');
	}
	const passwordMatch = await Password.compare(
		existingUser[0].password,
		password
	);

	if (!passwordMatch) {
		res.status(400).send('Invalid Credentials!');
		throw new BadRequestError('Invalid credentials');
	}

	// Generate JWT
	const userJwt = jwt.sign(
		{ email: existingUser[0].email },
		process.env.JWT_KEY
	);

	// Store it on session object
	req.session = { jwt: userJwt };
	res.status(200).send(existingUser);
};

const signOut = (req, res) => {
	req.session = null;
	res.send({});
};

const getCurrentUser = (req, res) => {
	res.send({ currentUser: req.currentUser || null });
};

module.exports = {
	signUp,
	signIn,
	signOut,
	getCurrentUser,
};
