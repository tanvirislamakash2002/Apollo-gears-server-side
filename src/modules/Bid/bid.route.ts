import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BidController } from './bid.controller';
import { createBidSchema, getBidByIdSchema, getBidsSchema, updateBidSchema } from './bid.validation';

const router = express.Router();

router.post('/', auth('DRIVER'), validateRequest(createBidSchema), BidController.createBid);
router.get('/', auth('ADMIN', 'USER', 'DRIVER'), validateRequest(getBidsSchema), BidController.getBids);
router.get('/:id', auth('ADMIN', 'USER', 'DRIVER'), validateRequest(getBidByIdSchema), BidController.getBidById);
router.patch('/:id', auth('USER'), validateRequest(updateBidSchema), BidController.updateBidStatus);

export default router;
export { router as BidRoutes };
