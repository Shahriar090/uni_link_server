import { TErrorSource, TGenericErrorResponse } from '../globalInterfaces/error';

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const match = err.message.match(/"([^"]*)"/);
  const extractedMsg = match && match[1];
  const errorSource: TErrorSource = [
    {
      path: '',
      message: `${extractedMsg} Is Already Exist`,
    },
  ];
  const statusCode = 400;
  return {
    statusCode,
    message: 'Duplicate Error.',
    errorSource,
  };
};
export default handleDuplicateError;
