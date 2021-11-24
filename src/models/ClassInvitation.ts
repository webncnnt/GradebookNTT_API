import sequelize from '@src/db/sequelize';
import { Class } from './Class';
import { RoleUserInClass } from './UserClass';
import {
	BelongsToGetAssociationMixin,
	BelongsToSetAssociationMixin,
	DataTypes,
	Model,
	Optional
} from 'sequelize';
import { User } from './User';

interface ClassInvitationAttributes {
	id: number;
	classId: number;
	inviterId: number;
	email: string;
	role: RoleUserInClass;
}

interface ClassInvitationCreationAttributes
	extends Optional<ClassInvitationAttributes, 'id' | 'role'> {}

export class ClassInvitation extends Model<
	ClassInvitationAttributes,
	ClassInvitationCreationAttributes
> {
	id!: number;
	classId!: number;
	inviterId!: number;
	email!: string;
	role!: RoleUserInClass;

	getClass!: BelongsToGetAssociationMixin<Class>;
	setClass!: BelongsToSetAssociationMixin<Class, number>;

	getInviter!: BelongsToGetAssociationMixin<User>;
	setInviter!: BelongsToSetAssociationMixin<User, number>;

	static async existsByClassIdAndEmailAndRole(
		classId: number,
		email: string,
		role: number
	): Promise<boolean> {
		const invitation = await ClassInvitation.findOne({
			where: { classId, email, role }
		});

		if (invitation) return true;
		return false;
	}
}

ClassInvitation.init(
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		classId: {
			type: DataTypes.INTEGER,
			references: { model: Class, key: 'id' }
		},
		inviterId: {
			type: DataTypes.INTEGER,
			references: { model: User, key: 'id' }
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false
		},
		role: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	},
	{ sequelize, modelName: 'class_invitations' }
);

Class.hasMany(ClassInvitation, { foreignKey: 'classId', as: 'invitations' });
ClassInvitation.belongsTo(Class, { foreignKey: 'classId', as: 'class' });

User.hasMany(ClassInvitation, { foreignKey: 'inviterId', as: 'invitations' });
ClassInvitation.belongsTo(User, { foreignKey: 'inviterId', as: 'inviter' });
