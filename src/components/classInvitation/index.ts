import { isAuth } from '@src/auth/auth.middleware';
import { Router } from 'express';
import classInvitationRouter from './classInvitations.api';

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
	classInvitationRouter
);

export default router;
