import { ErrorRequestHandler } from 'express';
import { AppError } from '@src/utils/appError';

export const globalErrorHandlerProd: ErrorRequestHandler = (
	err: AppError,
	req,
	res
) => {
	if (err.isOperational) {
		return res.status(err.statusCode).json({
			message: err.message
		});
	}

	if (!err.isOperational) {
		return res.status(500).json({
			message: 'Something went wrong'
		});
	}
};
