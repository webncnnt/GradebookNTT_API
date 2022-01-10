export type CreateClassInput = {
	className: string;
	coverImage?: string;
	description?: string;
	expiredTime?: Date;
};

export type UpdateClassInput = Partial<CreateClassInput>;

export type UserOverviewDto = {
	id: number;
	email: string;
	avatar?: string;
	fullName: string;
};

export type ClassMemberOverviewDto = {
	classId: number;
	userId: number;
	joinDate: Date;
	profile: UserOverviewDto;
};

export type ClassStudentsOverviewDto = {
	students: ClassMemberOverviewDto[];
};

export type ClassTeachersOverviewDto = {
	teachers: ClassMemberOverviewDto[];
};

export type ClassOverviewDto = {
	id: number;
	className: string;
	ownerId: number;
	description?: string;
	inviteCode: string;
	coverImage?: string;
	createDate: Date;
	expiredTime?: Date;
};

export type ClassDetailDto = {
	id: number;
	className: string;
	ownerId: number;
	description?: string;
	inviteCode: string;
	coverImage?: string;
	createDate: Date;
	expiredTime?: Date;
	totalMembers: number;
	numberOfStudents: number;
	numberOfTeachers: number;
};
