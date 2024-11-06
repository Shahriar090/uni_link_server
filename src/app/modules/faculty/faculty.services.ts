// get all faculty

import QueryBuilder from '../../builder/QueryBuilder';
import { FacultySearchableFields } from './faculty.constant';
import Faculty from './faculty.model';

const getAllFacultiesFromDb = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(
    Faculty.find().populate('academicDepartment'),
    query,
  )
    .search(FacultySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await facultyQuery.modelQuery;
  return result;
};

// get single faculty

const getSingleFacultyFromDb = async (id: string) => {
  const result = await Faculty.findById(id).populate('academicDepartment');
  return result;
};

export const facultyServices = {
  getAllFacultiesFromDb,
  getSingleFacultyFromDb,
};
