import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: 'Id Is Required' }),
    password: z.string({ required_error: 'Password Is Required' }),
  }),
});

export const authValidation = {
  loginValidationSchema,
};
