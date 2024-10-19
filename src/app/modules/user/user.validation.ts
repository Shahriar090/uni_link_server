import { z } from 'zod';

const userValidationSchema = z.object({
  password: z
    .string({ invalid_type_error: 'Password Must Be A String' })
    .min(6, 'Password Cannot Be Less Than 6 Characters')
    .max(20, 'Password Cannot Be More Then 20 Characters')
    .optional(),
});

export default userValidationSchema;
