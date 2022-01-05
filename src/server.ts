import { config } from 'config';
import { connectDatabase } from 'db';
import app from 'app';
import { Student } from './models/Student';
import { StudentGrade } from './models/StudentGrade';
import { Class } from './models/Class';
import { Review } from './models/Review';
import { CommentReview } from './models/CommentReview';
import { Notification } from './models/Notification';

connectDatabase(false, false).then(() => {
	console.log('Setup database successful');
});

app.listen(config.PORT, () => {
	console.log(`Server is listening on port ${config.PORT}`);
});
