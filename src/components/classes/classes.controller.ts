import { catchAsyncRequestHandler } from '@src/utils/catchAsyncRequestHandler';
import { AppError } from '@src/utils/appError';

import { ClassesService } from './classes.services';
import { ClassesMessageError } from './classes.constant';
import {
	classToResponseDtoConverter,
	CreateClassDto,
	ResponseClassDto,
	ResponseClassesDto
} from './classes.dto';

import { HttpStatusCode } from '@src/constant/httpStatusCode';
import { AuthorizeMessageError } from '@src/constant/authorizeError';
import { NextFunction, Request, Response } from 'express';
import { inject } from 'tsyringe';

export class ClassesController {
	constructor(
		@inject('classesService')
		private readonly classesService: ClassesService
	) {}

	create = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const createClassDto = req.body as CreateClassDto;

			if (!createClassDto)
				throw new AppError(
					HttpStatusCode.BAD_REQUEST,
					ClassesMessageError.NOT_ENOUGH_INFOR_CREATE_CLASS
				);

			const ownerId = req.user.getId();

			if (!ownerId)
				throw new AppError(
					HttpStatusCode.UNAUTHORIZED,
					AuthorizeMessageError.UNAUTHORIZED
				);

			const clz = await this.classesService.create(
				ownerId,
				createClassDto
			);

			const clzResponse = classToResponseDtoConverter(clz);

			res.status(HttpStatusCode.OK).json(clzResponse);
		}
	);

	getAllActiveClasses = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const classes = await this.classesService.getAllClasses();

			const classesResponse: ResponseClassDto[] = classes.map(clz =>
				classToResponseDtoConverter(clz)
			);

			const classesResponseDto: ResponseClassesDto = {
				length: classesResponse.length,
				classes: classesResponse
			};

			res.status(HttpStatusCode.OK).json(classesResponseDto);
		}
	);

	getClassById = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const id = +req.params.id;

			if (!id)
				throw new AppError(
					HttpStatusCode.BAD_REQUEST,
					ClassesMessageError.INVALID_CLASS_ID
				);

			const clz = await this.classesService.getClassById(id);

			if (!clz)
				throw new AppError(
					HttpStatusCode.NOT_FOUND,
					ClassesMessageError.CLASS_NOT_EXISTS
				);
		}
	);
}
