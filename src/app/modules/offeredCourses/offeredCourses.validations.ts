import { z } from 'zod';
import { Days } from './offeredCourses.constants';

const createOfferedCoursesValidationSchema = z.object({
  body: z.object({
    semesterRegistration: z.string(),
    academicFaculty: z.string(),
    academicDepartment: z.string(),
    course: z.string(),
    faculty: z.string(),
    section: z.number(),
    maxCapacity: z.number(),
    days: z.array(z.enum([...Days] as [string, ...string[]])),
    startTime: z.string().refine(
      (time) => {
        const regex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
        return regex.test(time);
      },
      { message: 'Invalid Time Format! Expected "HH:MM" In 24 Hours Format' },
    ),
    endTime: z.string().refine(
      (time) => {
        const regex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
        return regex.test(time);
      },
      { message: 'Invalid Time Format! Expected "HH:MM" In 24 Hours Format' },
    ),
  }),
});

const updateOfferedCoursesValidationSchema = z.object({
  body: z.object({
    faculty: z.string().optional(),
    maxCapacity: z.number().optional(),
    days: z.enum([...Days] as [string, ...string[]]).optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  }),
});

export const offeredCoursesValidations = {
  createOfferedCoursesValidationSchema,
  updateOfferedCoursesValidationSchema,
};
