import { NextFunction, Request, RequestHandler, Response } from 'express';
import { AppError } from './appError';

type AsyncRequestHandler = (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<AppError | void>;

export const catchAsyncRequestHandler = (
	fn: AsyncRequestHandler
): RequestHandler => {
	return (req, res, next) => {
		fn(req, res, next).catch(err => next(err));
	};
};
