import config from '../config';
import { USER_ROLES } from '../modules/user/user.constant';
import { User } from '../modules/user/user.model';

const superAdminUser = {
  id: config.super_admin_id,
  email: config.super_admin_email,
  password: config.super_admin_password,
  needsPasswordChange: false,
  role: USER_ROLES.Super_Admin,
  status: 'In-Progress',
  isDeleted: false,
};

const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      role: USER_ROLES.Super_Admin,
    });

    if (!isSuperAdminExist) {
      await User.create(superAdminUser);
      console.log('Super Admin Seeded Successfully.👮');
    } else {
      console.log('Super Admin Already Exists.!');
    }
  } catch (error) {
    console.log('Error Seeding Super Admin', error);
  }
};

export default seedSuperAdmin;
