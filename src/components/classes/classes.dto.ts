import { Class } from '@src/models/Class';

export type CreateClassDto = {
	className: string;
	coverImage?: string;
	description?: string;
	expiredTime?: Date;
	student?: number[];
	teachers?: number[];
};

export type UpdateClassDto = Partial<CreateClassDto>;

export type ResponseClassDto = {
	id: number;
	className: string;
	coverImage?: string;
	description?: string;
	inviteCode: string;
	ownerId: number;
	student?: number[];
	teacher?: number[];
	expiredTime: Date | null;
	status: boolean;
};

export const classToResponseDtoConverter = (clz: Class): ResponseClassDto => ({
	id: clz.id,
	className: clz.clsName,
	coverImage: clz.coverImage || undefined,
	description: clz.description || undefined,
	inviteCode: clz.inviteCode,
	ownerId: clz.ownerId,
	expiredTime: clz.expiredTime,
	student: clz.students || undefined,
	teacher: clz.teachers || undefined,
	status: clz.status
});
