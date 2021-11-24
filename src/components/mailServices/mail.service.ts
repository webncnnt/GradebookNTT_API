import sgMail from '@sendgrid/mail';
import { config } from '@src/config';
import Handlebars from 'handlebars';
import fs from 'fs';

sgMail.setApiKey(config.SENDGRID_API_KEY);

const GRADEBOOK_LOGO =
	'https://res.cloudinary.com/dcm0ibm0b/image/upload/v1637742041/email/gradebookLogo_pvtwpz.png';

const DEFAULT_SENDER_AVATAR =
	'https://res.cloudinary.com/dcm0ibm0b/image/upload/v1637742041/email/download_mkwwa0.png';

export type EmailInvitationInfor = {
	to: {
		email: string;
	};
	from: {
		email: string;
		name: string;
		avatar?: string;
	};
	className: string;
	inviteLink: string;
	role: 'student' | 'teacher';
};

type InvitationEmailData = {
	inviterEmail: string;
	inviterName: string;
	inviterAvatar?: string;
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
		inviterAvatar = DEFAULT_SENDER_AVATAR,
		invitationLink,
		invitationClassName,
		role
	} = invitationEmailData;

	const urlTemplateFile =
		role === 'student'
			? `${__dirname}/templates/studentInvitation.html`
			: `${__dirname}/templates/teacherInvitation.html`;

	const html = fs.readFileSync(urlTemplateFile).toString();
	const template = Handlebars.compile(html);

	const templateRendered = template({
		inviterEmail,
		inviterName,
		inviterAvatar,
		invitationLink,
		invitationClassName,
		logo: GRADEBOOK_LOGO
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
			? `Lời mời cùng dạy lớp: "${invitationClassName}"`
			: `Lời mời tham gia lớp học: "${invitationClassName}"`;

	const template = await renderInvitationTemplate({
		invitationClassName,
		invitationLink,
		inviterAvatar,
		inviterEmail,
		inviterName,
		role
	});

	const msg: sgMail.MailDataRequired = {
		to: receiverEmail,
		from: { email: 'classroom@gradebook.codes', name: inviterName },
		subject,
		html: template
	};

	return await sendEmail(msg);
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
