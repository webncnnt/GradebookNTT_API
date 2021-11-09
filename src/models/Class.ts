import sequelize from '@src/db/sequelize';
import { DataTypes } from 'sequelize';

export const Class = sequelize.define('Class', {
	clsName: DataTypes.STRING,
	coverImage: DataTypes.STRING,
	description: DataTypes.STRING,
	inviteCode: DataTypes.STRING,
	ownerId: DataTypes.INTEGER,
	status: DataTypes.BOOLEAN, // true: block
	expiredTime: DataTypes.DATE
});
