import { prisma } from '../../lib/prisma';
import { CreateCarPayload, UpdateCarPayload } from './car.interface';

export const CarService = {
  async createCar(payload: CreateCarPayload) {
    const car = await prisma.car.create({ data: payload as any });
    return car;
  },

  async getCars(query: { page?: number; limit?: number; search?: string }) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 10;
    const where: any = { isDeleted: false };
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { brand: { contains: query.search, mode: 'insensitive' } },
        { model: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.car.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.car.count({ where }),
    ]);

    return { data, meta: { page, limit, total } };
  },

  async getCarById(id: string) {
    const car = await prisma.car.findFirst({ where: { id, isDeleted: false } });
    return car;
  },

  async updateCar(id: string, payload: UpdateCarPayload) {
    const car = await prisma.car.update({ where: { id }, data: payload as any });
    return car;
  },

  async deleteCar(id: string) {
    // soft delete
    const car = await prisma.car.update({ where: { id }, data: { isDeleted: true } });
    return car;
  },
};

export default CarService;
