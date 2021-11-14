export const ACCESS_TOKEN_SECRET = 'Access_Token_Secret';
export const ACCESS_TOKEN_LIFE = '30m';

const jwt = require('jsonwebtoken');
const promisify = require('util').promisify;
const sign = promisify(jwt.sign).bind(jwt);
const verify = promisify(jwt.verify).bind(jwt);

export const generateToken = async (
	payload: any,
	secretSignature: any,
	tokenLife: any
) => {
	try {
		return await sign(
			{
				payload
			},
			secretSignature,
			{
				algorithm: 'HS256',
				expiresIn: tokenLife
			}
		);
	} catch (error) {
		console.log(`Error in generate access token:  + ${error}`);
		return null;
	}
};

export const verifyToken = async (token: string, secretKey: string) => {
	try {
		return await verify(token, secretKey);
	} catch (error) {
		console.log(`Error in verify access token:  + ${error}`);
		return null;
	}
};

export const decodeToken = async (token: string, secretKey: string) => {
	try {
		return await verify(token, secretKey, {
			ignoreExpiration: true
		});
	} catch (error) {
		console.log(`Error in decode access token: ${error}`);
		return null;
	}
};
