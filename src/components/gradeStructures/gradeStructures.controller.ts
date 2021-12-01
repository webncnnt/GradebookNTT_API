import { HttpStatusCode } from '@src/constant/httpStatusCode';
import { IllegalArgumentError } from '@src/utils/appError';
import { catchAsyncRequestHandler } from '@src/utils/catchAsyncRequestHandler';
import { NextFunction, Request, Response } from 'express';
import {
	CreateGradeAssignmentInput,
	UpdateGradeAssignmentInput
} from './gradeStructures.dto';
import { GradeStructureServices } from './gradeStructures.services';

export class GradeStructureController {
	constructor(
		private readonly gradeStructureServices: GradeStructureServices
	) {}

	findGradeStructure = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const classId = +req.params.id;

			const gradeStructure =
				await this.gradeStructureServices.findGradeStructureByClassId(
					classId
				);

			res.status(HttpStatusCode.OK).json({
				status: 'success',
				data: {
					gradeStructure
				}
			});
		}
	);

	createGradeAssignment = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const classId = +req.params.id;
			const createGradeAssignmentInput =
				req.body as CreateGradeAssignmentInput;

			if (!createGradeAssignmentInput)
				throw new IllegalArgumentError('Invalid');

			const newGradeAssignment =
				await this.gradeStructureServices.createGradeAssignment(
					classId,
					createGradeAssignmentInput
				);

			res.status(HttpStatusCode.OK).json({
				status: 'success',
				data: {
					gradeAssignment: newGradeAssignment
				}
			});
		}
	);

	updateGradeAssignmentByIdcatchAsyncRequestHandler =
		catchAsyncRequestHandler(
			async (req: Request, res: Response, next: NextFunction) => {
				const classId = +req.params.id;
				const gradeAssignmentId = +req.params.gradeAssignmentId;
				const updateGradeAssignmentInput =
					req.body as UpdateGradeAssignmentInput;

				if (!updateGradeAssignmentInput)
					throw new IllegalArgumentError(
						'Invalid grade assignment input'
					);

				const updatedGradeAssignment =
					await this.gradeStructureServices.updateGradeAssignmentById(
						classId,
						gradeAssignmentId,
						updateGradeAssignmentInput
					);

				res.status(HttpStatusCode.OK).json({
					status: 'success',
					data: {
						gradeAssignment: updatedGradeAssignment
					}
				});
			}
		);

	deleteGradeAssignment = catchAsyncRequestHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const classId = +req.params.id;
			const gradeAssignmentId = +req.params.gradeAssignmentId;

			if (!gradeAssignmentId)
				throw new IllegalArgumentError('Invalid id');

			if (!gradeAssignmentId)
				throw new IllegalArgumentError('Invalid grade assignment id');

			await this.gradeStructureServices.deleteGradeAssignment(
				classId,
				gradeAssignmentId
			);

			res.status(HttpStatusCode.OK).json({ status: 'success' });
		}
	);
}
