import { Router } from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { studentRoutes } from '../modules/student/student.routes';
import { academicSemesterRoutes } from '../modules/academicSemester/academicSemester.routes';

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
    path: '/academic-semesters',
    route: academicSemesterRoutes,
  },
];

// router.use('/users', userRoutes);
// router.use('/students', studentRoutes);

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
