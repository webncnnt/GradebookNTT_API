import sequelize from '@src/db/sequelize';
import {
	BelongsToGetAssociationMixin,
	BelongsToSetAssociationMixin,
	HasManyAddAssociationMixin,
	HasManyCountAssociationsMixin,
	HasManyGetAssociationsMixin,
	HasManyHasAssociationMixin,
	HasManyRemoveAssociationMixin,
	HasManyRemoveAssociationsMixin,
	Model,
	Optional
} from 'sequelize';
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
	extends Optional<UserClassAttributes, 'id' | 'joinDate'> {}

export class UserClass extends Model<
	UserClassAttributes,
	UserClassCreationAttributes
> {
	id!: number;
	classId!: number;
	userId!: number;
	role!: RoleUserInClass;
	joinDate!: Date;

	user!: User;
	class!: Class;

	getUsers!: HasManyGetAssociationsMixin<User[]>;
	countUsers!: HasManyCountAssociationsMixin;
	hasUser!: HasManyHasAssociationMixin<User, number>;
	addUser!: HasManyAddAssociationMixin<User, number>;
	removeUser!: HasManyRemoveAssociationMixin<User, number>;
	removeUsers!: HasManyRemoveAssociationsMixin<User, number>;

	getUser!: BelongsToGetAssociationMixin<User>;
	setUser!: BelongsToSetAssociationMixin<User, number>;
	getClass!: BelongsToGetAssociationMixin<Class>;
	setClass!: BelongsToSetAssociationMixin<Class, number>;

	static async findTeacherUserClass(classId: number, userId: number) {
		return await this.scope('includeUser').findOne({
			where: { classId, userId, role: RoleUserInClass.TEACHER }
		});
	}

	static async findTeachersUserClassByClassId(classId: number) {
		return await this.scope('includeUser').findAll({
			where: { classId, role: RoleUserInClass.TEACHER }
		});
	}

	static async findStudentUserClass(classId: number, userId: number) {
		return await this.scope('includeUser').findOne({
			where: { classId, userId, role: RoleUserInClass.STUDENT }
		});
	}

	static async findStudentsUserClassByClassId(classId: number) {
		return await this.scope('includeUser').findAll({
			where: { classId, role: RoleUserInClass.STUDENT }
		});
	}

	static async countOccurOfMemberInClassWithUserIdAndRole(
		classId: number,
		userId: number,
		role: number
	): Promise<number> {
		return await this.count({ where: { classId, userId, role } });
	}

	static async findAllUserClasses(classId: number): Promise<UserClass[]> {
		return await this.findAll({ where: { classId } });
	}
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
	{
		sequelize,
		modelName: 'users_classes',
		scopes: {
			includeUser: {
				include: {
					model: User,
					as: 'user'
				}
			}
		},
		indexes: [
			{
				unique: true,
				fields: ['userId', 'classId', 'role']
			}
		]
	}
);

User.hasMany(UserClass, { foreignKey: 'userId', as: 'userClasses' });
UserClass.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Class.hasMany(UserClass, { foreignKey: 'classId', as: 'userClasses' });
UserClass.belongsTo(Class, { foreignKey: 'classId', as: 'class' });

User.belongsToMany(Class, {
	through: { model: UserClass, unique: false },
	as: 'classes',
	foreignKey: 'userId'
});

Class.belongsToMany(User, {
	through: { model: UserClass, unique: false },
	foreignKey: 'classId',
	as: 'members'
});
