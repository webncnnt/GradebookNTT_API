import { Class } from '@src/models/Class';
import { User } from '@src/models/User';

export type CreateClassInput = {
	className: string;
	coverImage?: string;
	description?: string;
	expiredTime?: Date;
};

export type UpdateClassInput = Partial<CreateClassInput>;

export type UserOverviewDto = {
	id: number;
	avatar?: string;
	fullName: string;
};

export type ClassOverviewDto = {
	id: number;
	className: string;
	description?: string;
	inviteCode: string;
	coverImage?: string;
	createDate: Date;
	students?: UserOverviewDto[];
	teachers?: UserOverviewDto[];
	expiredTime?: Date;
};

export type ClassMembersOverviewDto = {
	id: number;
	className: string;
	students: UserOverviewDto[];
	teachers: UserOverviewDto[];
};

export const mapUserToUserOverviewDto = (u: User): UserOverviewDto => {
	const { id, fullname, avatar } = u;
	return { id, fullName: fullname, avatar: avatar || undefined };
};

export const mapUsersToUsersOverviewDto = (
	users: User[]
): UserOverviewDto[] => {
	return users.map(u => mapUserToUserOverviewDto(u));
};

export const mapClassToClassOverviewDto = (clazz: Class): ClassOverviewDto => {
	const students = clazz.members
		?.filter(m => m.role === 1)
		.map(m => mapUserToUserOverviewDto(m));

	const teachers = clazz.members
		?.filter(m => m.role === 0)
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
