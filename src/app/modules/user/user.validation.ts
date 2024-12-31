import { z } from 'zod';
import { User_Status } from './user.constant';

const userValidationSchema = z.object({
  password: z
    .string({ invalid_type_error: 'Password Must Be A String' })
    .min(6, 'Password Cannot Be Less Than 6 Characters')
    .max(20, 'Password Cannot Be More Then 20 Characters')
    .optional(),
});

// change status validation schema
const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...User_Status] as [string, ...string[]]),
  }),
});

export const userValidations = {
  userValidationSchema,
  changeStatusValidationSchema,
};
