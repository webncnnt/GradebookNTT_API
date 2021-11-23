import sgMail from '@sendgrid/mail';
import { config } from '@src/config';
import Handlebars from 'handlebars';
import fs from 'fs';

sgMail.setApiKey(config.SENDGRID_API_KEY);

export type EmailInvitationInfor = {
	to: {
		email: string;
	};
	from: {
		email: string;
		name: string;
		avatar: string;
	};
	className: string;
	inviteLink: string;
	role: 'student' | 'teacher';
};

type InvitationEmailData = {
	inviterEmail: string;
	inviterName: string;
	inviterAvatar: string;
	invitationLink: string;
	invitationClassName: string;
	role: 'student' | 'teacher';
};

export const renderInvitationTemplate = async (
	invitationEmailData: InvitationEmailData
): Promise<string> => {
	const {
		inviterEmail,
		inviterName,
		inviterAvatar,
		invitationLink,
		invitationClassName,
		role
	} = invitationEmailData;

	const urlTemplateFile =
		role === 'student'
			? './templates/studentInvitation.html'
			: './templates/studentInvitation.html';

	const html = fs.readFileSync(urlTemplateFile);
	const template = Handlebars.compile(html);

	const templateRendered = template({
		inviterEmail,
		inviterName,
		inviterAvatar,
		invitationLink,
		invitationClassName
	});

	return templateRendered;
};

export const sendInvitation = async (invitationInfor: EmailInvitationInfor) => {
	const {
		avatar: inviterAvatar,
		email: inviterEmail,
		name: inviterName
	} = invitationInfor.from;

	const { email: receiverEmail } = invitationInfor.to;

	const {
		className: invitationClassName,
		inviteLink: invitationLink,
		role
	} = invitationInfor;

	const subject =
		role === 'teacher'
			? `Lời mời cùng dạy lớp ${invitationClassName}`
			: 'a';

	const template = await renderInvitationTemplate({
		invitationClassName,
		invitationLink,
		inviterAvatar,
		inviterEmail,
		inviterName,
		role
	});

	const msg = {
		to: receiverEmail,
		from: inviterName,
		subject: subject,
		html: template
	};

	await sendEmail(msg);
};

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
