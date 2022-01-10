import { Class } from '@src/models/Class';
import { User } from '@src/models/User';
import { UserClass } from '@src/models/UserClass';
import express from 'express';
import { ClassesChecker } from '../classes/classes.checker';
import { ClassesCreator } from '../classes/classes.creator';
import { AdminController } from './admin.controller';
import { AdminServices } from './admin.services';

const router = express.Router();

const classesChecker = new ClassesChecker(Class, User, UserClass);
const classesCreator = new ClassesCreator(Class, UserClass);

const adminServices = new AdminServices(
	User,
	Class,
	classesChecker,
	classesCreator
);
const adminController = new AdminController(adminServices);

router.get('/admins/:id', adminController.getAdminById);
router
	.route('/admins')
	.post(adminController.createAdmin)
	.get(adminController.getAllAdmins);

router.get('/classes/:id', adminController.getClassById);
router.get('/classes', adminController.getAllClasses);

router
	.route('/users/:id')
	.delete(adminController.blockUser)
	.get(adminController.getUserById);

router.route('/users').get(adminController.getAllUsers);

export default router;
