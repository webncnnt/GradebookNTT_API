import { Class, ClassStatus } from '@src/models/Class';
import { ClassInvitation } from '@src/models/ClassInvitation';
import { User } from '@src/models/User';
import { RoleUserInClass, UserClass } from '@src/models/UserClass';
import { IllegalArgumentError, NotFoundError } from '@src/utils/appError';
import { nanoid } from 'nanoid';
import { Op } from 'sequelize';
import { ClassInvitationInput } from '../classInvitation/classInvitation.dto';
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
		private readonly classInvitationsRepository: typeof ClassInvitation,
		private readonly userClassesRepository: typeof UserClass
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
			limit: 5,
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
		const clazz = await this.classesRepository.findByPk(classId);

		if (!clazz)
			throw new NotFoundError(ClassesMessageError.CLASS_NOT_EXISTS);

		const members = await clazz.getMembers();

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
			className: clazz.clsName,
			students: studentOverviewsDto,
			teachers: teacherOverviewsDto
		};
	}

	async updateClassById(
		id: number,
		updateClassDto: UpdateClassInput
	): Promise<void> {
		const clazz = await this.classesRepository.findByPk(id);

		if (!clazz)
			throw new NotFoundError(ClassesMessageError.CLASS_NOT_EXISTS);

		const { className, coverImage, description, expiredTime } =
			updateClassDto;

		clazz.clsName = className || clazz.clsName;
		clazz.coverImage = coverImage || clazz.clsName;
		clazz.description = description || clazz.description;
		clazz.expiredTime = expiredTime || clazz.expiredTime;

		await clazz.save();
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
		const clazz = await this.classesRepository.findByPk(id);

		if (!clazz)
			throw new NotFoundError(ClassesMessageError.CLASS_NOT_EXISTS);

		await this.userClassesRepository.destroy({
			where: { id: userIds, role }
		});
	}

	async deleteById(id: number): Promise<void> {
		const clazz = await this.classesRepository.findByPk(id);

		if (!clazz)
			throw new NotFoundError(ClassesMessageError.CLASS_NOT_EXISTS);

		clazz.status = ClassStatus.DELETED;
		clazz.deletedAt = new Date();

		await clazz.save();
	}

	async createInvitation(
		classId: number,
		invitationInput: ClassInvitationInput
	): Promise<void> {
		const invitation =
			await this.classInvitationsRepository.findClassInvitationByClassIdAndRoleAndEmail(
				classId,
				invitationInput.role,
				invitationInput.email
			);

		if (invitation) throw new IllegalArgumentError('Invitation is existed');

		const newInvitation = await this.classInvitationsRepository.create({
			email: invitationInput.email,
			role: invitationInput.role
		});

		await newInvitation.setClass(classId);
	}

	async deleteInvitationById(invitationId: number) {
		const invitation = await this.classInvitationsRepository.findByPk(
			invitationId
		);

		await invitation?.destroy();
	}

	async findAllInvitationsByClassId(
		classId: number
	): Promise<ClassInvitation[]> {
		const clazz = await this.classesRepository.findByPk(classId);

		if (!clazz) throw new NotFoundError('');

		return await clazz!.getInvitations();
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
