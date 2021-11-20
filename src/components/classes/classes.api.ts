import { Class } from '@src/models/Class';
import { ClassInvitation } from '@src/models/ClassInvitation';
import { User } from '@src/models/User';
import { Router } from 'express';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.services';
import classesMiddleware, { restrictTo } from './classes.middleware';
import { UserClass } from '@src/models/UserClass';

const router = Router();

const classesService = new ClassesService(
	Class,
	User,
	ClassInvitation,
	UserClass
);
const classesController = new ClassesController(classesService);

// router.get('/:id/activities');

// router.get('/:id/deadlines');

// router.get('/:id/posts');

router.use('/:id', classesMiddleware.protect);

router
	.route('/:id/invitations')
	.get(classesController.getAllInvitationsByClassId)
	.post(classesController.createInvitation);

router
	.route('/:id/members')
	.get(classesController.getSortInformationMembersInClass)
	.delete(
		classesMiddleware.restrictTo('owner'),
		classesController.removeMembers
	)
	.delete(
		classesMiddleware.restrictTo('student', 'teacher'),
		classesController.leftClass
	);

router
	.route('/:id')
	.get(classesController.getClassDetailById)
	.patch(classesMiddleware.restrictTo('owner'), classesController.updateById)
	.delete(
		classesMiddleware.restrictTo('owner'),
		classesController.deleteById
	);

router
	.route('/')
	.get(classesController.getAllClassesByUserId)
	.post(classesController.create);

export default router;
