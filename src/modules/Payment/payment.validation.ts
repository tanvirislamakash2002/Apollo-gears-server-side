import { z } from 'zod';

export const createPaymentSchema = z.object({
  body: z.object({
    rentId: z.string().uuid(),
    amount: z.number().positive(),
    currency: z.string().length(3).optional(),
  }),
});

export const paymentWebhookSchema = z.object({
  body: z.any().optional(),
});
