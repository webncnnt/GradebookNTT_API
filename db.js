const { config } = require('config');
const Sequelize = require('sequelize');

const database = new Sequelize({
	database: config.DB_NAME,
	username: config.DB_USERNAME,
	password: config.DB_PASSWORD,

	host: config.DB_HOST,
	port: config.DB_PORT,
	dialect: 'postgres'

	// dialectOptions: {
	//     ssl: {
	//       require: true,
	//       rejectUnauthorized: false // <<<<<<< YOU NEED THIS
	//     }
	//   },
});

database
	.authenticate()
	.then(() => console.log('Connect database successfully'))
	.catch(e => console.log(e));

module.exports = database;
