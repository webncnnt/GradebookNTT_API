import { Class } from '@src/models/Class';
import { User } from '@src/models/User';
import { RoleUserInClass, UserClass } from '@src/models/UserClass';
import { IllegalArgumentError, NotFoundError } from '@src/utils/appError';
import { ClassesMessageError } from './classes.constant';

export class ClassesChecker {
	constructor(
		private readonly classesRepository: typeof Class,
		private readonly userRepository: typeof User,
		private readonly userClassRepository: typeof UserClass
	) {}

	async checkExistClassById(id: number) {
		const isExist = await this.classesRepository.existByClassId(id);
		if (!isExist) throw new NotFoundError('Class is not existed');
	}

	async checkExistsClassByInviteCode(inviteCode: string) {
		const clz = await this.classesRepository.findClassByInviteCode(
			inviteCode
		);

		if (!clz)
			throw new NotFoundError(
				ClassesMessageError.CLASS_NOT_EXISTS_WITH_INVITE_CODE
			);
	}

	async checkExistsUserInClass(
		userId: number,
		classId: number,
		role: number
	) {
		const count =
			await this.userClassRepository.countOccurOfMemberInClassWithUserIdAndRole(
				classId,
				userId,
				role
			);

		if (count > 0)
			throw new IllegalArgumentError(
				`User is already existed in class with role code: ${role}`
			);
	}

	private async verifyUserExistsInClass(
		userId: number,
		classId: number,
		role: RoleUserInClass
	) {
		const clazz = await this.classesRepository.findByPk(classId);
		if (!clazz)
			throw new NotFoundError(ClassesMessageError.CLASS_NOT_EXISTS);

		const user = await this.userRepository.findByPk(userId);
		if (!user) throw new NotFoundError('User is not existed');

		const userInClasses = await this.userRepository.findAll({
			where: { userId, classId, role }
		});

		if (userInClasses.length >= 1)
			throw new IllegalArgumentError('User is already existed in class');
	}
}
