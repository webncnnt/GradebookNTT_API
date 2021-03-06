import {
	ACCESS_TOKEN_LIFE,
	ACCESS_TOKEN_SECRET,
	verifyToken
} from './auth.method';
import { findByEmail } from './users.model';
import { verifyIdToken, decodeToken } from './auth.method';
import { config } from '@src/config';
import { User } from '@src/models/User';
import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '@src/utils/appError';

export const isAuth = async (req: Request, res: any, next: any) => {
	// Lấy access token từ header
	const accessTokenFromHeader = req.headers.authorization;
	const tokenId = req.headers.tokenidgg as string;

	if (!accessTokenFromHeader && !tokenId) {
		return res.status(401).json({
			message: "accessToken isn't valid!"
		});
	}

	if (accessTokenFromHeader != null) {
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
		const role = user.role === 0 ? 'user' : 'admin';

		req.user = {
			email: user.email,
			id: user.id,
			isBlock: false,
			roles: [role],
			avatar: user.avatar || undefined
		};

		return next();
	}

	if (tokenId != null) {
		const verified = await verifyIdToken(tokenId, config.CLIENT_ID);
		if (!verified) {
			return res.status(401).json({
				message: 'TokenId is invalid or expired!'
			});
		}
		const user = (await findByEmail(verified.payload.email)) as User;
		const role = user.role === 0 ? 'user' : 'admin';

		req.user = {
			email: user.email,
			id: user.id,
			isBlock: false,
			roles: [role],
			avatar: user.avatar || undefined
		};

		return next();
	}
};

export const restrictTo = (...roles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const hasPermission = req.user?.roles.some(role =>
			roles.includes(role)
		);

		if (hasPermission) next();

		if (!hasPermission)
			next(
				new UnauthorizedError(
					'You do not have permission to perform this action'
				)
			);
	};
};
export const getUserByToken = async (token: string) => {
	if (token == null) return null;

	const verified: any = decodeToken(token, ACCESS_TOKEN_SECRET);
	if (verified == null || verified == undefined) return null;

	return verified;
};
