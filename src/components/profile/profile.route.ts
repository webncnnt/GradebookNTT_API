import express from 'express';
import { getProfile } from './profile.controller';
import { updateProfile } from './profile.controller';
const profileRouter = express.Router();

profileRouter.put('/:id', (req, res, next) => {
	const userId = req.params.id;
	const fullname = req.body.fullname;
	const studentId = req.body.studentId;
	const dob = req.body.dob.split('/').reverse().join('/');
	const address = req.body.address;
	const numberPhone = req.body.numberPhone;
	const avatar = req.body.avatar;
	const facebook = req.body.facebook;

	updateProfile(
		parseInt(userId),
		fullname,
		studentId,
		new Date(dob),
		address,
		numberPhone,
		avatar,
		facebook
	)
		.then(updatedUser => {
			if (updatedUser == null) {
				res.status(409).json({
					message: 'MSSV already exist!'
				});
			} else {
				res.json({
					message: 'Update successfully!',
					profile: updatedUser
				});
			}
		})
		.catch(err => {
			res.status(400).json({
				message: 'Bad request.'
			});
		});
});

profileRouter.get('/me', (req, res, next) => {
	getProfile(req.user!.id)
		.then(profile => {
			if (profile == null) {
				res.status(400).json({
					message: 'Bad request.'
				});
			} else {
				res.json({
					profile: profile
				});
			}
		})
		.catch(err => {
			res.status(400).json({
				message: 'Bad request.'
			});
		});
});

profileRouter.get('/:id', (req, res, next) => {
	const userId = req.params.id;

	getProfile(parseInt(userId))
		.then(profile => {
			if (profile == null) {
				res.status(400).json({
					message: 'Bad request.'
				});
			} else {
				res.json({
					profile: profile
				});
			}
		})
		.catch(err => {
			res.status(400).json({
				message: 'Bad request.'
			});
		});
});

export default profileRouter;
