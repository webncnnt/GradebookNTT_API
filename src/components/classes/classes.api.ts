import { Router } from 'express';
import { container } from 'tsyringe';
import { ClassesController } from './classes.controller';
import { validateIdParamsExist } from './classes.middleware';

const router = Router();

const classesController: ClassesController =
	container.resolve('classesController');

router.post('/', classesController.create);

router.get('/:id', validateIdParamsExist, classesController.getClassById);

router.patch('/:id', validateIdParamsExist, classesController.updateById);

router.delete('/:id', validateIdParamsExist, classesController.deleteById);

router.get('/', classesController.getAllActiveClasses);

export default router;
