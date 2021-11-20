import sequelize from '@src/db/sequelize';
import { Model, Optional } from 'sequelize';
import { DataTypes } from 'sequelize';
import { Class } from './Class';
import { User } from './User';

export enum RoleUserInClass {
	STUDENT = 0,
	TEACHER = 1
}

interface UserClassAttributes {
	id: number;
	classId: number;
	userId: number;
	role: RoleUserInClass;
	joinDate: Date;
}

interface UserClassCreationAttributes
	extends Optional<UserClassAttributes, 'id' | 'joinDate' | 'role'> {}

export class UserClass extends Model<
	UserClassAttributes,
	UserClassCreationAttributes
> {
	id!: number;
	role!: RoleUserInClass;
	joinDate!: Date;
}

UserClass.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		classId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Class,
				key: 'id'
			}
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: 'id'
			}
		},
		role: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		joinDate: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW
		}
	},
	{ sequelize, modelName: 'users_classes' }
);

User.belongsToMany(Class, {
	through: UserClass,
	as: 'classes',
	foreignKey: 'userId'
});

Class.belongsToMany(User, {
	through: UserClass,
	foreignKey: 'classId',
	as: 'members'
});
