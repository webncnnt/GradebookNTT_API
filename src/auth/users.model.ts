import database from '@src/db';
import { User } from '@src/models/User';
import sequelize from 'sequelize';

const Op = sequelize.Op;

export const findByEmail = async (email: string) => {
	const strQuery = `select * from "Users" where email = '${email}'`;
	const result = await database.query(strQuery);

	return result[0][0];
};

export const createUser = async (
	fullname: string,
	email: string,
	password: string
) => {
	await User.create({
		fullname: fullname,
		email: email,
		password: password,
		role: 0,
		status: false
	});
	// const strQuery = `insert into "Users"(fullname, email, password, role, status)
	//  values ('${fullname}', '${email}', '${password}', 0, ${false})`;

	// await database.query(strQuery);

	return true;
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
