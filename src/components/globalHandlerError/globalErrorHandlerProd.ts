import { ErrorRequestHandler } from 'express';
import { IllegalArgumentError, NotFoundError } from '@src/utils/appError';
import { HttpStatusCode } from '@src/constant/httpStatusCode';

export const globalErrorHandlerProd: ErrorRequestHandler = (
	err: Error,
	req,
	res,
	next
) => {
	if (err instanceof NotFoundError) {
		return res.status(HttpStatusCode.NOT_FOUND).json({
			message: err.message
		});
	}

	if (err instanceof IllegalArgumentError) {
		return res.status(HttpStatusCode.BAD_REQUEST).json({
			message: err.message
		});
	}

	return res.status(500).json({
		message: 'Something went wrong'
	});
};
