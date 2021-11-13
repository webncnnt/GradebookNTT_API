import { findUserById } from './../../auth/users.model';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const getProfile = async (userId: number) => {
	const profile = await findUserById(userId);

	return profile;
};

export const updateProfile = async (
	userId: number,
	fullname: string,
	studentId: string,
	dob: Date,
	address: string,
	numberPhone: string,
	avatar: string,
	facebook: string
) => {
	const user: any = await findUserById(userId);

	await user.update({
		fullname: fullname,
		studentId: studentId,
		dob: dob,
		address: address,
		numberPhone: numberPhone,
		avatar: avatar,
		facebook: facebook
	});

	return {
		user: await findUserById(userId)
	};
};
