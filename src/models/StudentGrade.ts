import {
	BelongsToGetAssociationMixin,
	BelongsToSetAssociationMixin,
	DataTypes,
	Model,
	Optional
} from 'sequelize';
import sequelize from '@src/db/sequelize';
import { GradeAssignment } from './GradeAssignment';
import { Student } from './Student';

interface StudentGradeAttributes {
	id: number;
	studentId: string;
	gradeAssignmentId: number;
	score: number;
}

interface StudentGradeCreationAttributes
	extends Optional<StudentGradeAttributes, 'id'> {}

export class StudentGrade extends Model<
	StudentGradeAttributes,
	StudentGradeCreationAttributes
> {
	id!: number;
	studentId!: string;
	gradeAssignmentId!: number;
	score!: number;

	getStudent!: BelongsToGetAssociationMixin<Student>;
	setStudent!: BelongsToSetAssociationMixin<Student, number>;
	getGradeAssignment!: BelongsToGetAssociationMixin<GradeAssignment>;
	setGradeAssignment!: BelongsToSetAssociationMixin<GradeAssignment, number>;
}

StudentGrade.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		studentId: {
			type: DataTypes.STRING
		},
		gradeAssignmentId: {
			type: DataTypes.INTEGER
		},
		score: {
			type: DataTypes.FLOAT({ length: 5, decimals: 2 })
		}
	},
	{ sequelize }
);

StudentGrade.belongsTo(Student, {
	foreignKey: 'studentNumber',
	targetKey: 'id',
	as: 'student'
});

StudentGrade.belongsTo(GradeAssignment, {
	foreignKey: 'gradeAssignmentId',
	targetKey: 'id',
	as: 'gradeAssignment'
});
