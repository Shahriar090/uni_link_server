import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import { notFound } from './app/middlewares/notFound';
import router from './app/routes';

export const app: Application = express();
app.use(express.json());
app.use(cors());

// using routes
// Routes organized under the routes folder in a structured way
app.use('/api/v1', router);

// test routes
app.get('/', async (req: Request, res: Response) => {
  res.send('Hello From Uni-Link Server');
});

// global error handler
app.use(globalErrorHandler);

// not found route
app.use(notFound);
