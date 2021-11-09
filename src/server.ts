import { QueryTypes } from 'sequelize';
import { config } from 'config';
import { connectDatabase } from 'db';
import app from 'app';

connectDatabase().then(() => {
	console.log('Setup database successful');
});

app.listen(config.PORT, () => {
	console.log(`Server is listening on port ${config.PORT}`);
});
