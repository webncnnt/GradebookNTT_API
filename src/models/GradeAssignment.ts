import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@src/db/sequelize';
import { Class } from './Class';

interface GradeAssignmentAttributes {
	id: number;
	classId: number;
	title: string;
	score: number;
	pos: number;
}

interface GradeAssignmentCreationAttributes
	extends Optional<GradeAssignmentAttributes, 'id'> {}

export class GradeAssignment extends Model<
	GradeAssignmentAttributes,
	GradeAssignmentCreationAttributes
> {
	id!: number;
	classId!: number;
	title!: string;
	score!: number;
	pos!: number;
}

GradeAssignment.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		classId: {
			type: DataTypes.INTEGER
		},
		title: {
			type: DataTypes.STRING,
			validate: {
				min: { args: [2], msg: 'Grade assignment is too short' },
				max: { args: [20], msg: 'Grade Assignment is too long' }
			}
		},
		score: {
			type: DataTypes.DECIMAL
		},
		pos: {
			type: DataTypes.DOUBLE
		}
	},
	{ sequelize, tableName: 'gradeAssignments' }
);

Class.hasMany(GradeAssignment, { foreignKey: 'classId' });

GradeAssignment.belongsTo(Class, {
	foreignKey: 'classId',
	targetKey: 'id',
	as: 'class'
});
