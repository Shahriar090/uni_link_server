import { ZodError, ZodIssue } from 'zod';
import { TErrorSource } from '../globalInterfaces/error';

// zod error handler
const handleZodError = (err: ZodError) => {
  const errorSource: TErrorSource = err.issues.map((issue: ZodIssue) => ({
    path: issue?.path[issue.path.length - 1],
    message: issue.message,
  }));
  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation Error',
    errorSource,
  };
};

export default handleZodError;
