import { DataTypes, Sequelize } from 'sequelize';

export const userClassDefiner = (database: Sequelize) => {
	database.define('UserClass', {
		userId: DataTypes.INTEGER,
		classId: DataTypes.INTEGER
	});
};
