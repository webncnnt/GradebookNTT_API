export type GradeStructureDto = {
	classId: number;
	gradeAssignments: GradeAssignmentDto[];
};

export type GradeAssignmentDto = {
	id: number;
	classId: number;
	title: string;
	score: number;
	pos: number;
};

export type CreateGradeAssignmentInput = {
	title: string;
	score: number;
	pos: number;
};

export type UpdateGradeAssignmentInput = {
	title?: string;
	score?: number;
	pos?: number;
};
