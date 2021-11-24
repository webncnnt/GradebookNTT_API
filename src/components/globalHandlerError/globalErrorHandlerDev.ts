import { ErrorRequestHandler } from 'express';
import { NotFoundError, IllegalArgumentError } from '@src/utils/appError';
import { HttpStatusCode } from '@src/constant/httpStatusCode';

export const globalErrorHandlerDev: ErrorRequestHandler = (
	err: Error,
	req,
	res,
	next
) => {
	if (err instanceof NotFoundError) {
		res.status(HttpStatusCode.NOT_FOUND).json({
			message: err.message,
			stack: err.stack,
			error: err
		});
	}

	if (err instanceof IllegalArgumentError) {
		res.status(HttpStatusCode.BAD_REQUEST).json({
			message: err.message,
			stack: err.stack,
			error: err
		});
	}

	res.status(500).json({
		message: err.message,
		stack: err.stack,
		error: err
	});
};
