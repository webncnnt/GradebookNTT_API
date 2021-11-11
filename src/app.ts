
import { globalErrorHandler } from '@components/globalHandlerError';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import router from './auth/auth.routes';
import { isAuth } from './auth/auth.middleware';

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.use(cors());



app.use('/api/auth', router);

// test about  validation of access token
app.use('/api/profile', isAuth, async (req:any, res) => {
	res.send(req.user[0][0]);
});

// app.use('*', (req, res, next) => {
// 	res.send('Hello');
// 	next();
// });


app.use(globalErrorHandler);

export default app;
