import { findStudentByStudentId } from './../students/student.model';
import { findUserIdByStudentId } from '@src/auth/users.model';
import {
	findUserById,
	findUserByStudentIdAndUserId
} from './../../auth/users.model';

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

	if (studentId != null || studentId != "" || studentId != undefined) {
		const isExist = await findUserByStudentIdAndUserId(userId, studentId);

		if (isExist != null) {
			return null;
		}
	}
	await user.update({
		fullname: fullname,
		studentId: studentId,
		dob: dob,
		address: address,
		numberPhone: numberPhone,
		avatar: avatar,
		facebook: facebook
	});

	//update student table with userId
	if(studentId != null || studentId != "" || studentId != undefined){
		const student: any = await findStudentByStudentId(studentId);
		if(student != null || student != undefined){
			student.update({
				userId: userId
			})
		}
	}
	
	return {
		user: await findUserById(userId)
	};
};
