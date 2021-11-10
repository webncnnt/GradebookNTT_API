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

	if (user[0].length == 0) {
		const hashPassword = bcrypt.hashSync(password, SALT_ROUNDS);
		await createUser(fullname, email, hashPassword);

		return true;
	} else {
		return false;
	}
};
