import { z } from 'zod';

const fuelEnum = z.enum(['OCTANE', 'HYBRID', 'ELECTRIC', 'DIESEL', 'PETROL']);
const conditionEnum = z.enum(['NEW', 'USED']);

export const createCarSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    brand: z.string().min(1),
    model: z.string().min(1),
    image: z.string().url().optional(),
    fuelType: fuelEnum,
    passengerCapacity: z.number().int().positive(),
    color: z.string().min(1),
    condition: conditionEnum,
    rating: z.number().optional(),
  }),
});

export const updateCarSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    brand: z.string().min(1).optional(),
    model: z.string().min(1).optional(),
    image: z.string().url().optional(),
    fuelType: fuelEnum.optional(),
    passengerCapacity: z.number().int().positive().optional(),
    color: z.string().min(1).optional(),
    condition: conditionEnum.optional(),
    rating: z.number().optional(),
  }),
  params: z.object({ id: z.string() }),
});

export const getCarsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
  }),
});

export const getCarByIdSchema = z.object({ params: z.object({ id: z.string() }) });

export const deleteCarSchema = getCarByIdSchema;
