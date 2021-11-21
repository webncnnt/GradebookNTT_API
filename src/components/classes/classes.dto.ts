import { Class } from '@src/models/Class';
import { User } from '@src/models/User';
import { RoleUserInClass } from '@src/models/UserClass';

export type CreateClassInput = {
	className: string;
	coverImage?: string;
	description?: string;
	expiredTime?: Date;
};

export type UpdateClassInput = Partial<CreateClassInput>;

export type MemberInClassOverview = {
	id: number;
	avatar?: string;
	fullName: string;
	joinDate: Date;
};

export type ClassOverviewDto = {
	id: number;
	className: string;
	description?: string;
	inviteCode: string;
	coverImage?: string;
	createDate: Date;
	students?: MemberInClassOverview[];
	teachers?: MemberInClassOverview[];
	expiredTime?: Date;
};

export type ClassMembersOverviewDto = {
	id: number;
	className: string;
	students: MemberInClassOverview[];
	teachers: MemberInClassOverview[];
};

// TODO: get joinDate
export const mapUserToUserOverviewDto = (u: User): MemberInClassOverview => {
	const { id, fullname, avatar } = u;

	console.log(u);

	return {
		id,
		fullName: fullname,
		avatar: avatar || undefined,
		joinDate: new Date()
	};
};

export const mapUsersToUsersOverviewDto = (
	users: User[]
): MemberInClassOverview[] => {
	return users.map(u => mapUserToUserOverviewDto(u));
};

export const mapClassToClassOverviewDto = (clazz: Class): ClassOverviewDto => {
	const students = clazz.members
		?.filter(m => m.role === RoleUserInClass.STUDENT)
		.map(m => mapUserToUserOverviewDto(m));

	const teachers = clazz.members
		?.filter(m => m.role === RoleUserInClass.TEACHER)
		.map(m => mapUserToUserOverviewDto(m));

	return {
		id: clazz.id,
		className: clazz.clsName,
		coverImage: clazz.coverImage || undefined,
		description: clazz.description || undefined,
		inviteCode: clazz.inviteCode,
		expiredTime: clazz.expiredTime || undefined,
		students,
		teachers,
		createDate: clazz.createdAt
	};
};
