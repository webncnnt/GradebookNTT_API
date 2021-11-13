import sequelize from '@src/db/sequelize';
import { Model, Optional } from 'sequelize';
import { DataTypes } from 'sequelize';
import { User } from './User';

interface ClassAttributes {
	id: number;
	clsName: string;
	coverImage: string;
	description: string;
	inviteCode: string;
	ownerId: number;
	teachers: number[];
	status: boolean; // true: block
	createdDate: Date;
	expiredTime: Date;
}

interface ClassCreationAttributes
	extends Optional<
		ClassAttributes,
		| 'id'
		| 'status'
		| 'createdDate'
		| 'expiredTime'
		| 'coverImage'
		| 'description'
		| 'teachers'
	> {}

export class Class extends Model<ClassAttributes, ClassCreationAttributes> {
	id!: number;
	clsName!: string;
	coverImage!: string;
	description!: string;
	inviteCode!: string;
	ownerId!: number;
	status!: boolean; // true: block
	createdDate!: Date;
	teachers!: number[];
	expiredTime!: Date;
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
			allowNull: false
		},
		coverImage: {
			type: DataTypes.STRING,
			allowNull: true
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true
		},
		inviteCode: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		ownerId: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		teachers: {
			type: DataTypes.ARRAY(DataTypes.INTEGER),
			allowNull: true
		},
		status: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}, // true: block
		createdDate: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW
		},
		expiredTime: {
			type: DataTypes.DATE,
			allowNull: true
		}
	},
	{ tableName: 'classes', sequelize }
);

Class.belongsTo(User, { foreignKey: 'ownerId', targetKey: 'id' });
