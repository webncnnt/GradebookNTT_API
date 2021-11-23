import { isAuth } from '@src/auth/auth.middleware';
import { Router } from 'express';
import apiRouter from './classes.api';

const router = Router();

router.use('/', isAuth, apiRouter);

export default router;
