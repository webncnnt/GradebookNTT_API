import {
	BelongsToGetAssociationMixin,
	BelongsToSetAssociationMixin,
	DataTypes,
	Model,
	Optional
} from 'sequelize';
import sequelize from '@src/db/sequelize';
import { User } from './User';

interface StudentAttributes {
	id: number;
	studentId: number;
	userId: number;
	fullName: string;
}

interface StudentCreationAttributes extends Optional<StudentAttributes, 'id'> {}

export class Student extends Model<
	StudentAttributes,
	StudentCreationAttributes
> {
	id!: number;
	studentId!: number;
	userId!: number;
	fullName!: string;

	getUser!: BelongsToGetAssociationMixin<User>;
	setUser!: BelongsToSetAssociationMixin<User, number>;
}

Student.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		studentId: {
			type: DataTypes.INTEGER
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

Student.belongsTo(User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
