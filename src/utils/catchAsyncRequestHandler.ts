import { NextFunction, Request, RequestHandler, Response } from 'express';

type AsyncRequestHandler = (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<void>;

export const catchAsyncRequestHandler = (
	fn: AsyncRequestHandler
): RequestHandler => {
	return (req, res, next) => {
		fn(req, res, next).catch(err => next(err));
	};
};
