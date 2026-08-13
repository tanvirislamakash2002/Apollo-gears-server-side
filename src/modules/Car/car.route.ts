import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { CarController } from './car.controller';
import { createCarSchema, getCarsSchema, getCarByIdSchema, updateCarSchema, deleteCarSchema } from './car.validation';

const router = express.Router();

// Public
router.get('/', validateRequest(getCarsSchema), CarController.getCars);
router.get('/:id', validateRequest(getCarByIdSchema), CarController.getCarById);

// Admin only
router.post('/', auth('ADMIN'), validateRequest(createCarSchema), CarController.createCar);
router.patch('/:id', auth('ADMIN'), validateRequest(updateCarSchema), CarController.updateCar);
router.delete('/:id', auth('ADMIN'), validateRequest(deleteCarSchema), CarController.deleteCar);

export default router;
export { router as CarRoutes };
