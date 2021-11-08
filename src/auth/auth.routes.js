const express = require('express');
const router = express.Router();

const authController = require('./auth.controllers');

router.post('/register', (req, res, next) => {
	const fullname = req.body.fullname;
	const email = req.body.email;
	const password = req.body.password;

	authController
		.register(fullname, email, password)
		.then(result => {res.json(result)})
		.catch(err => {
            console.log(err);
        });
});

module.exports = router;
