import { Class } from '@src/models/Class';
import { User } from '@src/models/User';
import { RoleUserInClass, UserClass } from '@src/models/UserClass';
import { NotFoundError, UnauthorizedError } from '@src/utils/appError';
import { catchAsyncRequestHandler } from '@src/utils/catchAsyncRequestHandler';
import { NextFunction, Request, Response } from 'express';
import { ClassesChecker } from './classes.checker';
import { ClassesMessageError } from './classes.constant';

const classesChecker = new ClassesChecker(Class, User, UserClass);

export const protect = catchAsyncRequestHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const userId = req.user?.id;

		if (!userId)
			throw new UnauthorizedError(
				'You do not have permission to perform this action'
			);

		const classId = +req.params.id;
		await classesChecker.checkExistClassById(classId);

		const clz = await Class.findByPk(classId);
		const roles: string[] = [];

		if (clz!.ownerId === userId) {
			roles.push('owner');
		}

		const members = await clz!.getUserClasses({
			where: { userId }
		});

		members.forEach(m => {
			if (m.role === RoleUserInClass.STUDENT) roles.push('student');
			if (m.role === RoleUserInClass.TEACHER) roles.push('teacher');
		});

		if (roles.length === 0)
			throw new NotFoundError(ClassesMessageError.CLASS_NOT_EXISTS);

		req.user!.roles = roles;

		next();
	}
);

export const restrictTo = (...roles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const hasPermission = req.user?.roles.some(role =>
			roles.includes(role)
		);

		if (hasPermission) next();

		if (!hasPermission)
			next(
				new UnauthorizedError(
					'You do not have permission to perform this action'
				)
			);
	};
};

export const verifyExistsClass = catchAsyncRequestHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const classId = +req.params.id;
		await classesChecker.checkExistClassById(classId);
		next();
	}
);

export default { restrictTo, protect, verifyExistsClass };
