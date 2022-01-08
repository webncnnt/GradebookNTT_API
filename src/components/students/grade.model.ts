import { StudentGrade } from '@src/models/StudentGrade';
import { GradeAssignment } from '@src/models/GradeAssignment';

export const saveStudentgrade = (
	studentId: string,
	score: number,
	assignmentId: number
) => {
	StudentGrade.create({
		studentId: studentId,
		score: score,
		gradeAssignmentId: assignmentId
	});
};

export const findGradeStudentByStudentIdAndAssignId = async (
	studentId: string,
	assignmentId: number
) => {
	const result = await StudentGrade.findOne({
		where: {
			studentId: studentId,
			gradeAssignmentId: assignmentId
		}
	});

	return result;
};

export const updateGradeStudent = async (
	studentId: string,
	score: number,
	assignmentId: number
) => {
	const gradeStudent = await findGradeStudentByStudentIdAndAssignId(
		studentId,
		assignmentId
	);
	gradeStudent?.update({
		score: score
	});
};

export const findAllGradeStudentByClassId = async (
	classId: number,
	studentId: string
) => {
	const gradeAssignmentsInClass = await GradeAssignment.findAll({
		where: {
			classId
		}
	});

	const studentGradesInClass = await StudentGrade.findAll({
		where: {
			gradeAssignmentId: gradeAssignmentsInClass.map(g => g.id),
			studentId
		}
	});

	return studentGradesInClass;
};
