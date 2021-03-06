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
import { config } from '@src/config';
import { ClassInvitationChecker } from './classInvitation.checker';
import { ClassesChecker } from '../classes/classes.checker';
import { EmailInvitationInfor } from '../mailServices/mail.service';

export class ClassInvitationServices {
	constructor(
		private readonly classInvitationRepository: typeof ClassInvitation,
		private readonly userRepository: typeof User,
		private readonly classRepository: typeof Class,
		private readonly classInvitationChecker: ClassInvitationChecker,
		private readonly classesChecker: ClassesChecker
	) {}

	async createInvitation(
		classId: number,
		inviterId: number,
		invitationInput: ClassInvitationInput
	): Promise<ClassInvitation> {
		await this.classesChecker.checkExistClassById(classId);

		const clazz = await this.classRepository.findByPk(classId);

		const invitation = await clazz!.findClassInvitationByRoleAndEmail(
			invitationInput.role,
			invitationInput.email
		);

		if (invitation) throw new IllegalArgumentError('Invitation is existed');

		const newInvitation = await this.classInvitationRepository.create({
			email: invitationInput.email,
			classId,
			inviterId,
			role: invitationInput.role
		});

		return newInvitation;
	}

	async deleteInvitationById(invitationId: number) {
		const invitation = await this.classInvitationRepository.findByPk(
			invitationId
		);

		await invitation?.destroy();
	}

	async findAllInvitationsByClassId(
		classId: number
	): Promise<ClassInvitationDto[]> {
		await this.classesChecker.checkExistClassById(classId);

		const clazz = await this.classRepository.findByPk(classId);
		const invitations = await clazz!.getInvitations();

		return invitations.map(ivt => ({
			id: ivt.id,
			email: ivt.email,
			inviteCode: clazz!.inviteCode,
			roleInvite: ivt.role,
			classInformation: { id: clazz!.id, className: clazz!.clsName }
		}));
	}

	async findInvitationByInviteCode(
		inviteCode: string
	): Promise<ClassInvitationDto> {
		await this.classesChecker.checkExistsClassByInviteCode(inviteCode);

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
		await this.classesChecker.checkExistsClassByInviteCode(inviteCode);

		const clazz = await this.classRepository.findClassByInviteCode(
			inviteCode
		);

		await this.classInvitationChecker.checkExistsInvitation(
			clazz!.id,
			role,
			email
		);

		const classInvitation = await clazz!.findClassInvitationByRoleAndEmail(
			role,
			email
		);

		return {
			inviteCode: clazz!.inviteCode,
			email: classInvitation!.email,
			roleInvite: classInvitation!.role,
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
		await this.classesChecker.checkExistsClassByInviteCode(inviteCode);
		const clazz = await Class.findClassByInviteCode(inviteCode);

		await this.classesChecker.checkExistsUserInClass(
			userId,
			clazz!.id,
			RoleUserInClass.STUDENT
		);

		const userClass = await UserClass.create({
			classId: clazz!.id,
			userId: userId,
			role: RoleUserInClass.STUDENT
		});

		await clazz!.addUserClass(userClass.id);

		return {
			id: clazz!.id,
			className: clazz!.clsName
		};
	}

	async joinToClassByAccessToken(
		inviteCode: string,
		role: number,
		userId: number
	): Promise<ClassInvitationAcceptedDto> {
		const user = await this.userRepository.findByPk(userId);
		const userEmail = user!.email;

		await this.classesChecker.checkExistsClassByInviteCode(inviteCode);
		const clazz = await Class.findClassByInviteCode(inviteCode);

		await this.classInvitationChecker.checkExistsInvitation(
			clazz!.id,
			role,
			userEmail
		);

		const createdInvitation =
			await clazz!.findClassInvitationByRoleAndEmail(role, userEmail);

		console.log(createdInvitation);
		await this.classesChecker.checkExistsUserInClass(
			user!.id,
			clazz!.id,
			role
		);

		const userClass = await UserClass.create({
			classId: clazz!.id,
			userId: user!.id,
			role
		});
		await clazz!.addUserClass(userClass);
		await createdInvitation!.destroy();

		return {
			id: clazz!.id,
			className: clazz!.clsName
		};
	}

	async getClassInvitationPublicLink(classId: number) {
		const clazz = await this.classRepository.findByPk(classId);

		if (!clazz) throw new NotFoundError('Class is not existed');

		return `${config.DOMAIN}/api/invites/${clazz.inviteCode}`;
	}

	async getClassInvitationLinkById(invitationId: number) {
		const invitation = await this.classInvitationRepository.findByPk(
			invitationId
		);

		if (!invitation) throw new NotFoundError(`Invitation is not exists`);

		const clazz = await invitation.getClass();

		return `${config.DOMAIN}/invites/access_token/${clazz.inviteCode}?role=${invitation.role}`;
	}

	async getClassInvitationLink(invitation: ClassInvitation) {
		const clazz = await invitation.getClass();

		return `${config.DOMAIN}/invites/access_token/${clazz.inviteCode}?role=${invitation.role}`;
	}

	async createInvitationEmailInfor(
		invitationId: number
	): Promise<EmailInvitationInfor> {
		const invitation = await this.classInvitationRepository.findByPk(
			invitationId
		);
		const sender = await invitation!.getInviter();
		const clazz = await invitation!.getClass();

		const inviteLink = await this.getClassInvitationLink(invitation!);
		const role = invitation!.role === 0 ? 'student' : 'teacher';

		return {
			from: {
				avatar: sender.avatar || undefined,
				email: sender.email,
				name: sender.fullname
			},
			to: {
				email: invitation!.email
			},
			className: clazz.clsName,
			role,
			inviteLink
		};
	}
}
