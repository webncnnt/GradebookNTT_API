import express from 'express';
import { config } from 'config';

const app = express();

app.use('/api/dashboard', (req, res, next) => {
	res.send('<h1>Hello from node</h1>');
});

app.listen(config.PORT, () => {
	console.log('Server is listening on port 8000');
});
