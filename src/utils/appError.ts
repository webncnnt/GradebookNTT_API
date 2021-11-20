export class AppError extends Error {
	isOperational: boolean;
	message: string;

	constructor(message: string) {
		super();

		this.isOperational = true;
		this.message = message;

		Error.captureStackTrace(this, this.constructor);
	}
}

export class NotFoundError extends AppError {
	constructor(message: string) {
		super(message);
	}
}

export class IllegalArgumentError extends AppError {
	constructor(message: string) {
		super(message);
	}
}

export class UnauthorizedError extends AppError {
	constructor(message: string) {
		super(message);
	}
}
