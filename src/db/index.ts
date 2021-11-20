import sequelize from '@src/db/sequelize';
import { Class } from '@src/models/Class';
import { ClassInvitation } from '@src/models/ClassInvitation';
import { User } from '@src/models/User';
import { UserClass } from '@src/models/UserClass';

export const connectDatabase = async (
	sync: boolean = false,
	force: boolean = false
) => {
	await sequelize.authenticate();
	console.log('Connect database successfully');

	if (!sync) return;

	await Class.sync({ force });
	await User.sync({ force });
	await UserClass.sync({ force });
	await ClassInvitation.sync({ force });

	console.log('Sync tables successfully');
};

const db = sequelize;
export default db;
