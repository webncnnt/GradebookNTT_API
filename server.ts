import { QueryTypes } from 'sequelize';
import { config } from 'config';
import database from 'db';
import app from 'app';

database.query('SELECT * FROM `Class`', { type: QueryTypes.SELECT });

app.listen(config.PORT, () => {
	console.log(`Server is listening on port ${config.PORT}`);
});
