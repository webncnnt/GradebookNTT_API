import { config } from 'config';
import { connectDatabase } from 'db';
import app from 'app';
import { User } from './models/User';
import { UserClass } from './models/UserClass';
import { Class } from './models/Class';

connectDatabase(true, true).then(() => {
	console.log('Setup database successful');
	console.log(User.prototype);
	console.log(UserClass.prototype);
	console.log(Class.prototype);
});

app.listen(config.PORT, () => {
	console.log(`Server is listening on port ${config.PORT}`);
});
