import sequelize from '@src/db/sequelize';
import { DataTypes } from 'sequelize';

export const UserClass = sequelize.define('UserClass', {
	userId: DataTypes.INTEGER,
	classId: DataTypes.INTEGER
});
