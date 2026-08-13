import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { BidService } from './bid.service';
import { CreateBidPayload } from './bid.interface';

export const BidController = {
  createBid: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const payload = req.body as CreateBidPayload;

    const bid = await BidService.createBid(userId, payload);
    res.status(httpStatus.CREATED).json({ success: true, message: 'Bid placed', data: bid });
  }),

  getBids: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const role = req.user?.role as string;
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    const result = await BidService.getBids(userId, role, { page, limit });
    res.status(httpStatus.OK).json({ success: true, message: 'Bids retrieved', meta: result.meta, data: result.data });
  }),

  getBidById: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const role = req.user?.role as string;
    const { id } = req.params;

    const bid = await BidService.getBidById(userId, role, id);
    if (!bid) {
      return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Bid not found' });
    }

    res.status(httpStatus.OK).json({ success: true, message: 'Bid retrieved', data: bid });
  }),

  updateBidStatus: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const { id } = req.params;
    const payload = req.body;

    const bid = await BidService.updateBidStatus(userId, id, payload);
    res.status(httpStatus.OK).json({ success: true, message: 'Bid updated', data: bid });
  }),
};

export default BidController;
