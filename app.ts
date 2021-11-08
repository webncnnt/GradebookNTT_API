import { globalErrorHandler } from 'components/globalHandlerError';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

app.use('*', (req, res, next) => {
	res.send('Hello');
	next();
});

app.use(globalErrorHandler);

export default app;
