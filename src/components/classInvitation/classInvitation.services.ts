import { ClassInvitation } from '@src/models/ClassInvitation';
import { IllegalArgumentError, NotFoundError } from '@src/utils/appError';
import {
	ClassInvitationAcceptedDto,
	ClassInvitationDto,
	ClassInvitationInput
} from '@components/classInvitation/classInvitation.dto';
import { Class, ClassStatus } from '@src/models/Class';
import { User } from '@src/models/User';
import { RoleUserInClass, UserClass } from '@src/models/UserClass';

export class ClassInvitationServices {
	constructor(
		private readonly classInvitationRepository: typeof ClassInvitation,
		private readonly userRepository: typeof User,
		private readonly classRepository: typeof Class
	) {}

	async findInvitationByInviteCode(
		inviteCode: string
	): Promise<ClassInvitationDto> {
		await this.checkExistsClassByInviteCode(inviteCode);
		const clazz = await Class.findClassByInviteCode(inviteCode);

		return {
			inviteCode,
			roleInvite: RoleUserInClass.STUDENT,
			classInformation: {
				id: clazz!.id,
				className: clazz!.clsName
			}
		};
	}

	async findInvitationByClassIdWithRoleAndEmail(
		inviteCode: string,
		role: number,
		email: string
	): Promise<ClassInvitationDto> {
		await this.checkExistsInvitationByClassInviteCodeAndRoleAndEmail(
			inviteCode,
			role,
			email
		);

		const clazz = await Class.findClassByInviteCode(inviteCode);

		return {
			inviteCode: clazz!.inviteCode,
			roleInvite: role!,
			classInformation: {
				id: clazz!.id,
				className: clazz!.clsName
			}
		};
	}

	async joinToClassByInviteCode(
		inviteCode: string,
		userId: number
	): Promise<ClassInvitationAcceptedDto> {
		await this.checkExistsClassByInviteCode(inviteCode);

		const clazz = await Class.findClassByInviteCode(inviteCode);

		await this.checkExistsUserInClass(
			userId,
			clazz!.id,
			RoleUserInClass.STUDENT
		);

		await clazz!.addMember(userId);

		return {
			id: clazz!.id,
			className: clazz!.clsName
		};
	}

	async joinToClassByAccessToken(
		inviteCode: string,
		role: number,
		userId: string
	): Promise<ClassInvitationAcceptedDto> {
		const user = await this.userRepository.findByPk(userId);
		const userEmail = user!.email;

		await this.checkExistsInvitationByClassInviteCodeAndRoleAndEmail(
			inviteCode,
			role,
			userEmail
		);

		const createdInvitation =
			await this.classInvitationRepository.findClassInvitationByClassInviteCodeAndRoleAndEmail(
				inviteCode,
				role,
				userEmail
			);

		this.checkUserEmailMatchInvitationEmail(
			userEmail,
			createdInvitation!.email
		);

		const clazz = await createdInvitation!.getClass();

		await this.checkExistsUserInClass(user!.id, clazz!.id, role);
		await clazz!.addMember(user!.id);
		await createdInvitation!.destroy();

		return {
			id: clazz!.id,
			className: clazz!.clsName
		};
	}

	private async checkExistsClassByInviteCode(inviteCode: string) {
		const clz = await Class.findClassByInviteCode(inviteCode);

		if (!clz)
			throw new NotFoundError('Cannot found any class with invite code');
	}

	private async checkUserEmailMatchInvitationEmail(
		userEmail: string,
		invitationEmail: string
	) {
		if (userEmail !== invitationEmail) throw new IllegalArgumentError('');
	}

	private async checkExistsUserInClass(
		userId: number,
		classId: number,
		role: number
	) {
		const count = await Class.countOccurOfMemberInClassWithUserIdAndRole(
			classId,
			userId,
			role
		);

		if (count > 0)
			throw new IllegalArgumentError(
				`User is already existed in class with role code: ${role}`
			);
	}

	private async checkExistsInvitationByClassInviteCodeAndRoleAndEmail(
		inviteCode: string,
		role: number,
		email: string
	) {
		const invitation =
			await this.classInvitationRepository.findClassInvitationByClassInviteCodeAndRoleAndEmail(
				inviteCode,
				role,
				email
			);

		if (!invitation) throw new NotFoundError(`Cannot found any invitation`);
	}
}
