import { sendEmail } from './../components/mailServices/mail.service';
import {
	ACCESS_TOKEN_LIFE,
	ACCESS_TOKEN_SECRET,
	generateToken
} from './auth.method';
import { findByEmail, findUserById } from './users.model';
import { createUser } from './users.model';

import bcrypt from 'bcrypt';
const randomstring = require('randomstring')

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
		return null;
		// return {
		// 	message: 'Email or Password is not correct',
		// 	status: 401
		// };
	} else {
		const hash = user.password;
		const isPasswordValid = bcrypt.compareSync(password, hash);

		console.log(isPasswordValid);
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
			// return {
			// 	message: 'Email or Password is not correct',
			// 	status: 401
			// };
			return null;
		}
	}
};

export const changePassWord = async (
	userId: number,
	oldPass: string,
	newPws: string
) => {
	const user: any = await findUserById(userId);
	const hash = user.password;

	const isPasswordValid = bcrypt.compareSync(oldPass, hash);

	if (isPasswordValid) {
		const hashPassword = bcrypt.hashSync(newPws, SALT_ROUNDS);

		if (user != null) {
			await user.update({
				password: hashPassword
			});

			return true;
		}
	}

	return false;
};

export const resetPassword = async(email: string)=>{
	const user: any = await findByEmail(email);
	if(user == null){
		return false;
	}
	else{
		const newPass = randomstring.generate({
			length: 5,
			charset: 'alphabetic'
		  });
		  const msg = {
			to: email,
			from: { email: 'huynhthinhi206@gmail.com'},
			subject: `Password Reset`,
			html: `
			<h3>You are receiving this because you (or someone else) have requested the reset of the password for your account.</h3>
			<h4>New password: ${newPass}</h4>
			<p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
		};

		await user.update({
			password:  bcrypt.hashSync(newPass, SALT_ROUNDS)
		})

		await sendEmail(msg);
		return true;
	}
}