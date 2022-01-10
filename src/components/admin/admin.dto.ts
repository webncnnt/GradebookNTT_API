type QueryFilter = {
	page?: number;
	limit?: number;
};

export type UsersQueryFilter = {
	role?: number;
	status?: boolean;
} & QueryFilter;

export type ClassesQueryFilter = {} & QueryFilter;

export type AdminsQueryFilter = { status?: boolean } & QueryFilter;

export type UserOverviewDto = {
	id: number;
	fullName: string;
	email: string;
	role: 'admin' | 'user';
	studentId?: string;
	avatar?: string;
	status?: 'active' | 'blocked';
	createdAt: Date;
};

export type UserDto = {
	id: number;
	fullName: string;
	email: string;
	role: 'admin' | 'user';
	studentId?: string;
	avatar?: string;
	status?: 'active' | 'blocked';
	dob?: Date;
	address?: string;
	numberPhone?: string;
	facebook?: string;
	createdAt: Date;
};

export type CreateAdminInput = {
	fullName: string;
	email: string;
	password: string;
	passwordConfirmation: string;
};
