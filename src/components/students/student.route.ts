import { findStudentsByClassId } from './student.model';
import {
	uploadStudent,
	inputGrade,
	getStudentsByClassId,
	markFinalizeGrade,
	updateGrade,
	getAllStudentGradeInClass
} from './student.controller';
import express from 'express';
import { ResponseError } from '@sendgrid/mail';

const studentRouter = express.Router();

studentRouter.post('/uploadStudents', async(req, res, next) => {
	const students = req.body.students;
	const classId = req.body.classId;
	
	const result = await uploadStudent(students, classId);
//	const result = await findStudentsByClassId(classId);
	res.status(200).json(result);
	
});

studentRouter.post('/inputGrade', (req, res, next) => {
	const studentId = req.body.studentId;
	const score = req.body.score;
	const assignmentId = req.body.assignmentId;

	inputGrade(studentId, parseFloat(score), parseInt(assignmentId))
		.then(result => {
			if (result == false) {
				res.status(400).json({
					message: 'Bad request'
				});
			} else {
				res.status(200).json({
					message: 'Input grade successfully'
				});
			}
		})
		.catch(err => {
			res.status(500).json({
				message: 'Error internal server!'
			});
		});
});

studentRouter.put('/updateGrade', (req, res, next) => {
	const studentId = req.body.studentId;
	const score = req.body.score;
	const assignmentId = req.body.assignmentId;
	updateGrade(studentId, parseFloat(score), parseInt(assignmentId))
		.then(result => {
			if (result == false) {
				res.status(400).json({
					message: 'bad request'
				});
			} else {
				res.status(200).json({
					message: 'Update grade successfully'
				});
			}
		})
		.catch(err => {
			res.status(500).json({
				message: 'Error internal server!'
			});
		});
});

studentRouter.get('/markFinalizedGrade/:assignmentId', (req, res, next) => {
	const assignmentId = req.params.assignmentId;
	markFinalizeGrade(parseInt(assignmentId))
		.then(result => {
			res.status(200).json({
				message: 'successfully.'
			});
		})
		.catch(err => {
			console.log(err);

			res.status(500).json({
				message: 'Internal server error!'
			});
		});
});

studentRouter.get('/getStudentsByClassId/:classId', (req, res, next) => {
	const classId = req.params.classId;
	getStudentsByClassId(parseInt(classId))
		.then(result => {
			res.status(200).json(result);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				message: 'internal server error.'
			});
		});
});

studentRouter.get('/:studentId/:classId', (req, res, next) => {
	const classId = req.params.classId;
	const studentId = req.params.studentId;

	getAllStudentGradeInClass(studentId, parseInt(classId))
		.then(result => {
			res.status(200).json(result);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				message: 'internal server error.'
			});
		});
});

export default studentRouter;
