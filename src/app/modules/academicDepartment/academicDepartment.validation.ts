import z from 'zod';

const createAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic Department Must Be An String',
      required_error: 'Academic Department Is Required',
    }),
    academicFaculty: z.string({
      invalid_type_error: 'Academic Faculty Must Be An String',
      required_error: 'Academic Faculty Is Required',
    }),
  }),
});

const updateAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'Academic Department Must Be An String',
        required_error: 'Academic Department  Is Required',
      })
      .optional(),
    academicFaculty: z
      .string({
        invalid_type_error: 'Academic Faculty Must Be An String',
        required_error: 'Academic Faculty Is Required',
      })
      .optional(),
  }),
});

export const academicDepartmentValidations = {
  createAcademicDepartmentValidationSchema,
  updateAcademicDepartmentValidationSchema,
};
