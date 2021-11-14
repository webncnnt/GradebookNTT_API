import sequelize from '@src/db/sequelize';
import { Class } from '@src/models/Class';
import { ClassInvitation } from '@src/models/ClassInvitation';
import { User } from '@src/models/User';
import { UserClass } from '@src/models/UserClass';
import { Model, ModelCtor } from 'sequelize/types';

const syncModel = (model: ModelCtor<Model<any, any>>) => {
	return model
		.sync()
		.then(() => {
			console.log(`Sync ${model.name} successful`);
		})
		.catch(err => console.log(err));
};

export const connectDatabase = async (
	sync: boolean = false,
	force: boolean = false
) => {
	await sequelize.authenticate();
	console.log('Connect database successfully');

	if (!sync) return;

	await Promise.all([
		Class.sync({ force: true }),
		syncModel(ClassInvitation),
		syncModel(User),
		syncModel(UserClass)
	]);
};

const db = sequelize;
export default db;
