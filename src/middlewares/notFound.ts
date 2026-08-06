import { Request, Response } from 'express';
import httpStatus from 'http-status';

const notFound = (req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'API Not Found',
    error: {
      path: req.originalUrl,
      message: 'Your requested URL was not found on this server!',
    },
  });
};

export default notFound;
