import { globalErrorHandler } from '@components/globalHandlerError';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.use(cors());

app.use('*', (req, res, next) => {
	res.send('Hello');
	next();
});

app.use(globalErrorHandler);

export default app;
