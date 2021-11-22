
import {
	ACCESS_TOKEN_LIFE,
	ACCESS_TOKEN_SECRET,
	verifyToken
} from './auth.method';
import { findByEmail } from './users.model';
import { verifyIdToken } from './auth.method';
import { config } from '@src/config';

export const isAuth = async (req: any, res: any, next: any) => {
	// Lấy access token từ header
	const accessTokenFromHeader: string = req.headers.authorization;
	const tokenId: string = req.headers.tokenidgg;

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
		const user = await findByEmail(verified.payload.email);
		req.user = user;

		return next();
	}

	if(tokenId != null){
		const verified = await verifyIdToken(
			tokenId, config.CLIENT_ID
		);
		if (!verified) {
			return res.status(401).json({
				message: 'TokenId is invalid or expired!'
			});
		}
		const user = await findByEmail(verified.payload.email);
		req.user = user;

		return next();
	}
};
