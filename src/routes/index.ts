import { Router } from 'express';
import AuthRoutes from '../modules/Auth/auth.route';
import CarRoutes from '../modules/Car/car.route';
import RentRoutes from '../modules/Rent/rent.route';
import BidRoutes from '../modules/Bid/bid.route';
import PaymentRoutes from '../modules/Payment/payment.route';

const router = Router();

const moduleRoutes: { path: string; route: Router }[] = [
  { path: '/auth', route: AuthRoutes },
  { path: '/cars', route: CarRoutes },
  { path: '/rents', route: RentRoutes },
  { path: '/bids', route: BidRoutes },
  { path: '/payments', route: PaymentRoutes },
  // add other module routes here, e.g. { path: '/users', route: UserRoutes }
];

moduleRoutes.forEach((r) => router.use(r.path, r.route));

export default router;
