import { sendInvitation } from './../mailServices/mail.service';
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
import { ClassInvitationInput } from '../classInvitation/classInvitation.dto';
import { ClassInvitationServices } from '../classInvitation/classInvitation.services';
import { RoleUserInClass } from '@src/models/UserClass';
import { EmailInvitationInfor } from '../mailServices/mail.service';
import { Class } from '@src/models/Class';

export class ClassesController {
	private readonly classesService: ClassesService;
	private readonly classesInvitationService: ClassInvitationServices;

	constructor(
		classesService: ClassesService,
		classesInvitationService: ClassInvitationServices
	) {
		this.classesService = classesService;
		this.classesInvitationService = classesInvitationService;
	}

	createClass = catchAsyncRequestHandler(
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

			const invitation =
				await this.classesInvitationService.createInvitation(
					classId,
					req.user!.id,
					invitationInput
				);

			const invitationEmailInfor =
				await this.classesInvitationService.createInvitationEmailInfor(
					invitation.id
				);

			const result = await sendInvitation(invitationEmailInfor);

			res.status(HttpStatusCode.CREATED).json({
				status: 'success'
			});
		}
	);

	deleteInvitation = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const invitationId = +req.params.invitationId;

			await this.classesInvitationService.deleteInvitationById(
				invitationId
			);
		}
	);

	getClassPublicInviteLink = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const classId = +req.params.id;

			const inviteLink =
				await this.classesInvitationService.getClassInvitationPublicLink(
					classId
				);

			res.status(HttpStatusCode.OK).json({
				status: 'success',
				data: {
					id: classId,
					inviteLink
				}
			});
		}
	);

	getAllStudentOverviewsByClassId = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const classId = +req.params.id;

			const students =
				await this.classesService.findAllStudentOverviewsByClassId(
					classId
				);

			res.status(HttpStatusCode.OK).json({
				status: 'success',
				data: students
			});
		}
	);

	getAllTeacherOverviewsByClassId = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const classId = +req.params.id;

			const teachers =
				await this.classesService.findAllTeacherOverviewsByClassId(
					classId
				);

			res.status(HttpStatusCode.OK).json({
				status: 'success',
				data: teachers
			});
		}
	);

	getAllInvitationsByClassId = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const classId = +req.params.classId;

			const invitations =
				await this.classesInvitationService.findAllInvitationsByClassId(
					classId
				);

			res.status(HttpStatusCode.OK).json({
				status: 'success',
				data: {
					invitations
				}
			});
		}
	);

	getAllClassesByUserId = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const userId = +req.user!.id;
			const page = req.query.page ? +req.query.page : 1;

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

	getClassOverviewById = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const classId = +req.params.id;

			const clzDto = await this.classesService.findClassOverviewById(
				classId
			);

			res.status(HttpStatusCode.OK).json({
				status: 'success',
				data: clzDto
			});
		}
	);

	leftClass = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const userId = req.user?.id;
			const classId = +req.params.id;
			const role = req.query.role ? +req.query.role : undefined;

			if (!userId)
				throw new UnauthorizedError(AuthorizeMessageError.UNAUTHORIZED);

			if (!role) throw new IllegalArgumentError('Invalid role');

			await this.classesService.leftClass(userId, classId, role);

			res.status(HttpStatusCode.OK).json({
				status: 'success'
			});
		}
	);

	removeTeachers = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const classId = +req.params.id;
			const memberIds = (req.query.id as string)
				?.split(',')
				.map(id => +id);

			if (!memberIds)
				throw new IllegalArgumentError('Invalid role or member id');

			await this.classesService.removeTeachersByClassId(
				classId,
				memberIds
			);

			res.status(HttpStatusCode.OK).json({
				status: 'success',
				message: 'Remove members successfully'
			});
		}
	);

	removeStudents = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const classId = +req.params.id;
			const memberIds = (req.query.id as string)
				?.split(',')
				.map(id => +id);

			if (!memberIds)
				throw new IllegalArgumentError('Invalid role or member id');

			await this.classesService.removeStudentsByClassId(
				classId,
				memberIds
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
