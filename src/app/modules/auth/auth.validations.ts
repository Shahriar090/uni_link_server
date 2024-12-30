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

// refresh token validation schema
const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: 'Refresh Token Is Required!' }),
  }),
});

// forget password validation schema
const forgetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: 'User Id Is Required' }),
  }),
});

// reset password validation schema
const resetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: 'User Id Is Required' }),
    newPassword: z.string({ required_error: 'New Password Is Required' }),
  }),
});
export const authValidation = {
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
};
