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
import { ClassInvitationChecker } from '../classInvitation/classInvitation.checker';
import { ClassesCreator } from './classes.creator';
import gradeStructureRouter from './../gradeStructures/';

const router = Router();

const classesChecker = new ClassesChecker(Class, User, UserClass);
const classesCreator = new ClassesCreator(Class, UserClass);
const classesService = new ClassesService(
	Class,
	User,
	UserClass,
	classesChecker,
	classesCreator
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

router.use(
	'/:id',
	classesMiddleware.verifyExistsClass,
	classesMiddleware.protect
);

router.use('/:id/gradeStructures', gradeStructureRouter);

router
	.route('/:id/invitations')
	.get(classesController.getAllInvitationsByClassId)
	.post(classesController.createInvitation);

router
	.route('/:id/students')
	.get(classesController.getAllStudentOverviewsByClassId)
	.delete(
		classesMiddleware.restrictTo('owner'),
		classesController.removeStudents
	)
	.delete(
		classesMiddleware.restrictTo('student'),
		classesController.leftClass
	);

router
	.route('/:id/teachers')
	.get(classesController.getAllTeacherOverviewsByClassId)
	.delete(
		classesMiddleware.restrictTo('owner'),
		classesController.removeTeachers
	)
	.delete(
		classesMiddleware.restrictTo('teacher'),
		classesController.leftClass
	);

router
	.route('/:id')
	.get(classesController.getClassOverviewById)
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
