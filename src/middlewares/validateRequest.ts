import { ZodObject } from 'zod';
import { Request, Response, NextFunction, RequestHandler } from 'express';

const validateRequest = (schema: ZodObject<any>): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse({ body: req.body, query: req.query, params: req.params });
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default validateRequest;
