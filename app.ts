import { globalErrorHandler } from 'components/globalHandlerError';
import express from 'express';
import cors from 'cors';

const auth = require('./src/auth/auth.routes');

const app = express();


app.use(cors());


app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use('/api/auth', auth)

// app.use('*', (req, res, next) => {
// 	res.send('Hello');
// 	next();
// });


app.use(globalErrorHandler);

export default app;
