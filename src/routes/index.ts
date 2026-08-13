import { Router } from 'express';
import AuthRoutes from '../modules/Auth/auth.route';
import CarRoutes from '../modules/Car/car.route';

const router = Router();

const moduleRoutes: { path: string; route: Router }[] = [
  { path: '/auth', route: AuthRoutes },
  { path: '/cars', route: CarRoutes },
  // add other module routes here, e.g. { path: '/users', route: UserRoutes }
];

moduleRoutes.forEach((r) => router.use(r.path, r.route));

export default router;
