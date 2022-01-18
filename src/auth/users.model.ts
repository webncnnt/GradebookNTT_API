import { Student } from './../models/Student';
import database from '@src/db';
import { User } from '@src/models/User';
import sequelize from 'sequelize';

const Op = sequelize.Op;

export const findByEmail = async (email: string) => {
	const user = User.findOne({
		where: {
			email: email
		}
	});
	// const strQuery = `select * from "Users" where email = '${email}'`;
	// const result = await database.query(strQuery);

	// return result[0][0];
	return user;
};

export const createUser = async (
	fullname: string,
	email: string,
	password: string,
	role?: number
) => {
	const user = await findByEmail(email);
	if (user == null) {
		await User.create({
			fullname: fullname,
			email: email,
			password: password,
			role: role ? role : 0,
			status: false
		});
	}

	return await findByEmail(email);
};

export const findUserById = async (userId: number) => {
	const user = await User.findOne({
		where: {
			id: userId
		}
	});

	return user;
};

export const findUserByStudentIdAndUserId = async (
	userId: number,
	studentId: string
) => {
	const user = await User.findOne({
		where: {
			studentId: studentId,
			id: {
				[Op.ne]: userId
			}
		}
	});

	return user;
};

export const findUserIdByStudentId = async (studentId: string) => {
	const user = await User.findOne({
		where: {
			studentId: studentId
		}
	});
	if (user == null || user == undefined) return null;
	return user?.id;
};

export const findFullNameByStudentId = async (studentid: string) => {
	const user: any = await User.findOne({
		where: {
			studentId: studentid
		}
	});

	if (user != null && user != undefined) {
		return user.fullname;
	} else {
		return null;
	}
};

export const findUserByStudentId = async (studentid: string) => {
	const user: any = await User.findOne({
		where: {
			studentId: studentid
		}
	});

	return user;
};
