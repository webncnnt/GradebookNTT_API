import sequelize from '@src/db/sequelize';
import { Class } from '@src/models/Class';
import { ClassInvitation } from '@src/models/ClassInvitation';
import { GradeAssignment } from '@src/models/GradeAssignment';
import { Student } from '@src/models/Student';
import { User } from '@src/models/User';
import { UserClass } from '@src/models/UserClass';

export const connectDatabase = async (
	sync: boolean = false,
	force: boolean = false
) => {
	await sequelize.authenticate();
	console.log('Connect database successfully');

	if (!sync) return;

	await User.sync({ force });
	await Class.sync({ force });
	await UserClass.sync({ force });
	await ClassInvitation.sync({ force });
	await GradeAssignment.sync({ force });
	await Student.sync({ force });
	console.log('Sync tables successfully');
};

const db = sequelize;
export default db;
