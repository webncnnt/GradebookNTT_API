import { access } from 'fs';
import {
	ACCESS_TOKEN_LIFE,
	ACCESS_TOKEN_SECRET,
	verifyToken
} from './auth.method';
import { findByEmail } from './users.model';
import { Request } from 'express';
import { User } from '@src/models/User';

export const isAuth = async (req: Request, res: any, next: any) => {
	// Lấy access token từ header
	const accessTokenFromHeader = req.headers.authorization;

	if (!accessTokenFromHeader) {
		return res.status(401).json({
			message: "accessToken isn't valid!"
		});
	}

	const verified = await verifyToken(
		accessTokenFromHeader,
		ACCESS_TOKEN_SECRET
	);

	if (!verified) {
		return res.status(401).json({
			message: 'accessToken is invalid or expired!'
		});
	}

	const user = (await findByEmail(verified.payload.email)) as User;
	const role = user.role === 0 ? 'admin' : 'user';

	req.user = {
		email: user.email,
		id: user.id,
		roles: [role],
		isBlock: user.status,
		avatar: user.avatar || undefined
	};

	return next();
};
