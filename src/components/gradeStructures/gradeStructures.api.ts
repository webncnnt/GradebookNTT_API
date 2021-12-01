import { Class } from '@src/models/Class';
import { GradeAssignment } from '@src/models/GradeAssignment';
import { User } from '@src/models/User';
import { UserClass } from '@src/models/UserClass';
import { Router } from 'express';
import { ClassesChecker } from '../classes/classes.checker';
import { GradeStructureController } from './gradeStructures.controller';
import { GradeStructureServices } from './gradeStructures.services';

const router = Router({ mergeParams: true });

const classesChecker = new ClassesChecker(Class, User, UserClass);
const gradeStructureServices = new GradeStructureServices(
	Class,
	GradeAssignment,
	classesChecker
);
const gradeStructureController = new GradeStructureController(
	gradeStructureServices
);

router
	.route('/')
	.post(gradeStructureController.createGradeAssignment)
	.get(gradeStructureController.findGradeStructure);

router
	.route('/:gradeAssignmentId')
	.patch(
		gradeStructureController.updateGradeAssignmentByIdcatchAsyncRequestHandler
	)
	.delete(gradeStructureController.deleteGradeAssignment);

export default router;
