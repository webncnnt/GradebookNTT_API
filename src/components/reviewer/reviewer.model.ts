import { StudentGrade } from '@src/models/StudentGrade';
import { findGradeStudentByStudentIdAndAssignId } from '../students/grade.model';
import { Review } from '@src/models/Review';
import db from '@src/db';
export const gradeDetailOfAStudent = async (studentId: string) => {
	const query = `select  GA.score as scaleGrade, SG.score, GA.title from "StudentGrades" as SG, "gradeAssignments" as GA where SG."gradeAssignmentId" = GA."id" and SG."studentId" = '${studentId}'`;
	const result = await db.query(query);

	if (result != null) return result[0];
	return result;
};

export const addReview = async (
	studentId: string,
	assignmentId: number,
	expectedScore: number,
	message: string
) => {
	const gradeStudent = await findGradeStudentByStudentIdAndAssignId(
		studentId,
		assignmentId
	);

	if (gradeStudent == null) return false;


  await Review.create({
    studentId: studentId,
    assignmentId: assignmentId,
    expectedScore: expectedScore,
    message: message,
    statusStudent: 'PENDING',
    statusTeacher: 'NEW'
  })

	return true;
};

export const findReviewById =async (id: number) => {
	const review = await Review.findOne({
		where:{
			id: id
		}
	})

	return review;
}

export const findReviewByStudentIdAndAssignmentId = async (studentId: string, assignId: number) =>{
	const review = await Review.findOne({
		where:{
			studentId: studentId,
			assignmentId: assignId
		}
	})

	return review;
}