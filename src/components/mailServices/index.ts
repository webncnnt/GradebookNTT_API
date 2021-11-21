import { Router } from 'express';
import { sendStudentInvitation, sendTeacherInvitation, sendEmail, EmailInvitationInfor } from "./mail.service";
const emailRouter = Router();



emailRouter.post('/sendInvitation', (req, res, next) => {
	const receiverName = req.body.receiverName;
	const email = req.body.email;

	let msg = {
		to: email, // Change to your recipient
		from: 'huynhthinhi206@gmail.com', // Change to your verified sender
		subject: 'Class Invitation',
		html: `<h3>You are invited to join the class at the following link</h3> <a href='hfhd'>Click the link to join</a>`
	};

	// let a: EmailInvitationInfor = {
	// 	to: {
	// 		email: email,
	// 		name: receiverName,
	// 	},
	// 	from: {
	// 		email: 'huynhthinhi206@gmail.com',
	// 		name: 'HTN'
	// 	},
	// 	class: {
	// 		id: 1,
	// 		className: 'ClassRoom'
	// 	},
	// 	inviteLink: 'string'
	// };

	sendEmail(msg)
		.then(result => {
			res.json({
				message: 'Send the invitation successfully.'
			});
		})
		.catch(err => {
			console.error(err.response.body);
		});
});

export default emailRouter;
