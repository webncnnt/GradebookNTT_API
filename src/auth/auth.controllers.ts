import {
	ACCESS_TOKEN_LIFE,
	ACCESS_TOKEN_SECRET,
	generateToken
} from './auth.method';
import { findByEmail } from './users.model';
import { createUser } from './users.model';

import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const register = async (
	fullname: string,
	email: string,
	password: string
) => {
	const user = await findByEmail(email);

	if (user == null) {
		const hashPassword = bcrypt.hashSync(password, SALT_ROUNDS);
		await createUser(fullname, email, hashPassword);

		return true;
	} else {
		return false;
	}
};

export const login = async (email: string, password: string) => {
	const user: any = await findByEmail(email);

	if (user == null) {
		return {
			message: 'Email or Password is not correct',
			status: 401
		};
	} else {
		const hash = user.password;
		const isPasswordValid = bcrypt.compareSync(password, hash);

		if (isPasswordValid) {
			const accessToken = await generateToken(
				user,
				ACCESS_TOKEN_SECRET,
				ACCESS_TOKEN_LIFE
			);

			if (accessToken != null) {
				return {
					message: 'Login successfully.',
					user: user,
					accessToken
				};
			} else {
				return {
					message: 'Login successfully.',
					user: user
				};
			}
		} else {
			return {
				message: 'Email or Password is not correct',
				status: 401
			};
		}
	}
};
