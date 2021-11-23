import { isAuth } from '@src/auth/auth.middleware';
import { Class } from '@src/models/Class';
import { ClassInvitation } from '@src/models/ClassInvitation';
import { User } from '@src/models/User';
import { UserClass } from '@src/models/UserClass';
import { Router } from 'express';
import { ClassesChecker } from '../classes/classes.checker';
import { ClassInvitationChecker } from './classInvitation.checker';
import { ClassInvitationController } from './classInvitation.controller';
import { ClassInvitationServices } from './classInvitation.services';

const router = Router();

const classChecker = new ClassesChecker(Class, User, UserClass);

const classInvitationChecker = new ClassInvitationChecker(
	UserClass,
	Class,
	ClassInvitation
);

const classInvitationController = new ClassInvitationController(
	new ClassInvitationServices(
		ClassInvitation,
		User,
		Class,
		classInvitationChecker,
		classChecker
	)
);

// auth
// class id, role & token
router
	.route('/access_token/:inviteCode')
	.get(classInvitationController.getInvitationByAccessToken)
	.post(classInvitationController.acceptInvitationByAccessToken);

// auth
router
	.route('/:inviteCode')
	.get(classInvitationController.getInvitationByInviteCode)
	.post(classInvitationController.joinClassByInviteCode);

export default router;
