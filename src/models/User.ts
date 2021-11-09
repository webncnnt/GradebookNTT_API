import sequelize from '@src/db/sequelize';
import { DataTypes } from 'sequelize';

export const User = sequelize.define('User', {
	fullname: DataTypes.STRING,
	email: DataTypes.STRING,
	password: DataTypes.STRING,
	role: DataTypes.INTEGER,
	studentId: DataTypes.STRING,
	avatar: DataTypes.STRING,
	status: DataTypes.BOOLEAN // true: block
});
