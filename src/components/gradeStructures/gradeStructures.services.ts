import { Class } from '@src/models/Class';
import { GradeAssignment } from '@src/models/GradeAssignment';
import { NotFoundError } from '@src/utils/appError';
import { ClassesChecker } from '../classes/classes.checker';
import {
	CreateGradeAssignmentInput,
	GradeAssignmentDto,
	GradeStructureDto,
	UpdateGradeAssignmentInput
} from './gradeStructures.dto';

export class GradeStructureServices {
	constructor(
		private readonly classRepository: typeof Class,
		private readonly gradeAssignmentRepository: typeof GradeAssignment,
		private readonly classChecker: ClassesChecker
	) {}

	async findGradeStructureByClassId(id: number): Promise<GradeStructureDto> {
		await this.classChecker.checkExistClassById(id);

		const clz = await this.classRepository.findByPk(id);
		const gradeAssignments = await clz!.getGradeAssignments();

		const gradeAssignmentsDto: GradeAssignmentDto[] = gradeAssignments.map(
			ga => mapGradeAssignmentToGradeAssignmentDto(ga)
		);

		return {
			classId: id,
			gradeAssignments: gradeAssignmentsDto
		};
	}

	async updateGradeAssignmentById(
		classId: number,
		id: number,
		updateGradeAssignmentInput: UpdateGradeAssignmentInput
	): Promise<GradeAssignmentDto> {
		await this.classChecker.checkExistClassById(classId);
		const gradeAssignment = await this.gradeAssignmentRepository.findOne({
			where: { classId, id }
		});

		if (!gradeAssignment)
			throw new NotFoundError(
				`Cannot found any grade assignment has id = ${id}`
			);

		const { title, pos, score } = updateGradeAssignmentInput;

		gradeAssignment.title = title || gradeAssignment.title;
		gradeAssignment.pos = pos || gradeAssignment.pos;
		gradeAssignment.score = score || gradeAssignment.score;

		const updatedGradeAssignment = await gradeAssignment.save();

		return mapGradeAssignmentToGradeAssignmentDto(updatedGradeAssignment);
	}

	async createGradeAssignment(
		classId: number,
		gradeAssignmentInput: CreateGradeAssignmentInput
	): Promise<GradeAssignmentDto> {
		await this.classChecker.checkExistClassById(classId);

		const { pos, score, title } = gradeAssignmentInput;

		const gradeAssignment = await this.gradeAssignmentRepository.create({
			classId,
			pos,
			score,
			title
		});

		return mapGradeAssignmentToGradeAssignmentDto(gradeAssignment);
	}

	async deleteGradeAssignment(classId: number, id: number): Promise<void> {
		await this.classChecker.checkExistClassById(classId);
		const gradeAssignment = await this.gradeAssignmentRepository.findOne({
			where: { classId, id }
		});

		if (!gradeAssignment)
			throw new NotFoundError(
				`Cannot found any grade assignment has id = ${id}`
			);

		await gradeAssignment.destroy();
	}
}

function mapGradeAssignmentToGradeAssignmentDto(
	ga: GradeAssignment
): GradeAssignmentDto {
	return {
		classId: ga.classId,
		id: ga.id,
		pos: ga.pos,
		score: ga.score,
		title: ga.title
	};
}
