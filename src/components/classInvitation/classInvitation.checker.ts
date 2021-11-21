import { Class } from '@src/models/Class';
import { ClassInvitation } from '@src/models/ClassInvitation';
import { UserClass } from '@src/models/UserClass';
import { IllegalArgumentError, NotFoundError } from '@src/utils/appError';

export class ClassInvitationChecker {
	constructor(
		private readonly userClassRepository: typeof UserClass,
		private readonly classesRepository: typeof Class,
		private readonly classInvitationRepository: typeof ClassInvitation
	) {}

	async checkUserEmailMatchInvitationEmail(
		userEmail: string,
		invitationEmail: string
	) {
		if (userEmail !== invitationEmail) throw new IllegalArgumentError('');
	}

	async checkExistsInvitation(classId: number, role: number, email: string) {
		const isExist =
			this.classInvitationRepository.existsByClassIdAndEmailAndRole(
				classId,
				email,
				role
			);

		if (!isExist) throw new NotFoundError(`Cannot found any invitation`);
	}
}
