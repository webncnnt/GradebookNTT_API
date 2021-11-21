import { Class, ClassStatus } from '@src/models/Class';
import { ClassInvitation } from '@src/models/ClassInvitation';
import { User } from '@src/models/User';
import { RoleUserInClass, UserClass } from '@src/models/UserClass';
import { IllegalArgumentError, NotFoundError } from '@src/utils/appError';
import { nanoid } from 'nanoid';
import { Op } from 'sequelize';
import { ClassesChecker } from './classes.checker';
import { ClassesMessageError, USER_CLASS_PER_PAGE } from './classes.constant';
import {
	ClassMembersOverviewDto,
	ClassOverviewDto,
	CreateClassInput,
	mapClassToClassOverviewDto,
	mapUsersToUsersOverviewDto,
	UpdateClassInput
} from './classes.dto';

export class ClassesService {
	constructor(
		private readonly classesRepository: typeof Class,
		private readonly usersRepository: typeof User,
		private readonly userClassesRepository: typeof UserClass,
		private readonly classesChecker: ClassesChecker
	) {}

	async create(
		ownerId: number,
		createClassInput: CreateClassInput
	): Promise<ClassOverviewDto> {
		const { className, coverImage, description, expiredTime } =
			createClassInput;

		const inviteCode = createInviteCode();

		const clz = await Class.create({
			clsName: className,
			coverImage,
			description,
			expiredTime,
			inviteCode
		});

		await clz.setOwner(ownerId);

		await this.userClassesRepository.create({
			classId: clz.id,
			userId: ownerId,
			role: RoleUserInClass.TEACHER
		});

		return mapClassToClassOverviewDto(clz);
	}

	async findAndCountAllClassOverviewsWithUserIdByPage(
		userId: number,
		page: number
	): Promise<[ClassOverviewDto[], number]> {
		const classes = await this.classesRepository.findAll({
			where: {
				[Op.or]: {
					ownerId: userId,
					'$members.id$': userId
				}
			},
			include: [
				{
					model: this.usersRepository,
					as: 'members',
					duplicating: false
				}
			],
			limit: USER_CLASS_PER_PAGE,
			offset: page - 1
		});

		const count = await this.classesRepository.count();

		const classOverviewsDto = classes.map(clz =>
			mapClassToClassOverviewDto(clz)
		);

		return [classOverviewsDto, count];
	}

	async findAllMemberOverviewsByClassId(
		classId: number
	): Promise<ClassMembersOverviewDto> {
		await this.classesChecker.checkExistClassById(classId);

		const clazz = await this.classesRepository.findByPk(classId);
		const members = await clazz!.getMembers();

		const teachers = members.filter(
			m => m.role === RoleUserInClass.TEACHER
		);

		const students = members.filter(
			m => m.role === RoleUserInClass.STUDENT
		);

		const teacherOverviewsDto = mapUsersToUsersOverviewDto(teachers);
		const studentOverviewsDto = mapUsersToUsersOverviewDto(students);

		return {
			id: classId,
			className: clazz!.clsName,
			students: studentOverviewsDto,
			teachers: teacherOverviewsDto
		};
	}

	async findClassOverviewById(classId: number): Promise<ClassOverviewDto> {
		await this.classesChecker.checkExistClassById(classId);
		const clazz = await this.classesRepository.findByPk(classId);
		return mapClassToClassOverviewDto(clazz!);
	}

	async updateClassById(
		id: number,
		updateClassDto: UpdateClassInput
	): Promise<void> {
		await this.classesChecker.checkExistClassById(id);

		const clazz = await this.classesRepository.findByPk(id);

		const { className, coverImage, description, expiredTime } =
			updateClassDto;

		clazz!.clsName = className || clazz!.clsName;
		clazz!.coverImage = coverImage || clazz!.clsName;
		clazz!.description = description || clazz!.description;
		clazz!.expiredTime = expiredTime || clazz!.expiredTime;

		await clazz!.save();
	}

	async leftClass(
		userId: number,
		classId: number,
		role: number
	): Promise<void> {
		await this.verifyUserExistsInClass(userId, classId, role);
		await this.userClassesRepository.destroy({
			where: { userId, classId, role }
		});
	}

	async removeMembersByClassId(
		id: number,
		userIds: number[],
		role: RoleUserInClass
	): Promise<void> {
		await this.classesChecker.checkExistClassById(id);

		const clazz = await this.classesRepository.findByPk(id);

		await this.userClassesRepository.destroy({
			where: { id: userIds, role }
		});
	}

	async deleteById(id: number): Promise<void> {
		await this.classesChecker.checkExistClassById(id);

		const clazz = await this.classesRepository.findByPk(id);
		clazz!.status = ClassStatus.DELETED;
		clazz!.deletedAt = new Date();

		await clazz!.save();
	}

	private async verifyUserExistsInClass(
		userId: number,
		classId: number,
		role: RoleUserInClass
	) {
		const clazz = await this.classesRepository.findByPk(classId);
		if (!clazz)
			throw new NotFoundError(ClassesMessageError.CLASS_NOT_EXISTS);

		const user = await this.usersRepository.findByPk(userId);
		if (!user) throw new NotFoundError('User is not existed');

		const userInClasses = await this.userClassesRepository.findAll({
			where: { userId, classId, role }
		});

		if (userInClasses.length >= 1)
			throw new IllegalArgumentError('User is already existed in class');
	}
}

function createInviteCode() {
	return nanoid(8);
}
