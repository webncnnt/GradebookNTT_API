import { Class } from '@src/models/Class';
import { nanoid } from 'nanoid';
import { CreateClassDto, UpdateClassDto } from './classes.dto';

const INVITE_CODE_LENGTH = 8;

const generateInviteCode = (): string => {
	return nanoid(INVITE_CODE_LENGTH);
};

export class ClassesService {
	constructor(private readonly classesRepository: typeof Class) {}

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

		return await clz.save();
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
			where: { ownerId: id, status: 0 }
		});
	}

	async updateById(
		id: number,
		updateClassDto: UpdateClassDto
	): Promise<Class | null> {
		const clz = await this.getClassById(id);

		if (!clz) return null;

		const { className, coverImage, description, expiredTime, teachers } =
			updateClassDto;

		clz.clsName = className || clz.clsName;
		clz.coverImage = coverImage || clz.clsName;
		clz.description = description || clz.description;
		clz.expiredTime = expiredTime || clz.expiredTime;
		clz.teachers = teachers || clz.teachers;

		return await clz.save();
	}

	async deleteById(id: number): Promise<Class | null> {
		const clz = await this.getClassById(id);

		if (!clz) return null;

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
