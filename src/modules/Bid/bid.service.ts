import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';
import { CreateBidPayload, UpdateBidStatusPayload } from './bid.interface';

export const BidService = {
  async createBid(driverId: string, payload: CreateBidPayload) {
    const driver = await prisma.user.findUnique({ where: { id: driverId } });
    if (!driver || driver.role !== 'DRIVER') {
      throw new AppError(403, 'Only drivers can place bids');
    }

    const rent = await prisma.rent.findUnique({ where: { id: payload.rentId } });
    if (!rent) {
      throw new AppError(404, 'Rent not found');
    }

    if (rent.rentStatus !== 'PENDING') {
      throw new AppError(400, 'Only pending rents accept bids');
    }

    const existingBid = await prisma.bid.findFirst({
      where: {
        rentId: payload.rentId,
        driverId,
      },
    });

    if (existingBid) {
      throw new AppError(400, 'You already placed a bid for this rent');
    }

    return prisma.bid.create({
      data: {
        bidAmount: payload.bidAmount,
        driverLocation: payload.driverLocation,
        rentId: payload.rentId,
        driverId,
        bidStatus: 'PENDING',
      },
    });
  },

  async getBids(userId: string, role: string, query: { page?: number; limit?: number }) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 10;

    let where: any = {};

    if (role === 'DRIVER') {
      where.driverId = userId;
    }

    if (role === 'USER') {
      where.rent = {
        userId,
      };
    }

    const [data, total] = await Promise.all([
      prisma.bid.findMany({
        where,
        include: {
          rent: true,
          driver: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.bid.count({ where }),
    ]);

    return { data, meta: { page, limit, total } };
  },

  async getBidById(userId: string, role: string, id: string) {
    let where: any = { id };

    if (role === 'DRIVER') {
      where.driverId = userId;
    }

    if (role === 'USER') {
      where.rent = { userId };
    }

    return prisma.bid.findFirst({
      where,
      include: {
        rent: true,
        driver: true,
      },
    });
  },

  async updateBidStatus(userId: string, id: string, payload: UpdateBidStatusPayload) {
    const bid = await prisma.bid.findUnique({
      where: { id },
      include: { rent: true },
    });

    if (!bid) {
      throw new AppError(404, 'Bid not found');
    }

    if (bid.rent.userId !== userId) {
      throw new AppError(403, 'You can only update bids for your own rent');
    }

    if (payload.bidStatus === 'ACCEPTED') {
      if (bid.rent.rentStatus !== 'PENDING') {
        throw new AppError(400, 'This rent is no longer pending');
      }

      const result = await prisma.$transaction(async (tx) => {
        await tx.bid.updateMany({
          where: { rentId: bid.rentId, id: { not: id } },
          data: { bidStatus: 'REJECTED' },
        });

        const acceptedBid = await tx.bid.update({
          where: { id },
          data: { bidStatus: 'ACCEPTED' },
        });

        await tx.rent.update({
          where: { id: bid.rentId },
          data: { rentStatus: 'ONGOING' },
        });

        return acceptedBid;
      });

      return result;
    }

    if (payload.bidStatus === 'REJECTED') {
      return prisma.bid.update({
        where: { id },
        data: { bidStatus: 'REJECTED' },
      });
    }

    return bid;
  },
};

export default BidService;
