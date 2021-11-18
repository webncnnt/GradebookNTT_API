import { register, login, changePassWord } from './auth.controllers';
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
				message: 'Email already exists'
			});
		}
	});
});

router.post('/login', (req: any, res: any, next: any) => {
	const email = req.body.email;
	const password = req.body.password;

	login(email, password).then(result => {
		if (result == null) {
			res.status(401).json({
				message: 'Email or Password is not correct'
			});
		} else {
			req.user = result.user;
			res.json(result);
		}
	});
});

router.post('/changePwd/:id', (req, res, next) => {
	const id = req.params.id;
	const newPass = req.body.password;

	changePassWord(parseInt(id), newPass)
		.then(result => {
			if(result){

				res.json({
					message: 'Change password successfully.'
				});
			}
			else{
				res.status(400).json({
					message: 'Bad Request!'
				});
			}
		
		})
		.catch(err => {
			res.status(500).json({
				message: 'Internal Server Error! '
			});
		});
});

export default router;
