import { isAuth } from '@src/auth/auth.middleware';
import { Class } from '@src/models/Class';
import { ClassInvitation } from '@src/models/ClassInvitation';
import { User } from '@src/models/User';
import { Router } from 'express';
import { ClassInvitationController } from './classInvitation.controller';
import { ClassInvitationServices } from './classInvitation.services';

const router = Router();

const classInvitationController = new ClassInvitationController(
	new ClassInvitationServices(ClassInvitation, User, Class)
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
