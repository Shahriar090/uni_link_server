import z from 'zod';
const academicFacultyValidationSchema = z.object({
  name: z.string({
    invalid_type_error: 'Academic Faculty Name Must Be An String',
  }),
});

export const academicFacultyValidations = { academicFacultyValidationSchema };
