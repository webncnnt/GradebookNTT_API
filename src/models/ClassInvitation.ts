import sequelize from '@src/db/sequelize';
import { DataTypes } from 'sequelize';

export const ClassInvitation = sequelize.define('ClassInvitation', {
	inviteCode: DataTypes.STRING, // inviteCode cua class tuong ung
	email: DataTypes.STRING
});
