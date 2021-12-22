import { config } from 'config';
import { connectDatabase } from 'db';
import app from 'app';
import { Student } from './models/Student';
import { StudentGrade } from './models/StudentGrade';
import { Class } from './models/Class';

connectDatabase(true, false).then(() => {
	console.log('Setup database successful');
	console.log(Student.prototype);
	console.log(Class.prototype);
});

app.listen(config.PORT, () => {
	console.log(`Server is listening on port ${config.PORT}`);
});
