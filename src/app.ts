import { globalErrorHandler } from '@components/globalHandlerError';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import router from './auth/auth.routes';
import { isAuth } from './auth/auth.middleware';

import classesRouter from '@components/classes';
const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.use(
	cors({
		origin: ['http://localhost:3000', 'http://locahost:8000'],
		credentials: true
	})
);

app.use((req: Request, res: Response, next: NextFunction) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	next();
});

const API_PREFIX = '/api';

app.use(`${API_PREFIX}/classes`, classesRouter);

app.use('/api/auth', router);

//test about  validation of access token
app.use('/api/profile', isAuth, async (req: any, res) => {
	res.send(req.user);
});

// app.use('*', (req, res, next) => {
// 	res.send('Hello');
// 	next();
// });

app.use(globalErrorHandler);

export default app;
