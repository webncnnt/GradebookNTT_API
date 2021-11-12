export class AppError extends Error {
	isOperational: boolean;
	statusCode: number;
	message: string;

	constructor(statusCode: number, message: string) {
		super();

		this.isOperational = true;
		this.statusCode = statusCode;
		this.message = message;

		Error.captureStackTrace(this, this.constructor);
	}
}
