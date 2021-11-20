import { catchAsyncRequestHandler } from '@src/utils/catchAsyncRequestHandler';
import {
	AppError,
	IllegalArgumentError,
	UnauthorizedError
} from '@src/utils/appError';

import { ClassesService } from './classes.services';
import { ClassesMessageError, ClassesMessageSuccess } from './classes.constant';
import { CreateClassInput, UpdateClassInput } from './classes.dto';

import { HttpStatusCode } from '@src/constant/httpStatusCode';
import { HEADER_COUNT } from '@src/constant/headerConstants';
import { AuthorizeMessageError } from '@src/constant/authorizeError';
import { NextFunction, Request, Response } from 'express';
import { RoleUserInClass } from '@src/models/UserClass';
import { ClassInvitationInput } from '../classInvitation/classInvitation.dto';

export class ClassesController {
	private readonly classesService: ClassesService;

	constructor(classesService: ClassesService) {
		this.classesService = classesService;
	}

	create = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const createClassInput = req.body as CreateClassInput;

			if (!createClassInput)
				throw new IllegalArgumentError(
					ClassesMessageError.NOT_ENOUGH_INFORMATION_CREATE_CLASS
				);

			const ownerId = req.user!.id;

			const clzDto = await this.classesService.create(
				ownerId,
				createClassInput
			);

			res.status(HttpStatusCode.CREATED).json({
				status: 'success',
				message: ClassesMessageSuccess.SUCCESS_CREATE_CLASS,
				data: clzDto
			});
		}
	);

	createInvitation = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const classId = +req.params.id;
			const invitationInput = req.body as ClassInvitationInput;

			await this.classesService.createInvitation(
				classId,
				invitationInput
			);

			console.log('in create invitation');
			// send email

			res.status(HttpStatusCode.CREATED);
		}
	);

	deleteInvitation = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const invitationId = +req.params.invitationId;

			await this.classesService.deleteInvitationById(invitationId);
		}
	);

	getAllInvitationsByClassId = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const classId = +req.params.classId;

			await this.classesService.findAllInvitationsByClassId(classId);
		}
	);

	getAllClassesByUserId = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const userId = +req.user!.id;
			const page = req.query.page ? +req.query.page : 1;

			console.log(page);

			const [classesDto, totalClasses] =
				await this.classesService!.findAndCountAllClassOverviewsWithUserIdByPage(
					userId,
					page
				);

			res.status(HttpStatusCode.OK)
				.header(HEADER_COUNT, totalClasses.toString())
				.json({
					status: 'success',
					data: classesDto
				});
		}
	);

	getClassDetailById = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {}
	);

	getSortInformationMembersInClass = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const classId = +req.params.id;

			console.log(classId);
			console.log('get sort information');
			const clzDto =
				await this.classesService.findAllMemberOverviewsByClassId(
					classId
				);

			res.status(200).json({ status: 'success', data: clzDto });
		}
	);

	leftClass = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const userId = req.user?.id;
			const classId = +req.params.id;
			const role = +req.query;

			if (!userId)
				throw new UnauthorizedError(AuthorizeMessageError.UNAUTHORIZED);

			await this.classesService.leftClass(userId, classId, role);
		}
	);

	// Todo: teacher id == owner id => not delete
	removeMembers = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const classId = +req.params.id;
			const role = req.query.role ? +req.query.role : undefined;
			const memberIds = (req.query.id as string)
				?.split(',')
				.map(id => +id);

			if (!memberIds || !role)
				throw new IllegalArgumentError('Invalid role or member id');

			await this.classesService.removeMembersByClassId(
				classId,
				memberIds,
				role
			);

			res.status(HttpStatusCode.OK).json({
				status: 'success',
				message: 'Remove members successfully'
			});
		}
	);

	updateById = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const classId = +req.params.id;
			const updateClassInput = req.body as UpdateClassInput;

			if (!updateClassInput)
				throw new IllegalArgumentError(
					ClassesMessageError.NOT_ENOUGH_INFORMATION_UPDATE_CLASS
				);

			await this.classesService.updateClassById(
				classId,
				updateClassInput
			);

			res.status(HttpStatusCode.OK).json({
				status: 'success',
				message: ClassesMessageSuccess.SUCCESS_UPDATE_CLASS
			});
		}
	);

	deleteById = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const id = +req.params.id;

			await this.classesService.deleteById(id);

			res.status(HttpStatusCode.OK).json({
				status: 'success',
				message: ClassesMessageSuccess.SUCCESS_DELETE_CLASS
			});
		}
	);
}
