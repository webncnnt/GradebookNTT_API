import { isAuth } from '@src/auth/auth.middleware';
import { Router } from 'express';
import classInvitationRouter from './classInvitations.api';

const router = Router();

router.use('/', isAuth, classInvitationRouter);

export default router;
