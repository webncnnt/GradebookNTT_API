import { Class } from '@src/models/Class';
import { User } from '@src/models/User';
import { IllegalArgumentError, NotFoundError } from '@src/utils/appError';
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
		console.log(createInput);

		if (createInput.password !== createInput.passwordConfirmation) {
			throw new IllegalArgumentError('Password confirmation must match');
		}

		const existsUser = await this.userRepository.findOne({
			where: { email: createInput.email }
		});

		console.log(existsUser);
		if (existsUser) throw new IllegalArgumentError('Email already exists');

		const adminUser = { ...createInput, role: 0 };
		const user = await this.userRepository.create(adminUser);

		return mapUserToUserOverviewDto(user);
	}

	// Users
	async findAndCountAllUsers(
		queryFilter: UsersQueryFilter
	): Promise<[UserOverviewDto[], number]> {
		const {
			page = 1,
			limit = 10,
			role = null,
			status = null
		} = queryFilter;

		const whereObj: any = {};
		role && (whereObj.role = role);
		status && (whereObj.status = status);

		const users = await this.userRepository.findAll({
			where: whereObj,
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
		const { page = 1, limit = 10 } = queryFilter;

		const classes = await this.classRepository.findAll({
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
