import { config } from 'config';
import { ErrorRequestHandler } from 'express';
import { AppError } from '@src/utils/appError';
import { globalErrorHandlerDev } from './globalErrorHandlerDev';
import { globalErrorHandlerProd } from './globalErrorHandlerProd';

export const globalErrorHandler: ErrorRequestHandler = (
	err: AppError,
	req,
	res
) => {
	if (config.NODE_ENV === 'development') {
		return globalErrorHandlerDev;
	}

	if (config.NODE_ENV === 'production') {
		return globalErrorHandlerProd;
	}
};
