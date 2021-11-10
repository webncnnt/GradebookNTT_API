import { ACCESS_TOKEN_LIFE, ACCESS_TOKEN_SECRET, generateToken } from './auth.method';
import { findByEmail } from './users.model';
import { createUser} from './users.model';

import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const register = async (
	fullname: string,
	email: string,
	password: string
) => {
	const user = await findByEmail(email);

	if (user[0].length == 0) {
		const hashPassword = bcrypt.hashSync(password, SALT_ROUNDS);
		await createUser(fullname, email, hashPassword);

		return true;
	} else {
		return false;
	}
};

export const login = async (email: string, password: string) => {
	const user = await findByEmail(email);

	if (user[0].length == 0) {
		return {
			message: 'Email or Password is not correct',
			status: 401
		};
	} else {
		const account: any = user[0][0];
		const hash = account.password;
		const isPasswordValid = bcrypt.compareSync(password, hash);

		if (isPasswordValid) {
			
			const accessToken = await generateToken(
				account,
				ACCESS_TOKEN_SECRET,
				ACCESS_TOKEN_LIFE
			);

			console.log(accessToken);
			
			return {
				message: 'Login successfully.',
				user: account,
				accessToken
			};
		} else {
			return {
				message: 'Email or Password is not correct',
				status: 401
			};
		}
	}
};
