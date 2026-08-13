import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { PaymentService } from './payment.service';
import { CreatePaymentPayload } from './payment.interface';

export const PaymentController = {
  createCheckoutSession: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const payload = req.body as CreatePaymentPayload;

    const result = await PaymentService.createCheckoutSession(userId, payload);
    res.status(httpStatus.OK).json({ success: true, message: 'Checkout session created', data: result });
  }),

  webhook: catchAsync(async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    const rawBody = req.body as Buffer;

    await PaymentService.handleWebhook(rawBody, Array.isArray(sig) ? sig[0] : sig);
    res.status(httpStatus.OK).json({ success: true, message: 'Webhook received' });
  }),

  getPayments: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const payments = await PaymentService.getPayments(userId);
    res.status(httpStatus.OK).json({ success: true, message: 'Payments retrieved', data: payments });
  }),
};

export default PaymentController;
