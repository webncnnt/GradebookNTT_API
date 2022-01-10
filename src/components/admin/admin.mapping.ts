import { User } from '@src/models/User';
import { UserDto, UserOverviewDto } from './admin.dto';

export const mapUserToUserOverviewDto = (user: User): UserOverviewDto => {
	return {
		id: user.id,
		fullName: user.fullname,
		email: user.email,
		role: user.role === 0 ? 'admin' : 'user',
		studentId: user.studentId || undefined,
		avatar: user.avatar || undefined,
		status: user.status === true ? 'blocked' : 'active',
		createdAt: user.createAt
	};
};

export const mapUserToUserDto = (user: User): UserDto => {
	return {
		id: user.id,
		fullName: user.fullname,
		email: user.email,
		role: user.role === 0 ? 'admin' : 'user',
		studentId: user.studentId || undefined,
		avatar: user.avatar || undefined,
		status: user.status === true ? 'blocked' : 'active',
		address: user.address || undefined,
		numberPhone: user.numberPhone || undefined,
		facebook: user.facebook || undefined,
		dob: user.dob || undefined,
		createdAt: user.createAt
	};
};
