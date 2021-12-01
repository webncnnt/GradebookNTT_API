import { Router } from 'express';
import apiRouter from './gradeStructures.api';

const router = Router({ mergeParams: true });

router.use('/', apiRouter);

export default router;
