import sequelize from '@src/db/sequelize';
import {
	BelongsToGetAssociationMixin,
	BelongsToSetAssociationMixin,
	DataTypes,
	Model,
	Optional
} from 'sequelize';
import { Class } from './Class';
import { RoleUserInClass } from './UserClass';

interface ClassInvitationAttributes {
	id: number;
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
	email!: string;
	role!: RoleUserInClass;

	getClass!: BelongsToGetAssociationMixin<Class>;
	setClass!: BelongsToSetAssociationMixin<Class, number>;

	static async findClassInvitationByClassInviteCodeAndRoleAndEmail(
		inviteCode: string,
		role: number,
		email: string
	): Promise<ClassInvitation | null> {
		return await ClassInvitation.findOne({
			include: { model: Class, as: 'class', where: { inviteCode } },
			where: { role, email }
		});
	}

	static async findClassInvitationByClassIdAndRoleAndEmail(
		id: number,
		role: number,
		email: string
	): Promise<ClassInvitation | null> {
		return await ClassInvitation.findOne({
			include: { model: Class, as: 'class', where: { id } },
			where: { role, email }
		});
	}
}

ClassInvitation.init(
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
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
