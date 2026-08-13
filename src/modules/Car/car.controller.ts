import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { CarService } from './car.service';
import { CreateCarPayload } from './car.interface';

export const CarController = {
  createCar: catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as CreateCarPayload;
    const car = await CarService.createCar(payload);
    res.status(httpStatus.CREATED).json({ success: true, message: 'Car created', data: car });
  }),

  getCars: catchAsync(async (req: Request, res: Response) => {
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const search = req.query.search as string | undefined;
    const result = await CarService.getCars({ page, limit, search });
    res.status(httpStatus.OK).json({ success: true, message: 'Cars retrieved', meta: result.meta, data: result.data });
  }),

  getCarById: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const car = await CarService.getCarById(id);
    if (!car) return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Car not found' });
    res.status(httpStatus.OK).json({ success: true, message: 'Car retrieved', data: car });
  }),

  updateCar: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const car = await CarService.updateCar(id, payload);
    res.status(httpStatus.OK).json({ success: true, message: 'Car updated', data: car });
  }),

  deleteCar: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await CarService.deleteCar(id);
    res.status(httpStatus.OK).json({ success: true, message: 'Car deleted' });
  }),
};

export default CarController;
