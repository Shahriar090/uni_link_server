import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { Admin } from '../admin/admin.model';
import { User } from './user.model';

// find last admitted student
const findLastStudentId = async () => {
  const lastStudent = await User.findOne({ role: 'Student' }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();
  return lastStudent?.id ? lastStudent.id : undefined;
};
// 2024 02 0001

// generating student id dynamically
export const generateStudentId = async (payload: TAcademicSemester) => {
  let currentId = (0).toString(); //0000 default
  // to prevent too many db call storing last student id into a variable.
  const lastStudentId = await findLastStudentId(); // example - 2025 02 0001
  const lastStudentYear = lastStudentId?.substring(0, 4);
  const lastStudentSemesterCode = lastStudentId?.substring(4, 6);
  const currentStudentYear = payload.year;
  const currentStudentSemesterCode = payload.code;
  // checking semester code and year same or different.
  // if year and code same new student id will be next to last admitted student id.
  if (
    lastStudentId &&
    lastStudentYear === currentStudentYear &&
    lastStudentSemesterCode === currentStudentSemesterCode
  ) {
    currentId = lastStudentId.substring(6);
  }
  // if year and code are not same new student id will be start from 0001
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementId = `${payload.year}${payload.code}${incrementId}`;

  return incrementId;
};

// -------------------------------------------------------------
// Faculty id functionalities
export const findLastFacultyId = async () => {
  const lastFaculty = await User.findOne({ role: 'Faculty' }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();

  return lastFaculty?.id ? lastFaculty.id.substring(2) : undefined;
};

export const generateFacultyId = async () => {
  let currentId = (0).toString();
  const lastFacultyId = await findLastFacultyId();

  if (lastFacultyId) {
    currentId = lastFacultyId.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementId = `F-${incrementId}`;
  return incrementId;
};
// --------------------------------------------------------------------------
// Admin id functionalities
// find last admin
const findLastAdminId = async () => {
  const lastAdmin = await User.findOne({ role: 'Admin' }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();

  return lastAdmin?.id ? lastAdmin.id.substring(2) : undefined;
};

// generating admin id
export const generateAdminId = async () => {
  let currentId = (0).toString();
  const lastAdminId = await findLastAdminId();
  if (lastAdminId) {
    currentId = lastAdminId.substring(2);
  }
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementId = `$A-${incrementId}`;
  return incrementId;
};
