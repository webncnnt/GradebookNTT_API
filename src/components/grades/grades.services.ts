import { Class } from '@src/models/Class';
import { GradeAssignment } from '@src/models/GradeAssignment';
import { Student } from '@src/models/Student';
import { StudentGrade } from '@src/models/StudentGrade';
import { User } from '@src/models/User';
import { NotFoundError } from '@src/utils/appError';
import { Op } from 'sequelize';
import {
	GradeAssignmentDto,
	UpdateGradeAssignmentInput
} from '../gradeStructures/gradeStructures.dto';
import {
	AssignmentGradeDto,
	AssignmentGradeInput,
	ClassGradeDto,
	ClassGradeInput,
	StudentGradeDto,
	StudentGradeInAssignmentInput,
	StudentGradeInClassInput,
	StudentGradeInput,
	UpdateStudentGradeInput
} from './grades.dto';

export class GradeServices {
	private readonly gradeAssignmentRepository: typeof GradeAssignment;
	private readonly classRepository: typeof Class;
	private readonly studentRepository: typeof Student;
	private readonly studentGradeRepository: typeof StudentGrade;

	constructor(
		gradeAssignmentRepository: typeof GradeAssignment,
		classRepository: typeof Class,
		studentRepository: typeof Student,
		studentGradeRepository: typeof StudentGrade
	) {
		this.gradeAssignmentRepository = gradeAssignmentRepository;
		this.classRepository = classRepository;
		this.studentRepository = studentRepository;
		this.studentGradeRepository = studentGradeRepository;
	}

	async createStudentGrade(
		studentId: string,
		gradeAssignmentId: number,
		grade: StudentGradeInput
	): Promise<StudentGradeDto> {
		const { score } = grade;
		await this.studentGradeRepository.create({
			gradeAssignmentId,
			score,
			studentId
		});

		return {
			gradeAssignmentId,
			score,
			studentId
		};
	}

	async createAssignmentGrade(
		assignmentId: number,
		inputGrades: AssignmentGradeInput
	): Promise<AssignmentGradeDto> {
		const studentGrades = inputGrades.grades.map(grade => ({
			gradeAssignmentId: assignmentId,
			score: grade.score,
			studentId: grade.studentId
		}));

		await this.studentGradeRepository.bulkCreate(studentGrades);

		return {
			gradeAssignmentId: assignmentId,
			grades: studentGrades
		};
	}

	async createClassGrade(inputGrades: ClassGradeInput) {
		const studentGrades = inputGrades.grades.map(grade => ({
			gradeAssignmentId: grade.gradeAssignmentId,
			score: grade.score,
			studentId: grade.studentId
		}));

		await this.studentGradeRepository.bulkCreate(studentGrades);

		return studentGrades;
	}

	async findStudentGrade(
		studentId: string,
		assignmentId: number
	): Promise<StudentGradeDto> {
		const studentGrade = await this.studentGradeRepository.findOne({
			where: {
				studentId,
				gradeAssignmentId: assignmentId
			}
		});

		if (studentGrade == null)
			throw new NotFoundError('Grade of student does not exists');

		return studentGrade;
	}

	async findAssignmentGradeByAssignmentId(
		id: number
	): Promise<AssignmentGradeDto> {
		const studentGrades = await this.studentGradeRepository.findAll({
			where: {
				gradeAssignmentId: id
			}
		});

		return {
			gradeAssignmentId: id,
			grades: studentGrades
		};
	}

	async findClassGradeByClassId(id: number): Promise<ClassGradeDto> {
		const clazz = await this.classRepository.findByPk(id);

		if (clazz == null) throw new NotFoundError('class not found');

		const studentsInClass = await this.studentRepository.findAll({
			where: {
				classId: clazz.id
			}
		});

		const studentIds = studentsInClass.map(stu => stu.studentId);

		const studentGrades = await this.studentGradeRepository.findAll({
			where: {
				studentId: {
					[Op.in]: studentIds
				}
			}
		});

		return {
			classId: id,
			grades: studentGrades
		};
	}

	async updateStudentGrade(
		studentId: string,
		gradeAssignmentId: number,
		updatedInput: UpdateStudentGradeInput
	) {
		console.log(studentId, gradeAssignmentId);

		const studentGrade = await this.studentGradeRepository.findOne({
			where: {
				studentId,
				gradeAssignmentId
			}
		});

		const { score } = updatedInput;

		if (studentGrade == null) {
			return await this.studentGradeRepository.create({
				gradeAssignmentId,
				score: score ?? 0,
				studentId: studentId
			});
		}

		studentGrade.score = score ?? studentGrade.score;
		await studentGrade.save();

		return studentGrade;
	}

	async deleteAssignmentGrade(assignmentId: number) {
		await this.studentGradeRepository.destroy({
			where: {
				gradeAssignmentId: assignmentId
			}
		});
	}

	async deleteClassGrade(classId: number) {
		const gradeAssignmentsInClass =
			await this.gradeAssignmentRepository.findAll({
				where: {
					classId
				}
			});

		const gradeAssignmentIds = gradeAssignmentsInClass.map(g => g.id);

		await this.studentGradeRepository.destroy({
			where: {
				gradeAssignmentId: {
					[Op.in]: gradeAssignmentIds
				}
			}
		});
	}
}
