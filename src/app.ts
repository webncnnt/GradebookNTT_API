import { globalErrorHandler } from '@components/globalHandlerError';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import router from './auth/auth.routes';
import { isAuth } from './auth/auth.middleware';
import profileRouter from './components/profile/profile.route';
import emailRouter from './components/mailServices';
import studentRouter from './components/students/student.route';
import reviewer from './components/reviewer/reviewer.route';
import commentRouter from './components/comment/comment.route';
import reviewRouter from './components/review/review.route';
import NotificationRouter from './components/notification/notification.route';

import classesRouter from '@components/classes';
import classInvitationRouter from '@components/classInvitation';
import usercontentRouter from '@components/usercontent';
import gradeRouter from './components/grades/';
import adminRouter from './components/admin/';

import path from 'path';

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../public')));

app.use(
	cors({
		origin: '*',
		credentials: true,
		exposedHeaders: ['x-total-count']
	})
);

const API_PREFIX = '/api';

app.use(`${API_PREFIX}/classes`, classesRouter);
app.use(`${API_PREFIX}/invites`, classInvitationRouter);
app.use(`${API_PREFIX}/grades`, gradeRouter);
app.use(`${API_PREFIX}/upload`, usercontentRouter);
app.use(`${API_PREFIX}/admin`, adminRouter);

app.use('/api/auth', router);
app.use('/api/profile', isAuth, profileRouter);
app.use('/api/email', emailRouter);
app.use('/api/students', studentRouter);
app.use('/api/reviewer', reviewer);
app.use('/api/comment', commentRouter);
app.use('/api/review', reviewRouter);
app.use('/api/notification', NotificationRouter);

//test about  validation of access token
// app.use('/api/profile', isAuth, async (req: any, res) => {
// 	res.send(req.user);
// });

// app.use('*', (req, res, next) => {
// 	res.send('Hello');
// 	next();
// });

app.use(globalErrorHandler);

export default app;
