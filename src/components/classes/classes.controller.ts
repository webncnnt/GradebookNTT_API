import { catchAsyncRequestHandler } from '@src/utils/catchAsyncRequestHandler';
import { AppError } from '@src/utils/appError';

import { ClassesService } from './classes.services';
import { ClassesMessageError, ClassesMessageSuccess } from './classes.constant';
import {
	classToResponseDtoConverter,
	CreateClassDto,
	ResponseClassDto,
	UpdateClassDto
} from './classes.dto';

import { HttpStatusCode } from '@src/constant/httpStatusCode';
import { AuthorizeMessageError } from '@src/constant/authorizeError';
import { NextFunction, Request, Response } from 'express';

export class ClassesController {
	private readonly classesService: ClassesService;

	constructor(classesService: ClassesService) {
		this.classesService = classesService;
	}

	create = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const createClassDto = req.body as CreateClassDto;

			if (!req.user)
				return new AppError(
					HttpStatusCode.UNAUTHORIZED,
					AuthorizeMessageError.UNAUTHORIZED
				);

			const ownerId = req.user.getId();

			if (!createClassDto)
				return new AppError(
					HttpStatusCode.BAD_REQUEST,
					ClassesMessageError.NOT_ENOUGH_INFORMATION_CREATE_CLASS
				);

			const clz = await this.classesService.create(
				ownerId,
				createClassDto
			);

			const clzResponse = classToResponseDtoConverter(clz);

			res.status(HttpStatusCode.OK).json({
				status: 'success',
				message: ClassesMessageSuccess.SUCCESS_CREATE_CLASS,
				data: clzResponse
			});
		}
	);

	getAllActiveClasses = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const classes = await this.classesService!.getAllClasses();

			const classesResponseDto: ResponseClassDto[] = classes.map(clz =>
				classToResponseDtoConverter(clz)
			);

			res.status(HttpStatusCode.OK).json({
				status: 'success',
				data: {
					length: classesResponseDto.length,
					classes: classesResponseDto
				}
			});
		}
	);

	getClassById = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const id = +req.params.id;

			const clz = await this.classesService.getClassById(id);

			if (!clz)
				return new AppError(
					HttpStatusCode.NOT_FOUND,
					ClassesMessageError.CLASS_NOT_EXISTS
				);

			const clzResponse: ResponseClassDto =
				classToResponseDtoConverter(clz);

			res.status(HttpStatusCode.OK).json({
				status: 'success',
				data: { class: clzResponse }
			});
		}
	);

	updateById = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const updateClassDto = req.body as UpdateClassDto;

			const id = +req.params.id;

			if (!updateClassDto)
				return new AppError(
					HttpStatusCode.BAD_REQUEST,
					ClassesMessageError.NOT_ENOUGH_INFORMATION_UPDATE_CLASS
				);

			const clz = await this.classesService.updateById(
				id,
				updateClassDto
			);

			if (!clz)
				return new AppError(
					HttpStatusCode.NOT_FOUND,
					ClassesMessageError.CLASS_NOT_EXISTS
				);

			const clzResponse: ResponseClassDto =
				classToResponseDtoConverter(clz);

			res.status(HttpStatusCode.OK).json({
				status: 'success',
				data: { class: clzResponse }
			});
		}
	);

	deleteById = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const id = +req.params.id;

			const clz = await this.classesService.deleteById(id);

			if (!clz)
				return new AppError(
					HttpStatusCode.NOT_FOUND,
					ClassesMessageError.CLASS_NOT_EXISTS
				);

			const clzResponse: ResponseClassDto =
				classToResponseDtoConverter(clz);

			res.status(HttpStatusCode.OK).json({
				status: 'success',
				message: ClassesMessageSuccess.SUCCESS_DELETE_CLASS,
				data: { class: clzResponse }
			});
		}
	);
}
