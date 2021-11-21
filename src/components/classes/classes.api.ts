import { Class } from '@src/models/Class';
import { ClassInvitation } from '@src/models/ClassInvitation';
import { User } from '@src/models/User';
import { Router } from 'express';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.services';
import classesMiddleware from './classes.middleware';
import { UserClass } from '@src/models/UserClass';
import { ClassInvitationServices } from '../classInvitation/classInvitation.services';
import { ClassesChecker } from './classes.checker';
import { ClassInvitationChecker } from '../classInvitation/classesInvitation.checker';

const router = Router();

const classesChecker = new ClassesChecker(Class, UserClass);

const classesService = new ClassesService(
	Class,
	User,
	UserClass,
	classesChecker
);

const classInvitationChecker = new ClassInvitationChecker(
	UserClass,
	Class,
	ClassInvitation
);

const classInvitationServices = new ClassInvitationServices(
	ClassInvitation,
	User,
	Class,
	classInvitationChecker,
	classesChecker
);

const classesController = new ClassesController(
	classesService,
	classInvitationServices
);

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

router.get('/:id/overview', classesController.getClassOverviewById);

router
	.route('/:id')
	.patch(classesMiddleware.restrictTo('owner'), classesController.updateById)
	.delete(
		classesMiddleware.restrictTo('owner'),
		classesController.deleteById
	);

router
	.route('/')
	.get(classesController.getAllClassesByUserId)
	.post(classesController.createClass);

export default router;
