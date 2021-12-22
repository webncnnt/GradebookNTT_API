import { Class } from '@src/models/Class';
import { GradeAssignment } from '@src/models/GradeAssignment';
import { Student } from '@src/models/Student';
import { StudentGrade } from '@src/models/StudentGrade';
import { Router } from 'express';
import { GradeController } from './grades.controller';
import { GradeServices } from './grades.services';

const router = Router();

const gradeServices = new GradeServices(
	GradeAssignment,
	Class,
	Student,
	StudentGrade
);
const gradeController = new GradeController(gradeServices);

router
	.route('/:classId/:assignmentId/:studentId')
	.get(gradeController.getStudentGrade)
	.patch(gradeController.updateStudentGrade)
	.post(gradeController.uploadStudentGrade);

router
	.route('/:classId/:assignmentId')
	.get(gradeController.getAssignmentGrade)
	.post(gradeController.uploadAssignmentGrade);

router
	.route('/:classId')
	.get(gradeController.getClassGrade)
	.post(gradeController.uploadClassGrade);

export default router;
