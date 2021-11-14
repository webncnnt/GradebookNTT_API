import fs from 'fs';
import { Model, ModelCtor } from 'sequelize';

type NonAbstract<T> = { [P in keyof T]: T[P] };

type Constructor<T> = new (...args: any[]) => T;

type Repository<M> = (new () => M) & NonAbstract<typeof Model>;

export function commandDevData<M extends Model>(
	jsonFilePath: string,
	model: Repository<M>
) {
	const arrData = JSON.parse(fs.readFileSync(jsonFilePath).toString());

	const importData = async () => {
		try {
			const modelsInstanceCreated = await model.bulkCreate(arrData);

			console.log(modelsInstanceCreated);
			console.log('successful');
			process.exit();
		} catch (err) {
			console.log(err);
		}
	};

	//delete data
	const deleteData = async () => {
		try {
			await model.destroy();
			console.log('successful');
			process.exit();
		} catch (error) {
			console.log(error);
		}
	};

	if (process.argv[2] === '--import') {
		console.log('must import');
		importData();
	} else if (process.argv[2] === '--delete') {
		deleteData();
	}
}
