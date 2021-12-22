export type StudentGradeInput = {
	score: number;
};

export type UpdateStudentGradeInput = Partial<StudentGradeInput>;

export type StudentGradeInAssignmentInput = {
	studentId: string;
	score: number;
};

export type StudentGradeInClassInput = {
	studentId: string;
	score: number;
	gradeAssignmentId: number;
};

export type AssignmentGradeInput = {
	grades: StudentGradeInAssignmentInput[];
};

export type ClassGradeInput = {
	grades: StudentGradeInClassInput[];
};

export type StudentGradeDto = {
	studentId: string;
	score: number;
	gradeAssignmentId: number;
};

export type AssignmentGradeDto = {
	gradeAssignmentId: number;
	grades: StudentGradeDto[];
};

export type ClassGradeDto = {
	classId: number;
	grades: StudentGradeDto[];
};
