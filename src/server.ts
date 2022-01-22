import { config } from 'config';
import { connectDatabase } from 'db';
import app from 'app';
import { createDirectAdmin, register } from './auth/auth.controllers';

const initAdminUser = async () => {
	createDirectAdmin('SuperAdmin', '12345678', 'test@gmail.com')
		.then(() => console.log('Init admin successfully'))
		.catch(_ => console.log('Admin is already exists'));
};

connectDatabase(true, true).then(async () => {
	console.log('Setup database successful');

	await initAdminUser();

	app.listen(config.PORT, () => {
		console.log(`Server is listening on port ${config.PORT}`);
	});
});
