import { ErrorRequestHandler } from 'express';
import { IllegalArgumentError, NotFoundError } from '@src/utils/appError';
import { HttpStatusCode } from '@src/constant/httpStatusCode';

export const globalErrorHandlerProd: ErrorRequestHandler = (
	err: Error,
	req,
	res,
	next
) => {
	console.log(err);

	if (err instanceof NotFoundError) {
		res.status(HttpStatusCode.NOT_FOUND).json({
			message: err.message
		});
		return;
	}

	if (err instanceof IllegalArgumentError) {
		res.status(HttpStatusCode.BAD_REQUEST).json({
			message: err.message
		});
		return;
	}

	res.status(500).json({
		message: 'Something went wrong'
	});
};
