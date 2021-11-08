const controller = {};
import User  from '../../models/User';
import bcrypt from 'bcrypt';

const  SALT_ROUNDS = 10;

controller.register = (fullname, email, password) => {
	return new Promise((resolve, reject) => {
		User.findOne({
			where: {
				email: email
			}
		})
			.then(result => {
				if (result != null) {
					resolve({
						message: 'Email already exists'
					});
				}
			})
			.catch(err => {
				console.log('error at findOne auth.controller');
			});

		const hashPassword = bcrypt.hashSync(password, SALT_ROUNDS);

		User.create({
			fullname: fullname,
			email: email,
			password: password,
			role: 0,
			status: false
		})
			.then(result => {
				resolve(result);
			})
			.catch(err => {
				console.log('error at create auth.controller');
			});
	});
};

module.exports = controller;
