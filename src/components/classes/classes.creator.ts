import { Class } from '@src/models/Class';
import { UserClass } from '@src/models/UserClass';
import {
	ClassMemberOverviewDto,
	ClassStudentsOverviewDto,
	ClassTeachersOverviewDto,
	ClassOverviewDto,
	ClassDetailDto
} from './classes.dto';
import { mapUserClassToClassMemberOverview } from './classes.mapping';

export class ClassesCreator {
	constructor(
		private readonly classRepository: typeof Class,
		private readonly userClassRepository: typeof UserClass
	) {}

	async createClassOverviewById(classId: number): Promise<ClassOverviewDto> {
		const clazz = await this.classRepository.findByPk(classId);
		return this.createClassOverview(clazz!);
	}

	async createClassDetailById(classId: number): Promise<ClassDetailDto> {
		const clazz = await this.classRepository.findByPk(classId);

		const total = await this.userClassRepository.count();
		const nStudent = await this.userClassRepository.count({
			where: { classId: classId, role: 0 }
		});
		const nTeacher = await this.userClassRepository.count({
			where: { classId: classId, role: 1 }
		});

		return this.createClassDetail(clazz!, total, nStudent, nTeacher);
	}

	createClassOverviews(clazz: Class[]): ClassOverviewDto[] {
		return clazz.map(clz => this.createClassOverview(clz));
	}

	createClassOverview(clazz: Class): ClassOverviewDto {
		return {
			id: clazz!.id,
			className: clazz!.clsName,
			ownerId: clazz!.ownerId,
			createDate: clazz!.createdAt,
			inviteCode: clazz!.inviteCode,
			coverImage: clazz!.coverImage || undefined,
			description: clazz!.description || undefined,
			expiredTime: clazz!.expiredTime || undefined
		};
	}

	createClassDetail(
		clazz: Class,
		total: number,
		nStudent: number,
		nTeacher: number
	): ClassDetailDto {
		return {
			id: clazz!.id,
			className: clazz!.clsName,
			ownerId: clazz!.ownerId,
			createDate: clazz!.createdAt,
			inviteCode: clazz!.inviteCode,
			coverImage: clazz!.coverImage || undefined,
			description: clazz!.description || undefined,
			expiredTime: clazz!.expiredTime || undefined,
			totalMembers: total,
			numberOfStudents: nStudent,
			numberOfTeachers: nTeacher
		};
	}

	async createClassStudentOverview(
		classId: number,
		userId: number
	): Promise<ClassMemberOverviewDto> {
		const studentUserClass =
			await this.userClassRepository.findStudentUserClass(
				classId,
				userId
			);

		const studentDto = mapUserClassToClassMemberOverview(studentUserClass!);

		return studentDto;
	}

	async createClassStudentOverviews(
		classId: number
	): Promise<ClassStudentsOverviewDto> {
		const studentUserClasses =
			await this.userClassRepository.findStudentsUserClassByClassId(
				classId
			);

		const studentsDto: ClassMemberOverviewDto[] = studentUserClasses.map(
			s => mapUserClassToClassMemberOverview(s)
		);

		return {
			students: studentsDto
		};
	}

	async createClassTeacherOverview(
		classId: number,
		userId: number
	): Promise<ClassMemberOverviewDto> {
		const teacherUserClass =
			await this.userClassRepository.findTeacherUserClass(
				classId,
				userId
			);

		const teacherDto = mapUserClassToClassMemberOverview(teacherUserClass!);

		return teacherDto;
	}

	async createClassTeacherOverviews(
		classId: number
	): Promise<ClassTeachersOverviewDto> {
		const teacherUserClasses =
			await this.userClassRepository.findTeachersUserClassByClassId(
				classId
			);

		const teachersDto: ClassMemberOverviewDto[] = teacherUserClasses.map(
			s => mapUserClassToClassMemberOverview(s)
		);

		return {
			teachers: teachersDto
		};
	}
}
