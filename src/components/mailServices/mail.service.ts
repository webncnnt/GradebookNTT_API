import sgMail from '@sendgrid/mail';
import { config } from '@src/config';


sgMail.setApiKey(config.SENDGRID_API_KEY);

export type EmailInvitationInfor = {
	to: {
		email: string;
		name: string;
	};
	from: {
		email: string;
		name: string;
	};
	class: {
		id: number;
		className: string;
	};
	inviteLink: string;
};

export const sendTeacherInvitation = async (
	invitationInfor: EmailInvitationInfor
) => {};

export const sendStudentInvitation = async (
	invitationInfor: EmailInvitationInfor
) => {};

export const sendConfirmRegistation = async () => {};

export const sendEmail = async (msg: sgMail.MailDataRequired) => {
	const res = await sgMail.send(msg);

	if (
		res[0].statusCode === 200 ||
		res[0].statusCode === 201 ||
		res[0].statusCode === 202
	)
		return true;
	else {
		return false;
	}
};