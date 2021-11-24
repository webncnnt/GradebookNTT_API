// Now it merges with Express.Request
declare global {
	namespace Express {
		interface UserDetails {
			id: number;
			email: string;
			roles: string[];
			isBlock: boolean;
			avatar?: string;
		}
		interface Request {
			user?: UserDetails;
		}
	}
}

export {};
