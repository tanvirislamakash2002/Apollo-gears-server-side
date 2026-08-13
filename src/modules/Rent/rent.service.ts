import { prisma } from '../../lib/prisma';
import { CreateRentPayload, UpdateRentPayload } from './rent.interface';
import AppError from '../../errors/AppError';

export const RentService = {
  async createRent(userId: string, payload: CreateRentPayload) {
    // ensure car exists
    const car = await prisma.car.findFirst({ where: { id: payload.carId, isDeleted: false } });
    if (!car) throw new AppError(404, 'Car not found');

    const rent = await prisma.rent.create({ data: { ...payload, userId: userId } as any });
    return rent;
  },

  async getRents(userId: string, query: { page?: number; limit?: number }) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 10;

    const [data, total] = await Promise.all([
      prisma.rent.findMany({
        where: { userId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.rent.count({ where: { userId } }),
    ]);

    return { data, meta: { page, limit, total } };
  },

  async getRentById(userId: string, id: string) {
    const rent = await prisma.rent.findFirst({ where: { id, userId } });
    return rent;
  },

  async updateRent(userId: string, id: string, payload: UpdateRentPayload) {
    const rent = await prisma.rent.findUnique({ where: { id } });
    if (!rent) throw new AppError(404, 'Rent not found');
    if (rent.userId !== userId) throw new AppError(403, 'Not allowed to update this rent');

    const updated = await prisma.rent.update({ where: { id }, data: payload as any });
    return updated;
  },

  async deleteRent(userId: string, id: string) {
    const rent = await prisma.rent.findUnique({ where: { id } });
    if (!rent) throw new AppError(404, 'Rent not found');
    if (rent.userId !== userId) throw new AppError(403, 'Not allowed to delete this rent');

    await prisma.rent.delete({ where: { id } });
    return;
  },
};

export default RentService;
