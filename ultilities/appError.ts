export class AppError extends Error {
	isOperational: boolean;
	statusCode: number;
	message: string;

	constructor(isOperational: boolean, statusCode: number, message: string) {
		super();

		this.isOperational = isOperational;
		this.statusCode = statusCode;
		this.message = message;
	}
}
