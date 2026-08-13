import { z } from 'zod';

export const createRentSchema = z.object({
  body: z.object({
    startingPoint: z.string().min(1),
    destination: z.string().min(1),
    carId: z.string().uuid(),
  }),
});

export const getRentsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export const getRentByIdSchema = z.object({ params: z.object({ id: z.string() }) });

export const updateRentSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({ rentStatus: z.enum(['PENDING', 'ONGOING', 'COMPLETED']) }),
});

export const deleteRentSchema = getRentByIdSchema;
