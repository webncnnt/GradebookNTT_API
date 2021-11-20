import { config } from 'config';
import { ErrorRequestHandler } from 'express';
import { AppError } from '@src/utils/appError';
import { globalErrorHandlerDev } from './globalErrorHandlerDev';
import { globalErrorHandlerProd } from './globalErrorHandlerProd';

export const globalErrorHandler: ErrorRequestHandler = (
	err: Error,
	req,
	res,
	next
) => {
	if (config.NODE_ENV === 'production') {
		globalErrorHandlerProd(err, req, res, next);
	}

	return globalErrorHandlerDev(err, req, res, next);
};
