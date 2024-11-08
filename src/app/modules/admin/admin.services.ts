import QueryBuilder from '../../builder/QueryBuilder';
import { AdminSearchableFields } from './admin.constant';
import { Admin } from './admin.model';

// get  all admins
const getAllAdminsFromDb = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(Admin.find(), query)
    .search(AdminSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await adminQuery.modelQuery;
  return result;
};

// get a single admin
const getSingleAdminFromDb = async (id: string) => {
  const result = await Admin.findById(id);
  return result;
};

export const adminServices = {
  getAllAdminsFromDb,
  getSingleAdminFromDb,
};
