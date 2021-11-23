import { Class } from '@src/models/Class';
import { User } from '@src/models/User';
import { RoleUserInClass, UserClass } from '@src/models/UserClass';
import { UnauthorizedError } from '@src/utils/appError';
import { catchAsyncRequestHandler } from '@src/utils/catchAsyncRequestHandler';
import { NextFunction, Request, Response } from 'express';
import { ClassesChecker } from './classes.checker';

const classesChecker = new ClassesChecker(Class, User, UserClass);

export const protect = catchAsyncRequestHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const userId = req.user?.id;

		if (!userId)
			throw new UnauthorizedError(
				'You do not have permission to perform this action'
			);

		const classId = +req.params.id;
		const clazz = await Class.findByPk(classId);
		const owner = await clazz?.getOwner();

		if (owner?.id === userId) req.user?.roles.push('owner');

		const members = await UserClass.findAll({ where: { id: userId } });
		members?.forEach(m => {
			if (m.role === RoleUserInClass.STUDENT)
				req.user!.roles.push('student');

			if (m.role === RoleUserInClass.TEACHER)
				req.user!.roles.push('teacher');
		});

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
