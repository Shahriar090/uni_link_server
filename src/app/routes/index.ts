import { Router } from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { studentRoutes } from '../modules/student/student.routes';
import { academicSemesterRoutes } from '../modules/academicSemester/academicSemester.routes';
import { academicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.routes';
import { academicDepartmentRoutes } from '../modules/academicDepartment/academicDepartment.routes';
import { facultyRoutes } from '../modules/faculty/faculty.routes';
import { adminRoutes } from '../modules/admin/admin.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/students',
    route: studentRoutes,
  },
  {
    path: '/admins',
    route: adminRoutes,
  },
  {
    path: '/faculties',
    route: facultyRoutes,
  },
  {
    path: '/academic-semesters',
    route: academicSemesterRoutes,
  },
  {
    path: '/academic-faculties',
    route: academicFacultyRoutes,
  },
  {
    path: '/academic-departments',
    route: academicDepartmentRoutes,
  },
];

// router.use('/users', userRoutes);
// router.use('/students', studentRoutes);

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
