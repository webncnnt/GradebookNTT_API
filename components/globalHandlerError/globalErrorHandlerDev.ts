import { ErrorRequestHandler } from 'express';
import { AppError } from 'ultilities/appError';

export const globalErrorHandlerDev: ErrorRequestHandler = (
	err: AppError,
	req,
	res
) => {
	return res.status(err.statusCode).json({
		message: err.message,
		stack: err.stack,
		error: err
	});
};
