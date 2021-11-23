import { UserClass } from '@src/models/UserClass';
import { ClassMemberOverviewDto } from './classes.dto';

export const mapUserClassToClassMemberOverview = (
	userClass: UserClass
): ClassMemberOverviewDto => {
	return {
		classId: userClass.classId,
		userId: userClass.userId,
		joinDate: userClass.joinDate,
		profile: {
			id: userClass.userId,
			email: userClass.user.email,
			fullName: userClass.user.fullname,
			avatar: userClass.user.avatar || undefined
		}
	};
};
