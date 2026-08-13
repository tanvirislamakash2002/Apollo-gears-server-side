import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { RentController } from './rent.controller';
import { createRentSchema, deleteRentSchema, getRentByIdSchema, getRentsSchema, updateRentSchema } from './rent.validation';

const router = express.Router();

router.post('/', auth('ADMIN', 'USER', 'DRIVER'), validateRequest(createRentSchema), RentController.createRent);
router.get('/', auth('ADMIN', 'USER', 'DRIVER'), validateRequest(getRentsSchema), RentController.getRents);
router.get('/:id', auth('ADMIN', 'USER', 'DRIVER'), validateRequest(getRentByIdSchema), RentController.getRentById);
router.patch('/:id', auth('ADMIN', 'USER', 'DRIVER'), validateRequest(updateRentSchema), RentController.updateRent);
router.delete('/:id', auth('ADMIN', 'USER', 'DRIVER'), validateRequest(deleteRentSchema), RentController.deleteRent);

export default router;
export { router as RentRoutes };
