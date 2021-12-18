import {
	BelongsToGetAssociationMixin,
	BelongsToSetAssociationMixin,
	DataTypes,
	Model,
	Optional
} from 'sequelize';
import sequelize from '@src/db/sequelize';
import { User } from './User';
import { Class } from './Class';

interface StudentAttributes {
	id: number;
	studentId: string;
	classId: number;
	userId: number;
	fullName: string;
}

interface StudentCreationAttributes extends Optional<StudentAttributes, 'id'> {}

export class Student extends Model<
	StudentAttributes,
	StudentCreationAttributes
> {
	id!: number;
	classId!: number;
	studentId!: string;
	userId!: number;
	fullName!: string;

	getUser!: BelongsToGetAssociationMixin<User>;
	setUser!: BelongsToSetAssociationMixin<User, number>;

	getClass!: BelongsToGetAssociationMixin<Class>;
	setClass!: BelongsToSetAssociationMixin<Class, number>;
}

Student.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		classId: {
			type: DataTypes.INTEGER
		},
		studentId: {
			type: DataTypes.STRING
		},
		userId: {
			type: DataTypes.INTEGER
		},
		fullName: {
			type: DataTypes.STRING
		}
	},
	{ sequelize }
);

Student.belongsTo(Class, {
	foreignKey: 'classId',
	targetKey: 'id',
	as: 'class'
});
Student.belongsTo(User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
