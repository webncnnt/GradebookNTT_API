// Now it merges with Express.Request
declare global {
	namespace Express {
		interface UserDetails {
			getId: () => number;
			getUsername: () => string;
			getPassword: () => string;
			getRoles: () => string[];
			isAccountBlock: () => boolean;
		}

		interface Request {
			user: UserDetails;
		}
	}
}

export {};
