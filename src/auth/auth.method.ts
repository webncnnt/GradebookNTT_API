export const ACCESS_TOKEN_SECRET = "Access_Token_Secret";
export const ACCESS_TOKEN_LIFE = "10m";

const jwt = require('jsonwebtoken')
const promisify = require('util').promisify;
const sign = promisify(jwt.sign).bind(jwt);
const verify = promisify(jwt.verify).bind(jwt);


export const generateToken = async (payload: any, secretSignature:any, tokenLife:any) => {
	try {
		return await sign(
			{
				payload,
			},
			secretSignature,
			{
				algorithm: 'HS256',
				expiresIn: tokenLife,
			},
		);
	} catch (error) {
		console.log(`Error in generate access token:  + ${error}`);
		return null;
	}
};
