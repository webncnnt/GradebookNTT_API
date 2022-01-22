import { HttpStatusCode } from '@src/constant/httpStatusCode';
import { User } from '@src/models/User';
import { NotFoundError } from '@src/utils/appError';
import { catchAsyncRequestHandler } from '@src/utils/catchAsyncRequestHandler';
import { Request, Response, NextFunction } from 'express';
import {
	AdminsQueryFilter,
	ClassesQueryFilter,
	CreateAdminInput,
	UsersQueryFilter
} from './admin.dto';
import { AdminServices } from './admin.services';

export class AdminController {
	constructor(private readonly adminServices: AdminServices) {}

	getAllClasses = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const usersQueryFilter = this.transformClassesQueryFilter(
				req.query
			);

			const [classes, count] =
				await this.adminServices.findAndCountAllClasses(
					usersQueryFilter
				);

			res.header('X-Total-Count', count.toString());
			res.status(HttpStatusCode.OK).json({
				status: 'success',
				data: {
					classes
				}
			});
		}
	);

	getClassById = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const id = +req.params.id;

			if (!id) throw new NotFoundError('Class not found');

			const clz = await this.adminServices.findClassDetailById(id);

			res.status(HttpStatusCode.OK).json({
				status: 'success',
				data: clz
			});
		}
	);

	getAllUsers = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const usersQueryFilter = this.transformUsersQueryFilter(req.query);

			const [users, count] =
				await this.adminServices.findAndCountAllUsers(usersQueryFilter);

			res.header('X-Total-Count', count.toString());
			res.status(HttpStatusCode.OK).json({
				status: 'success',
				data: {
					users
				}
			});
		}
	);

	getUserById = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const id = +req.params.id;
			if (!id) throw new NotFoundError('User not found');

			const user = await this.adminServices.findUserDetailById(id);

			res.status(HttpStatusCode.OK).json({
				status: 'success',
				data: user
			});
		}
	);

	getAdminById = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const id = +req.params.id;
			if (!id) throw new NotFoundError('User not found');

			const admin = await this.adminServices.findUserDetailById(id);

			res.status(HttpStatusCode.OK).json({
				status: 'success',
				data: admin
			});
		}
	);

	blockUser = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const id = +req.params.id;
			if (!id) throw new NotFoundError('User not found');

			await this.adminServices.blockUserById(id);

			res.status(HttpStatusCode.OK).json({
				status: 'success'
			});
		}
	);

	blockUsers = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const ids = req.body.body as number[];

			if (!ids) throw new NotFoundError('Invalid ids');

			await this.adminServices.blockUserByIds(ids);

			res.status(HttpStatusCode.OK).json({
				status: 'success'
			});
		}
	);

	getAllAdmins = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const queryFilter = this.transformAdminsQueryFilter(req.query);

			const [admins, total] =
				await this.adminServices.findAndCountAllUsers(queryFilter);

			res.setHeader('X-Total-Count', total.toString());
			res.status(HttpStatusCode.OK).json({
				status: 'success',
				users: admins
			});
		}
	);

	createAdmin = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const createInput = req.body as CreateAdminInput;

			if (!createInput)
				throw new NotFoundError('Invalid create admin input');

			const adminUser = await this.adminServices.createAdmin(createInput);

			res.status(HttpStatusCode.CREATED).json({
				status: 'success',
				data: adminUser
			});
		}
	);

	transformUsersQueryFilter(query: any): UsersQueryFilter {
		const queryFilter = query as UsersQueryFilter;
		const { fullname, status } = query;

		if (status) queryFilter.status = status === 'blocked' ? true : false;
		if (fullname) queryFilter.name = fullname;
		query.role = 0;

		return queryFilter;
	}

	transformAdminsQueryFilter(query: any): AdminsQueryFilter {
		const queryFilter = query as UsersQueryFilter;

		queryFilter.page = query.page;
		queryFilter.limit = query.limit;
		queryFilter.status =
			query.status && (query.status === 'blocked' ? true : false);
		queryFilter.role = 1;

		return queryFilter;
	}

	transformClassesQueryFilter(query: any): ClassesQueryFilter {
		const queryFilter = query as ClassesQueryFilter;
		return queryFilter;
	}
}
