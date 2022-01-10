import { isAuth, restrictTo } from '@src/auth/auth.middleware';
import express from 'express';
import apiAdminRouter from './admin.api';

const router = express.Router();

router.use('/', isAuth, restrictTo('admin'), apiAdminRouter);

export default router;
