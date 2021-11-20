import { HttpStatusCode } from '@src/constant/httpStatusCode';
import { IllegalArgumentError, NotFoundError } from '@src/utils/appError';
import { catchAsyncRequestHandler } from '@src/utils/catchAsyncRequestHandler';
import { Request, Response, NextFunction } from 'express';
import { ClassInvitationInput } from './classInvitation.dto';
import { ClassInvitationServices } from './classInvitation.services';

export class ClassInvitationController {
	constructor(
		private readonly classInvitationServices: ClassInvitationServices
	) {}

	getInvitationByInviteCode = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const inviteCode = req.params.inviteCode;

			const classInvitationDto =
				await this.classInvitationServices.findInvitationByInviteCode(
					inviteCode
				);

			res.status(HttpStatusCode.OK).json({
				status: 'success',
				data: classInvitationDto
			});
		}
	);

	getInvitationByAccessToken = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const classId = req.params.classId;
			const role = req.query.role ? +req.query.role : undefined;
			const token = req.query.token ? `${req.query.token}` : undefined;

			if (!role)
				throw new IllegalArgumentError('Cannot find any invitations');

			if (!token)
				throw new IllegalArgumentError('Cannot find any invitations');

			const classInvitationDto =
				await this.classInvitationServices.findInvitationByClassIdWithRoleAndEmail(
					classId,
					role,
					token
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
			if (!inviteCode) throw new IllegalArgumentError('');

			const userId = req.user!.getId();

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
			const classId = req.params.classId;
			const role = req.query.role ? +req.query.role : undefined;

			if (!role)
				throw new IllegalArgumentError('Cannot find any invitations');

			await this.classInvitationServices.joinToClassByAccessToken(
				classId,
				role,
				req.user!.getEmail()
			);

			res.status(HttpStatusCode.OK).json({
				status: 'success',
				data: { id: classId }
			});
		}
	);
}
