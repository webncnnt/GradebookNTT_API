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

type TeacherReviewStatus = 'NEW' | 'REJECTED' | 'APPROVED';
type StudentReviewStatus = 'PENDING' | 'REVIEWED';

interface ReviewAttributes {
	id: number;
	studentId: string;
	assignmentId: number;
	statusTeacher: TeacherReviewStatus;
	statusStudent: StudentReviewStatus;
	expectedScore: number;
	message: string;
}

interface ReviewCreationAttributes extends Optional<ReviewAttributes, 'id'> {}

export class Review extends Model<ReviewAttributes, ReviewCreationAttributes> {
	id!: number;
	studentId!: string;
	assignmentId!: number;
	statusTeacher!: TeacherReviewStatus;
	statusStudent!: StudentReviewStatus;
	expectedScore!: number;
	message!: string;

	getAssignment!: BelongsToGetAssociationMixin<GradeAssignment>;
	setAssignment!: BelongsToSetAssociationMixin<GradeAssignment, number>;
	getStudent!: BelongsToGetAssociationMixin<Student>;
	setStudent!: BelongsToSetAssociationMixin<Student, number>;
}

Review.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		studentId: {
			type: DataTypes.STRING,
			allowNull: false
		},
		assignmentId: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		statusTeacher: {
			type: DataTypes.STRING,
			allowNull: false
		},
		statusStudent: {
			type: DataTypes.STRING,
			allowNull: false
		},
		expectedScore: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		message: {
			type: DataTypes.STRING,
			allowNull: true
		}
	},
	{ sequelize, tableName: 'review' }
);

Review.belongsTo(GradeAssignment, {
	foreignKey: 'assignmentId',
	targetKey: 'id',
	as: 'assignment'
});

Review.belongsTo(Student, {
	foreignKey: 'studentId',
	targetKey: 'id',
	as: 'student'
});
