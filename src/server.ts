import { QueryTypes } from 'sequelize';
import { config } from 'config';
import database from 'db';
import app from 'app';

database
	.sync()
	.then(() => {
		console.log('Sync successful');
		console.log(database.models);
		app.listen(config.PORT, () => {
			console.log(`Server is listening on port ${config.PORT}`);
		});
	})
	.catch(err => {
		console.log(err);
	});
