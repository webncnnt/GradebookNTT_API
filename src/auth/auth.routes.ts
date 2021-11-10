import { register, login } from './auth.controllers';
import express from 'express';
const router = express.Router();

router.post('/register', (req, res, next) => {
	const fullname = req.body.fullname;
	const email = req.body.email;
	const password = req.body.password;

	register(fullname, email, password).then(result => {
		if (result) {
			res.json({
				message: 'register successfully.'
			});
		} else {
			res.status(409).json({
				message: 'Email already exists',
				status: 201
			});
		}
	});
});

router.post('/login', (req, res, next) =>{

	const email = req.body.email;
	const password = req.body.password;

	login(email,password).then((result) => {
		res.json(result)
	})
	
});

export default router;
