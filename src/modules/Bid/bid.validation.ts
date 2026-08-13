import { z } from 'zod';

export const createBidSchema = z.object({
  body: z.object({
    rentId: z.string().uuid(),
    bidAmount: z.number().positive(),
    driverLocation: z.string().min(1),
  }),
});

export const getBidsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export const getBidByIdSchema = z.object({
  params: z.object({ id: z.string() }),
});

export const updateBidSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    bidStatus: z.enum(['ACCEPTED', 'REJECTED']),
  }),
});
