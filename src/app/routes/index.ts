import { Router } from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { studentRoutes } from '../modules/student/student.routes';

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
];

// router.use('/users', userRoutes);
// router.use('/students', studentRoutes);

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
