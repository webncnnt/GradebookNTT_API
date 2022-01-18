import { config } from './../config/index';
import { sendEmail } from './../components/mailServices/mail.service';
import {
	ACCESS_TOKEN_LIFE,
	ACCESS_TOKEN_SECRET,
	decodeToken,
	generateToken,
	verifyToken
} from './auth.method';
import { findByEmail, findUserById } from './users.model';
import { createUser } from './users.model';

import bcrypt from 'bcrypt';
const randomstring = require('randomstring');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;

export const register = async (
	fullname: string,
	email: string,
	password: string
) => {
	const user = await findByEmail(email);

	if (user == null) {
		const token = jwt.sign(
			{ fullname, email, password },
			ACCESS_TOKEN_SECRET,
			{ expiresIn: '2m' }
		);
		const msg = {
			to: email,
			from: { email: 'classroom@gradebook.codes' },
			subject: `Account activation Link`,
			html: `
			<h2>Please click on given link to activate you account</h2>
			<a href = '${config.DOMAIN}/api/auth/activate/${token}'>Click at here to activate account</a>`
		};

		await sendEmail(msg);
		// const hashPassword = bcrypt.hashSync(password, SALT_ROUNDS);
		// await createUser(fullname, email, hashPassword);

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

export const resetPassword = async (email: string) => {
	const user: any = await findByEmail(email);
	if (user == null) {
		return false;
	} else {
		const newPass = randomstring.generate({
			length: 5,
			charset: 'alphabetic'
		});
		const msg = {
			to: email,
			from: { email: 'classroom@gradebook.codes' },
			subject: `Password Reset`,
			html: `
			<h3>You are receiving this because you (or someone else) have requested the reset of the password for your account.</h3>
			<h4>New password: ${newPass}</h4>
			<p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
		};

		await user.update({
			password: bcrypt.hashSync(newPass, SALT_ROUNDS)
		});

		await sendEmail(msg);
		return true;
	}
};

export const activateAccount = async (token: string) => {
	const verify = verifyToken(token, ACCESS_TOKEN_SECRET);

	if (verify != null && verify != undefined) {
		const user: any = await decodeToken(token, ACCESS_TOKEN_SECRET);

		if (user == null || user == undefined) return false;
		else {
			const isExistEmail = await findByEmail(user.email);
			if (isExistEmail) return false;
			else {
				const hashPassword = bcrypt.hashSync(
					user.password,
					SALT_ROUNDS
				);
				await createUser(user.fullname, user.email, hashPassword);
				return true;
			}
		}
	} else {
		return false;
	}
};

export const createDirectAdmin = async (
	fullname: string,
	password: string,
	email: string
) => {
	const hashPassword = bcrypt.hashSync(password, SALT_ROUNDS);
	const user = await createUser(fullname, email, hashPassword, 1);
	return user;
};
