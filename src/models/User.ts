import sequelize from '@src/db/sequelize';
import {
	DataTypes,
	HasManyAddAssociationMixin,
	HasManyCountAssociationsMixin,
	HasManyGetAssociationsMixin,
	HasManyRemoveAssociationMixin,
	Model
} from 'sequelize';
import { Class } from './Class';

export class User extends Model {
	id!: number;
	fullname!: string;
	email!: string;
	password!: string;
	role!: number;
	studentId!: number;
	avatar!: string | null;
	status!: boolean; // true: block
	dob!: Date | null;
	address!: string | null;
	numberPhone!: string | null;
	facebook!: string | null;

	static async findUserByEmail(email: string): Promise<User | null> {
		return await User.findOne({ where: { email } });
	}

	public countClasses!: HasManyCountAssociationsMixin;
	public getClasses!: HasManyGetAssociationsMixin<Class>;
	public addClass!: HasManyAddAssociationMixin<Class, number>;
	public removeClass!: HasManyRemoveAssociationMixin<Class, number>;
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		fullname: DataTypes.STRING,
		email: DataTypes.STRING,
		password: DataTypes.STRING,
		role: DataTypes.INTEGER,
		studentId: DataTypes.STRING,
		avatar: DataTypes.STRING,
		status: DataTypes.BOOLEAN, // true: block
		dob: DataTypes.DATE,
		address: DataTypes.STRING,
		numberPhone: DataTypes.STRING,
		facebook: DataTypes.STRING
	},
	{ sequelize, modelName: 'Users' }
);
