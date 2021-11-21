import { isAuth } from '@src/auth/auth.middleware';
import { Router } from 'express';
import apiRouter from './classes.api';

const router = Router();

router.use(
	'/',
	(req, res, next) => {
		// just for testing
		req.user = {
			id: 1,
			email: 'dfdfaaaaaa@gmail.com',
			roles: [],
			isBlock: false
		};

		next();
	},
	apiRouter
);

export default router;
