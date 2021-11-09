import { DataTypes, Sequelize } from 'sequelize';

export const classDefiner = (database: Sequelize) => {
	database.define('Class', {
		clsName: DataTypes.STRING,
		coverImage: DataTypes.STRING,
		description: DataTypes.STRING,
		inviteCode: DataTypes.STRING,
		ownerId: DataTypes.INTEGER,
		status: DataTypes.BOOLEAN, // true: block
		expiredTime: DataTypes.DATE
	});
};
