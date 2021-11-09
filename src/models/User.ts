import { DataTypes, Sequelize } from 'sequelize';

export const userDefiner = (database: Sequelize) => {
	database.define('User', {
		fullname: DataTypes.STRING,
		email: DataTypes.STRING,
		password: DataTypes.STRING,
		role: DataTypes.INTEGER,
		studentId: DataTypes.STRING,
		avatar: DataTypes.STRING,
		status: DataTypes.BOOLEAN // true: block
	});
};
