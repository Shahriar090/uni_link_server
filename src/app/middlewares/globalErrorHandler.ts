import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

export const globalErrorHandler: ErrorRequestHandler = (err, _, res, next) => {
  console.error(err.stack);
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something Went Wrong';

  type TErrorSource = {
    path: string | number;
    message: string;
  }[];

  const errorSource: TErrorSource = [
    {
      path: '',
      message: 'Something Went Wrong',
    },
  ];

  if (err instanceof ZodError) {
    (statusCode = 400), (message = 'I am zod error');
  }
  res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    error: err,
  });
  next();
};
