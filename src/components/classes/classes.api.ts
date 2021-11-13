import { Class } from '@src/models/Class';
import { Router } from 'express';
import { ClassesController } from './classes.controller';
import { validateIdParamsExist } from './classes.middleware';
import { ClassesService } from './classes.services';

const router = Router();

const classesService = new ClassesService(Class);
const classesController = new ClassesController(classesService);

router
	.route('/')
	.get(classesController.getAllActiveClasses)
	.post(classesController.create);

router
	.use(validateIdParamsExist)
	.route('/:id')
	.get(classesController.getClassById)
	.patch(validateIdParamsExist, classesController.updateById)
	.delete(validateIdParamsExist, classesController.deleteById);

export default router;
