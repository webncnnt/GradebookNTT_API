import { config } from '@src/config';
import { Sequelize } from 'sequelize';
import { classDefiner } from '@src/models/Class';
import { classInvitationDefiner } from '@src/models/ClassInvitation';
import { userDefiner } from '@src/models/User';
import { userClassDefiner } from '@src/models/UserClass';

const database = new Sequelize({
	database: config.DB_NAME,
	username: config.DB_USERNAME,
	password: config.DB_PASSWORD,
	host: config.DB_HOST,
	port: config.DB_PORT,
	dialect: 'postgres'
});

// dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false // <<<<<<< YOU NEED THIS
//     }
//   },

classDefiner(database);
classInvitationDefiner(database);
userDefiner(database);
userClassDefiner(database);

database
	.authenticate()
	.then(() => console.log('Connect database successfully'))
	.catch(e => console.log(e));

export default database;
