import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { PaymentController } from './payment.controller';
import { createPaymentSchema, paymentWebhookSchema } from './payment.validation';

const router = express.Router();

router.post('/checkout', auth('USER'), validateRequest(createPaymentSchema), PaymentController.createCheckoutSession);
router.get('/', auth('USER', 'ADMIN'), PaymentController.getPayments);
router.post('/webhook', validateRequest(paymentWebhookSchema), PaymentController.webhook);

export default router;
export { router as PaymentRoutes };
