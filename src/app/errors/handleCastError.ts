import mongoose from 'mongoose';
import { TErrorSource, TGenericErrorResponse } from '../globalInterfaces/error';

const handleCastError = (
  err: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const errorSource: TErrorSource = [
    {
      path: err.path,
      message: err.message,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: 'Invalid Id',
    errorSource,
  };
};

export default handleCastError;
