import { config } from '@src/config';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
	database: config.DB_NAME,
	username: config.DB_USERNAME,
	password: config.DB_PASSWORD,
	host: config.DB_HOST,
	port: config.DB_PORT,
	dialect: 'postgres',
	ssl: true
});

// dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false // <<<<<<< YOU NEED THIS
//     }
//   },

export default sequelize;
