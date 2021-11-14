import { commandDevData } from './command';
import { User } from './../models/User';
import { connectDatabase } from './../db';

connectDatabase().then(() => {
	commandDevData(`${__dirname}/users-data.json`, User);
});
