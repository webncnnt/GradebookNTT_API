import { HttpStatusCode } from '@src/constant/httpStatusCode';
import { IllegalArgumentError } from '@src/utils/appError';
import { catchAsyncRequestHandler } from '@src/utils/catchAsyncRequestHandler';
import { NextFunction, Request, Response } from 'express';
import {
	AssignmentGradeInput,
	ClassGradeInput,
	StudentGradeInput,
	UpdateStudentGradeInput
} from './grades.dto';
import { GradeServices } from './grades.services';

export class GradeController {
	constructor(private readonly gradeServices: GradeServices) {}

	uploadStudentGrade = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const assignmentId = +req.params.assignmentId;
			const studentId = req.params.studentId;
			const gradeInput = req.body as StudentGradeInput;

			if (!gradeInput)
				throw new IllegalArgumentError('invalid student grade data');

			const studentGrade = await this.gradeServices.createStudentGrade(
				studentId,
				assignmentId,
				gradeInput
			);

			res.status(HttpStatusCode.OK).json({
				data: studentGrade
			});
		}
	);

	uploadAssignmentGrade = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const assignmentId = +req.params.assignmentId;
			const gradeInput = req.body as AssignmentGradeInput;

			if (!gradeInput)
				throw new IllegalArgumentError('invalid assignment grade data');

			await this.gradeServices.deleteAssignmentGrade(assignmentId);

			const assignmentGrade =
				await this.gradeServices.createAssignmentGrade(
					assignmentId,
					gradeInput
				);

			res.status(HttpStatusCode.OK).json({
				data: assignmentGrade
			});
		}
	);

	uploadClassGrade = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const classId = +req.params.classId;
			const gradeInput = req.body as ClassGradeInput;

			if (!gradeInput)
				throw new IllegalArgumentError('invalid class grade data');

			await this.gradeServices.deleteClassGrade(classId);

			const assignmentGrade = await this.gradeServices.createClassGrade(
				gradeInput
			);

			res.status(HttpStatusCode.OK).json({
				data: assignmentGrade
			});
		}
	);

	updateStudentGrade = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const assignmentId = +req.params.assignmentId;
			const studentId = req.params.studentId;
			const updateGradeInput = req.body as UpdateStudentGradeInput;

			const studentGrade = await this.gradeServices.updateStudentGrade(
				studentId,
				assignmentId,
				updateGradeInput
			);

			res.status(HttpStatusCode.OK).json({
				data: studentGrade
			});
		}
	);

	getStudentGrade = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const assignmentId = +req.params.assignmentId;
			const studentId = req.params.studentId;

			const studentGrade = await this.gradeServices.findStudentGrade(
				studentId,
				assignmentId
			);

			res.status(HttpStatusCode.OK).json({
				data: studentGrade
			});
		}
	);

	getAssignmentGrade = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const assignmentId = +req.params.assignmentId;

			const assignmentGrade =
				await this.gradeServices.findAssignmentGradeByAssignmentId(
					assignmentId
				);

			res.status(HttpStatusCode.OK).json({
				data: assignmentGrade
			});
		}
	);

	getClassGrade = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const classId = +req.params.classId;

			const assignmentGrade =
				await this.gradeServices.findClassGradeByClassId(classId);

			res.status(HttpStatusCode.OK).json({
				data: assignmentGrade
			});
		}
	);
}
