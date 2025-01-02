import { z } from 'zod';

const createUserNameValidationSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  middleName: z.string().trim().optional(),
  lastName: z.string().trim().min(1, 'Last name is required'),
});

const createGuardianValidationSchema = z.object({
  fatherName: z.string().trim().min(1, "Father's name is required"),
  fatherOccupation: z.string().min(1, "Father's occupation is required"),
  fatherContactNo: z.string().min(1, "Father's contact number is required"),
  motherName: z.string().trim().min(1, "Mother's name is required"),
  motherOccupation: z.string().min(1, "Mother's occupation is required"),
  motherContactNo: z.string().min(1, "Mother's contact number is required"),
});

const createLocalGuardianValidationSchema = z.object({
  name: z.string().trim().min(1, "Local guardian's name is required"),
  occupation: z.string().min(1, "Local guardian's occupation is required"),
  contactNo: z.string().min(1, "Local guardian's contact number is required"),
  address: z.string().min(1, "Local guardian's address is required"),
});

// Main student schema validation

const createStudentValidationSchema = z.object({
  body: z.object({
    password: z
      .string()
      .max(20, 'Password Cannot Be More Than 20 Characters')
      .min(6, 'Password Cannot Be Less Than 6 Characters')
      .optional(),
    student: z.object({
      name: createUserNameValidationSchema,
      email: z
        .string()
        .email('Invalid email')
        .min(1, 'Email is required')
        .trim(),
      gender: z.enum(['Male', 'Female', 'Others'], {
        required_error: 'Gender is required',
      }),
      dateOfBirth: z.string().optional(),
      contactNo: z.string().min(1, 'Contact number is required'),
      emergencyContactNo: z
        .string()
        .min(1, 'Emergency contact number is required'),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string().min(1, 'Present address is required'),
      permanentAddress: z.string().min(1, 'Permanent address is required'),
      guardian: createGuardianValidationSchema,
      localGuardian: createLocalGuardianValidationSchema,
      admissionSemester: z.string(),
      // profileImage: z.string().optional(), // image will be uploaded separately
    }),
  }),
});

// zod validation schema for update--------------------------------------

const updateUserNameValidationSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').optional(),
  middleName: z.string().trim().optional(),
  lastName: z.string().trim().min(1, 'Last name is required').optional(),
});

// Update Guardian Validation Schema
const updateGuardianValidationSchema = z.object({
  fatherName: z.string().trim().min(1, "Father's name is required").optional(),
  fatherOccupation: z
    .string()
    .min(1, "Father's occupation is required")
    .optional(),
  fatherContactNo: z
    .string()
    .min(1, "Father's contact number is required")
    .optional(),
  motherName: z.string().trim().min(1, "Mother's name is required").optional(),
  motherOccupation: z
    .string()
    .min(1, "Mother's occupation is required")
    .optional(),
  motherContactNo: z
    .string()
    .min(1, "Mother's contact number is required")
    .optional(),
});

// Update Local Guardian Validation Schema
const updateLocalGuardianValidationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Local guardian's name is required")
    .optional(),
  occupation: z
    .string()
    .min(1, "Local guardian's occupation is required")
    .optional(),
  contactNo: z
    .string()
    .min(1, "Local guardian's contact number is required")
    .optional(),
  address: z.string().min(1, "Local guardian's address is required").optional(),
});

// Main Student Schema Update Validation
const updateStudentValidationSchema = z.object({
  body: z.object({
    student: z.object({
      name: updateUserNameValidationSchema.optional(),
      email: z
        .string()
        .email('Invalid email')
        .min(1, 'Email is required')
        .trim()
        .optional(),
      gender: z
        .enum(['Male', 'Female', 'Others'], {
          required_error: 'Gender is required',
        })
        .optional(),
      dateOfBirth: z.string().optional(),
      contactNo: z.string().min(1, 'Contact number is required').optional(),
      emergencyContactNo: z
        .string()
        .min(1, 'Emergency contact number is required')
        .optional(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z
        .string()
        .min(1, 'Present address is required')
        .optional(),
      permanentAddress: z
        .string()
        .min(1, 'Permanent address is required')
        .optional(),
      guardian: updateGuardianValidationSchema.optional(),
      localGuardian: updateLocalGuardianValidationSchema.optional(),
      admissionSemester: z.string().optional(),
      profileImage: z.string().optional(),
    }),
  }),
});

export const studentValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
};
