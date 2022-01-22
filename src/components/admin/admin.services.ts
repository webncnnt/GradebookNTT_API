import { createDirectAdmin, register } from '@src/auth/auth.controllers';
import { Class } from '@src/models/Class';
import { User } from '@src/models/User';
import { IllegalArgumentError, NotFoundError } from '@src/utils/appError';
import { Op, Order } from 'sequelize';
import { ClassesChecker } from '../classes/classes.checker';
import { ClassesCreator } from '../classes/classes.creator';
import { ClassDetailDto, ClassOverviewDto } from '../classes/classes.dto';
import {
	ClassesQueryFilter,
	CreateAdminInput,
	UserDto,
	UserOverviewDto,
	UsersQueryFilter
} from './admin.dto';
import { mapUserToUserDto, mapUserToUserOverviewDto } from './admin.mapping';

export class AdminServices {
	constructor(
		private readonly userRepository: typeof User,
		private readonly classRepository: typeof Class,
		private readonly classChecker: ClassesChecker,
		private readonly classCreator: ClassesCreator
	) {}

	// Admin
	async createAdmin(createInput: CreateAdminInput): Promise<UserOverviewDto> {
		if (createInput.password !== createInput.passwordConfirmation) {
			throw new IllegalArgumentError('Password confirmation must match');
		}

		const existsUser = await this.userRepository.findOne({
			where: { email: createInput.email }
		});

		if (existsUser) throw new IllegalArgumentError('Email already exists');

		console.log(createInput);

		const user = await createDirectAdmin(
			createInput.fullName,
			createInput.password,
			createInput.email
		);

		return mapUserToUserOverviewDto(user!);
	}

	// Users
	async findAndCountAllUsers(
		queryFilter: UsersQueryFilter
	): Promise<[UserOverviewDto[], number]> {
		const {
			page = 1,
			limit = 10,
			role = null,
			status = null,
			email,
			name,
			order,
			sortBy
		} = queryFilter;

		const whereObj: any = {};

		if (role !== null) whereObj.role = role;
		if (status) whereObj.status = status;
		if (email) whereObj.email = { [Op.like]: `%${email.trim()}%` };
		if (name) whereObj.fullname = { [Op.like]: `%${name.trim()}%` };

		const sortObj: Order = [];
		const columnNames = {
			id: 'id',
			fullname: 'fullname',
			email: 'email',
			role: 'role',
			status: 'status',
			createdat: 'createdAt'
		};

		// @ts-ignore
		const normalizeSortBy = columnNames[sortBy?.toLowerCase()];
		if (order && normalizeSortBy) sortObj.push([normalizeSortBy, order]);

		const users = await this.userRepository.findAll({
			where: whereObj,
			order: sortObj,
			offset: (page - 1) * limit,
			limit
		});

		const usersDto = users.map(u => mapUserToUserOverviewDto(u));
		const count = await this.userRepository.count();

		return [usersDto, count];
	}

	async findUserDetailById(userId: number): Promise<UserDto> {
		const user = await this.userRepository.findByPk(userId);

		if (!user) {
			throw new NotFoundError('User not found');
		}

		return mapUserToUserDto(user);
	}

	async findAdminDetailById(userId: number): Promise<UserDto> {
		const user = await this.userRepository.findOne({
			where: {
				id: userId,
				role: 0
			}
		});

		if (!user) {
			throw new NotFoundError('Admin not found');
		}

		return mapUserToUserDto(user);
	}

	async blockUserById(userId: number): Promise<User> {
		const user = await this.userRepository.findByPk(userId);

		if (!user) {
			throw new NotFoundError('User not found');
		}

		user.status = true;
		await user.save();

		return user;
	}

	// Classes
	async findAndCountAllClasses(
		queryFilter: ClassesQueryFilter
	): Promise<[ClassOverviewDto[], number]> {
		const { page = 1, limit = 10, name, order, sortBy } = queryFilter;

		const whereObj: any = {};

		if (name) whereObj.clsName = { [Op.like]: `%${name.trim()}%` };

		const sortObj: Order = [];

		const columnNames = {
			id: 'id',
			classname: 'clsName',
			ownerid: 'ownerId',
			invitecode: 'inviteCode',
			status: 'status',
			createdat: 'createdAt',
			expiredtime: 'expiredTime'
		};

		// @ts-ignore
		const normalizeSortBy = columnNames[sortBy?.toLowerCase()];
		if (order && normalizeSortBy) sortObj.push([normalizeSortBy, order]);

		const classes = await this.classRepository.findAll({
			where: whereObj,
			order: sortObj,
			offset: (page - 1) * limit,
			limit
		});

		const classesOverview = this.classCreator.createClassOverviews(classes);
		const count = await this.classRepository.count();

		return [classesOverview, count];
	}

	async findClassDetailById(classId: number): Promise<ClassDetailDto> {
		await this.classChecker.checkExistClassById(classId);
		return await this.classCreator.createClassDetailById(classId);
	}
}
