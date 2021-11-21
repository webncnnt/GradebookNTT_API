export type ClassInvitationDto = {
	id?: number;
	inviteCode: string;
	roleInvite: number;
	email?: string;
	classInformation: {
		id: number;
		className: string;
	};
};

export type ClassInvitationAcceptedDto = {
	id: number;
	className: string;
};

export type ClassInvitationInput = {
	email: string;
	role: number;
};
