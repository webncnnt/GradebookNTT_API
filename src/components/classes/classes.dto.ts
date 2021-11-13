import { Class } from '@src/models/Class';

export type CreateClassDto = {
	className: string;
	coverImage?: string;
	description?: string;
	expiredTime?: Date;
	teachers?: number[];
};

export type UpdateClassDto = Partial<CreateClassDto>;

export type ResponseClassDto = {
	classname: string;
	coverImage: string;
	description?: string;
	inviteCode: string;
	ownerId: number;
	expiredTime: Date;
};

export type ResponseClassesDto = {
	length: number;
	classes: ResponseClassDto[];
};

export const classToResponseDtoConverter = (clz: Class): ResponseClassDto => ({
	classname: clz.clsName,
	coverImage: clz.coverImage,
	description: clz.description,
	inviteCode: clz.inviteCode,
	ownerId: clz.ownerId,
	expiredTime: clz.expiredTime
});
