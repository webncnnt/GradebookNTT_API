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

interface ClassInvitationAttributes {
	id: number;
	classId: number;
	email: string;
	role: RoleUserInClass;
}

interface ClassInvitationCreationAttributes
	extends Optional<ClassInvitationAttributes, 'id' | 'role' | 'classId'> {}

export class ClassInvitation extends Model<
	ClassInvitationAttributes,
	ClassInvitationCreationAttributes
> {
	id!: number;
	classId!: number;
	email!: string;
	role!: RoleUserInClass;

	getClass!: BelongsToGetAssociationMixin<Class>;
	setClass!: BelongsToSetAssociationMixin<Class, number>;

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
