import { Router } from 'express';
import userContentRouter from './usercontent.api';

const router = Router();

router.use('/', userContentRouter);

export default router;
