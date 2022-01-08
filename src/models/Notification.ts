import {
	BelongsToGetAssociationMixin,
	BelongsToSetAssociationMixin,
	DataTypes,
	Model,
	Optional
} from 'sequelize';
import sequelize from '@src/db/sequelize';
import { User } from './User';

interface NotificationAttributes {
	id: number;
	notifyMessage: string;
	receiverId: number; // is userId(teacher or student)
	senderId: number; //is userId(teacher or student)
}

interface NotificationCreationAttributes
	extends Optional<NotificationAttributes, 'id'> {}

export class Notification extends Model<
	NotificationAttributes,
	NotificationCreationAttributes
> {
	id!: number;
	notifyMessage!: string;
	receiverId!: number;
	senderId!: number;

	getReceiver!: BelongsToGetAssociationMixin<User>;
	setReceiver!: BelongsToSetAssociationMixin<User, number>;

	getSender!: BelongsToGetAssociationMixin<User>;
	setSender!: BelongsToSetAssociationMixin<User, number>;
}

Notification.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		notifyMessage: {
			type: DataTypes.STRING,
			allowNull: true
		},
		receiverId: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		senderId: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	},
	{ sequelize, tableName: 'notification' }
);

Notification.belongsTo(User, {
	foreignKey: 'receiverId',
	targetKey: 'id',
	as: 'receiver'
});

Notification.belongsTo(User, {
	foreignKey: 'senderId',
	targetKey: 'id',
	as: 'sender'
});
