import { commandDevData } from './command';
import { Class } from './../models/Class';
import { connectDatabase } from './../db';

connectDatabase().then(() => {
	commandDevData(`${__dirname}/classes-data.json`, Class);
});
