import { HttpStatusCode } from '@src/constant/httpStatusCode';
import { IllegalArgumentError, NotFoundError } from '@src/utils/appError';
import { catchAsyncRequestHandler } from '@src/utils/catchAsyncRequestHandler';
import { Request, Response, NextFunction } from 'express';
import { ClassInvitationServices } from './classInvitation.services';

export class ClassInvitationController {
	constructor(
		private readonly classInvitationServices: ClassInvitationServices
	) {}

	getInvitationByInviteCode = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const inviteCode = req.params.inviteCode;

			const classInvitation =
				await this.classInvitationServices.findInvitationByInviteCode(
					inviteCode
				);

			res.status(HttpStatusCode.OK).json({
				status: 'success',
				message: `Invitation email ${classInvitation} to is sent successfully`
			});
		}
	);

	getInvitationByAccessToken = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const inviteCode = req.params.inviteCode;
			const role = req.query.role ? +req.query.role : undefined;
			const email = req.user?.email;

			if (!role)
				throw new IllegalArgumentError(
					`Cannot find any invitations with role code: ${role}`
				);

			if (!email)
				throw new IllegalArgumentError(
					`Cannot find any invitations with email: ${email}`
				);

			const classInvitationDto =
				await this.classInvitationServices.findInvitationByClassIdWithRoleAndEmail(
					inviteCode,
					role,
					email
				);

			res.status(HttpStatusCode.OK).json({
				status: 'success',
				data: classInvitationDto
			});
		}
	);

	joinClassByInviteCode = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const inviteCode = req.params.inviteCode;
			const userId = req.user!.id;

			const invitationAcceptedDto =
				await this.classInvitationServices.joinToClassByInviteCode(
					inviteCode,
					userId
				);

			res.status(HttpStatusCode.OK).json({
				status: 'success',
				data: invitationAcceptedDto
			});
		}
	);

	acceptInvitationByAccessToken = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const inviteCode = req.params.inviteCode;
			const role = req.query.role ? +req.query.role : undefined;

			console.log(req.query);
			console.log(role);

			if (!role)
				throw new IllegalArgumentError('Cannot find any invitations');

			await this.classInvitationServices.joinToClassByAccessToken(
				inviteCode,
				role,
				req.user!.id
			);

			res.status(HttpStatusCode.OK).json({
				status: 'success'
			});
		}
	);
}
