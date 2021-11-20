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
		return res.status(HttpStatusCode.NOT_FOUND).json({
			message: err.message,
			stack: err.stack,
			error: err
		});
	}

	if (err instanceof IllegalArgumentError) {
		return res.status(HttpStatusCode.BAD_REQUEST).json({
			message: err.message,
			stack: err.stack,
			error: err
		});
	}

	return res.status(500).json({
		message: err.message,
		stack: err.stack,
		error: err
	});
};
