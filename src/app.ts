import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { studentRoutes } from './app/modules/student/student.routes';
import { userRoutes } from './app/modules/user/user.routes';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import { notFound } from './app/middlewares/notFound';
import router from './app/routes';

export const app: Application = express();
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// using routes
app.use('/api/v1', router);

// global error handler

app.use(globalErrorHandler);

// not found route
app.use(notFound);
