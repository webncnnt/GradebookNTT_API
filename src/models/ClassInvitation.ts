import { DataTypes, Sequelize } from 'sequelize';

export const classInvitationDefiner = (database: Sequelize) => {
	database.define('ClassInvitation', {
		inviteCode: DataTypes.STRING, // inviteCode cua class tuong ung
		email: DataTypes.STRING
	});
};
