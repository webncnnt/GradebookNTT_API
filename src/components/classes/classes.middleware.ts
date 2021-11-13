import { RequestHandler } from 'express';
import { AppError } from '@src/utils/appError';
import { ClassesMessageError } from './classes.constant';
import { HttpStatusCode } from '@src/constant/httpStatusCode';

export const validateIdParamsExist: RequestHandler = (req, res, next) => {
	const id = +req.params.id;

	if (!id)
		return new AppError(
			HttpStatusCode.BAD_REQUEST,
			ClassesMessageError.INVALID_CLASS_ID
		);

	next();
};
