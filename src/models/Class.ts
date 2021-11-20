import sequelize from '@src/db/sequelize';
import {
	Association,
	BelongsToGetAssociationMixin,
	BelongsToManyAddAssociationsMixin,
	BelongsToManyGetAssociationsMixin,
	BelongsToManySetAssociationsMixin,
	BelongsToManyHasAssociationMixin,
	BelongsToManyRemoveAssociationMixin,
	HasManyGetAssociationsMixin,
	BelongsToManyRemoveAssociationsMixin,
	HasManyAddAssociationMixin,
	HasManyRemoveAssociationMixin,
	BelongsToCreateAssociationMixin
} from 'sequelize';
import { BelongsToSetAssociationMixin } from 'sequelize';
import { HasManySetAssociationsMixin } from 'sequelize';

import { Model, Optional } from 'sequelize';
import { DataTypes } from 'sequelize';
import { ClassInvitation } from './ClassInvitation';
import { User } from './User';
import { RoleUserInClass } from './UserClass';

export enum ClassStatus {
	BLOCK = 0,
	ACTIVE = 1,
	DELETED = 2
}

interface ClassAttributes {
	id: number;
	clsName: string;
	inviteCode: string;
	ownerId: number;
	coverImage: string | null;
	description: string | null;
	status: ClassStatus; // true: block
	expiredTime: Date | null;
	deletedAt: Date | null;
}

interface ClassCreationAttributes
	extends Optional<
		ClassAttributes,
		| 'id'
		| 'inviteCode'
		| 'ownerId'
		| 'status'
		| 'expiredTime'
		| 'coverImage'
		| 'description'
		| 'deletedAt'
	> {}

export class Class extends Model<ClassAttributes, ClassCreationAttributes> {
	id!: number;
	clsName!: string;
	inviteCode!: string;
	coverImage!: string | null;
	description!: string | null;
	status!: ClassStatus;
	expiredTime!: Date | null;
	createdAt!: Date;
	updatedAt!: Date;
	deletedAt!: Date;

	readonly members?: User[];

	getOwner!: BelongsToGetAssociationMixin<User>;
	setOwner!: BelongsToSetAssociationMixin<User, number>;

	getMembers!: BelongsToManyGetAssociationsMixin<User>;
	setMembers!: BelongsToManySetAssociationsMixin<User, number>;
	addMembers!: BelongsToManyAddAssociationsMixin<User, number>;
	removeMembers!: BelongsToManyRemoveAssociationsMixin<User, number>;

	addMember!: BelongsToManyRemoveAssociationMixin<User, number>;
	removeMember!: BelongsToManyRemoveAssociationMixin<User, number>;
	hasMember!: BelongsToManyHasAssociationMixin<User, number>;

	getInvitations!: HasManyGetAssociationsMixin<ClassInvitation>;
	setInvitations!: HasManySetAssociationsMixin<ClassInvitation, number>;
	addInvitation!: HasManyAddAssociationMixin<ClassInvitation, number>;
	removeInvitation!: HasManyRemoveAssociationMixin<ClassInvitation, number>;

	static async findAllMembersInClassByUserId(
		classId: number,
		userId: number
	) {
		const clz = await Class.findByPk(classId);

		if (!clz) return null;

		return await clz.getMembers({ where: { id: userId } });
	}

	static async findClassByInviteCode(
		inviteCode: string
	): Promise<Class | null> {
		return await Class.findOne({ where: { inviteCode } });
	}

	static async findAllClassesByOwnerId(
		ownerId: number,
		offset?: number,
		limit?: number
	): Promise<Class[] | null> {
		return await Class.findAll({
			include: { model: User, as: 'owner', where: { id: ownerId } },
			offset: offset,
			limit
		});
	}

	static async countOccurOfMemberInClassWithUserIdAndRole(
		classId: number,
		userId: number,
		role: number
	): Promise<number> {
		return await Class.count({
			include: {
				model: User,
				as: 'members',
				where: { userId, classId, role }
			}
		});
	}
}

Class.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		clsName: {
			type: new DataTypes.STRING(128),
			allowNull: false,
			validate: {
				min: { args: [3], msg: 'Your class name is too short' },
				max: {
					args: [128],
					msg: 'Your class name length must less than 128 characters'
				}
			}
		},
		ownerId: {
			type: DataTypes.INTEGER,
			references: {
				model: User,
				key: 'id'
			}
		},
		inviteCode: { type: DataTypes.STRING, allowNull: false, unique: true },
		coverImage: {
			type: DataTypes.STRING,
			allowNull: true
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: ClassStatus.ACTIVE
		},
		expiredTime: {
			type: DataTypes.DATE,
			allowNull: true
		},
		deletedAt: {
			type: DataTypes.DATE,
			allowNull: true
		}
	},
	{ tableName: 'classes', sequelize }
);

Class.belongsTo(User, { foreignKey: 'ownerId', targetKey: 'id', as: 'owner' });
