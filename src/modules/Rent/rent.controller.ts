import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { RentService } from './rent.service';
import { CreateRentPayload } from './rent.interface';

export const RentController = {
  createRent: catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as CreateRentPayload;
    const userId = req.user?.userId as string;
    const rent = await RentService.createRent(userId, payload);
    res.status(httpStatus.CREATED).json({ success: true, message: 'Rent created', data: rent });
  }),

  getRents: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    const result = await RentService.getRents(userId, { page, limit });
    res.status(httpStatus.OK).json({ success: true, message: 'Rents retrieved', meta: result.meta, data: result.data });
  }),

  getRentById: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const { id } = req.params;
    const rent = await RentService.getRentById(userId, id);

    if (!rent) {
      return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Rent not found' });
    }

    res.status(httpStatus.OK).json({ success: true, message: 'Rent retrieved', data: rent });
  }),

  updateRent: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const { id } = req.params;
    const payload = req.body;

    const rent = await RentService.updateRent(userId, id, payload);
    res.status(httpStatus.OK).json({ success: true, message: 'Rent updated', data: rent });
  }),

  deleteRent: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const { id } = req.params;

    await RentService.deleteRent(userId, id);
    res.status(httpStatus.OK).json({ success: true, message: 'Rent deleted' });
  }),
};

export default RentController;
