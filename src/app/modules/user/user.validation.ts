import { z } from 'zod';

const userValidationSchema = z.object({
  id: z
    .string()
    .min(1, 'User Id Is Required')
    .max(6, 'User Id Cannot Be More Than 6 Characters'),
  password: z
    .string()
    .min(6, 'Password Cannot Be Less Than 6 Characters')
    .max(20, 'Password Cannot Be More Then 20 Characters'),

  needsPasswordChange: z.boolean().optional().default(true),
  role: z.enum(['Admin', 'Faculty', 'Student'], {
    errorMap: () => ({
      message: "Role must be either 'Admin', 'Faculty', or 'Student'.",
    }),
  }),
  status: z
    .enum(['In-Progress', 'Blocked'], {
      errorMap: () => ({
        message: "Status must be either 'In-Progress' or 'Blocked'.",
      }),
    })
    .default('In-Progress'),
  isDeleted: z.boolean().optional().default(false),
});

export default userValidationSchema;
