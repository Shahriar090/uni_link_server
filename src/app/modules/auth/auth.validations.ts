import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: 'Id Is Required' }),
    password: z.string({ required_error: 'Password Is Required' }),
  }),
});

// change password validation schema
const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: 'Old Password Is Required' }),
    newPassword: z.string({ required_error: 'New Password Is Required' }),
  }),
});
export const authValidation = {
  loginValidationSchema,
  changePasswordValidationSchema,
};
