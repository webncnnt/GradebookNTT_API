import { Class } from '@src/models/Class';
import { User } from '@src/models/User';
import { RoleUserInClass, UserClass } from '@src/models/UserClass';
import { IllegalArgumentError, NotFoundError } from '@src/utils/appError';
import { nanoid } from 'nanoid';
import { Op } from 'sequelize';
import { ClassesChecker } from './classes.checker';
import { ClassesMessageError, USER_CLASS_PER_PAGE } from './classes.constant';
import { ClassesCreator } from './classes.creator';
import {
	ClassOverviewDto,
	ClassStudentsOverviewDto,
	ClassTeachersOverviewDto,
	CreateClassInput,
	UpdateClassInput
} from './classes.dto';

export class ClassesService {
	constructor(
		private readonly classesRepository: typeof Class,
		private readonly usersRepository: typeof User,
		private readonly userClassesRepository: typeof UserClass,
		private readonly classesChecker: ClassesChecker,
		private readonly classesCreator: ClassesCreator
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
			ownerId,
			inviteCode
		});

		await this.userClassesRepository.create({
			classId: clz.id,
			userId: ownerId,
			role: RoleUserInClass.TEACHER
		});

		return this.classesCreator.createClassOverview(clz);
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
		const classOverviewsDto =
			this.classesCreator.createClassOverviews(classes);

		return [classOverviewsDto, count];
	}

	async findAllStudentOverviewsByClassId(
		classId: number
	): Promise<ClassStudentsOverviewDto> {
		await this.classesChecker.checkExistClassById(classId);
		return await this.classesCreator.createClassStudentOverviews(classId);
	}

	async findAllTeacherOverviewsByClassId(
		classId: number
	): Promise<ClassTeachersOverviewDto> {
		await this.classesChecker.checkExistClassById(classId);
		return await this.classesCreator.createClassTeacherOverviews(classId);
	}

	async findClassOverviewById(classId: number): Promise<ClassOverviewDto> {
		await this.classesChecker.checkExistClassById(classId);
		return await this.classesCreator.createClassOverviewById(classId);
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
		await this.classesChecker.checkExistsUserInClass(userId, classId, role);
		await this.userClassesRepository.destroy({
			where: { userId, classId, role }
		});
	}

	async removeTeachersByClassId(id: number, teacherIds: number[]) {
		await this.classesChecker.checkExistClassById(id);
		await this.userClassesRepository.destroy({
			where: { id: teacherIds, role: RoleUserInClass.TEACHER }
		});
	}

	async removeStudentsByClassId(id: number, studentIds: number[]) {
		await this.classesChecker.checkExistClassById(id);
		await this.userClassesRepository.destroy({
			where: { id: studentIds, role: RoleUserInClass.STUDENT }
		});
	}

	async deleteById(id: number): Promise<void> {
		await this.classesChecker.checkExistClassById(id);
		const clazz = await this.classesRepository.findByPk(id);
		await clazz!.destroy();
	}
}

function createInviteCode() {
	return nanoid(8);
}
