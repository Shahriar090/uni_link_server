import { z } from 'zod';
import { semesterRegistrationConstant } from './semesterRegistration.constants';

const createSemesterRegistrationValidationSchema = z.object({
  body: z.object({
    academicSemester: z.object({
      academicSemester: z.string(),
      status: z.enum([
        ...(semesterRegistrationConstant as [string, ...string[]]),
      ]),
      startDate: z.string().datetime(),
      endDate: z.string().datetime(),
      minCredit: z.number(),
      maxCredit: z.number(),
    }),
  }),
});

export const semesterRegistrationValidations = {
  createSemesterRegistrationValidationSchema,
};
