import { Class } from '@src/models/Class';
import {
	CreateClassDto,
	mergeUpdateClassDtoWithClass,
	UpdateClassDto
} from './classes.dto';
import { nanoid } from 'nanoid';
import { inject } from 'tsyringe';

const INVITE_CODE_LENGTH = 8;

const generateInviteCode = (): string => {
	return nanoid(INVITE_CODE_LENGTH);
};

export class ClassesService {
	constructor(
		@inject('classesRepository')
		private readonly classesRepository: typeof Class
	) {}

	async create(
		ownerId: number,
		createClassDto: CreateClassDto
	): Promise<Class> {
		const {
			className,
			coverImage,
			description,
			expiredTime,
			teachers = [ownerId]
		} = createClassDto;

		const inviteCode = generateInviteCode();

		const clz = new Class({
			clsName: className,
			coverImage,
			description,
			expiredTime,
			teachers,
			inviteCode,
			ownerId
		});

		return await this.classesRepository.build(clz).save();
	}

	async getClassById(id: number): Promise<Class | null> {
		return await this.classesRepository.findOne({ where: { id } });
	}

	async getAllClasses(): Promise<Class[]> {
		return await this.classesRepository.findAll();
	}

	async getAllClassWhereUserId(id: number): Promise<Class[]> {
		return await this.classesRepository.findAll({ where: { ownerId: id } });
	}

	async getAllActiveClassWhereUserId(id: number): Promise<Class[]> {
		return await this.classesRepository.findAll({
			where: { ownerId: id, status: 0, delectedAt: null }
		});
	}

	async update(
		id: number,
		updateClassDto: UpdateClassDto
	): Promise<Class | null> {
		const clz = await this.getClassById(id);

		if (!clz) return null;

		mergeUpdateClassDtoWithClass(clz, updateClassDto);

		return await clz.save();
	}

	async deleteById(id: number): Promise<Class | null> {
		const clz = await this.getClassById(id);

		if (!clz) return null;

		clz.deletedAt = new Date();
		clz.status = true;

		try {
			await clz.destroy();
			return clz;
		} catch (err) {
			return null;
		}
	}

	async deleteAll(): Promise<number> {
		return await this.classesRepository.destroy();
	}
}