import { access } from "fs";
import { ACCESS_TOKEN_LIFE, ACCESS_TOKEN_SECRET, verifyToken  } from "./auth.method";
import { findByEmail } from "./users.model";


export const isAuth = async (req: any, res: any, next: any) => {
	// Lấy access token từ header
	const accessTokenFromHeader:string = req.headers.authorization;
   
	if (!accessTokenFromHeader) {
		return res.status(401).json({
            message: "accessToken isn't valid!",
            status: 401
        });
	}

	
	const verified = await verifyToken(
		accessTokenFromHeader,
		ACCESS_TOKEN_SECRET
	);
    
	if (!verified) {
		return res
			.status(401)
			.json({
                message: "accessToken is invalid or expired!",
                status: 401
            });
	}

	const user = await findByEmail(verified.payload.email);
	req.user = user;

	return next();
};