import { commandDevData } from './command';
import { User } from './../models/User';
import { connectDatabase } from './../db';

connectDatabase(true, false).then(() => {
	commandDevData(`${__dirname}/users-data.json`, User);
});
