const controller = {};
import User from '../../models/User';
import bcrypt from 'bcrypt';


const SALT_ROUNDS = 10;

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
			password: hashPassword,
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

controller.login = (email, password) => {
	console.log(email);
	console.log(password);
	return new Promise((resolve, reject) => {
		User.findOne({
			where: {
				email: email
			}
		})
			.then(user => {
				if(user == null){
					resolve({
						message: 'Email or Password is not correct'
					});
				}
				const hash = user.password;
				const isPasswordValid = bcrypt.compareSync(password, hash);
				console.log(isPasswordValid);
				if (user != null && isPasswordValid) {
					console.log('success');
					resolve({
						message: 'Login successfully.',
						email: email
					});
				} else {
					resolve({
						message: 'Email or Password is not correct'
					});
				}
			})
			.catch(err => {
				console.log('error at findOne auth.controller');
			});
	});
};

module.exports = controller;
