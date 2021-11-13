import { Class } from '@src/models/Class';
import { Router } from 'express';
import { ClassesService } from './classes.services';
import apiRouter from './classes.api';

const router = Router();

router.use(
	'/',
	(req, res, next) => {
		req.user = {
			getId: () => 1,
			getPassword: () => '121212',
			getRoles: () => [],
			getUsername: () => 'owns',
			isAccountBlock: () => false
		};

		next();
	},
	apiRouter
);

export default router;
