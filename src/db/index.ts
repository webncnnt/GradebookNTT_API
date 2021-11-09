import sequelize from '@src/db/sequelize';
import { Class } from '@src/models/Class';
import { ClassInvitation } from '@src/models/ClassInvitation';
import { User } from '@src/models/User';
import { UserClass } from '@src/models/UserClass';
import { Model, ModelCtor } from 'sequelize/types';

const syncModel = (model: ModelCtor<Model<any, any>>) => {
	model
		.sync()
		.then(() => console.log(`Sync ${model.name} successful`))
		.catch(err => console.log(err));
};

sequelize
	.authenticate()
	.then(() => {
		console.log('Connect database successfully');

		syncModel(Class);
		syncModel(ClassInvitation);
		syncModel(User);
		syncModel(UserClass);
	})
	.catch(e => console.log(e));

const db = sequelize;
export default db;
