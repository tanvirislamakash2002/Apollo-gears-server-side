import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';

const auth = (...requiredRoles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // Check if token is provided
    if (!token) {
      throw new AppError(401, 'You are not authorized!');
    }

    // Extract Bearer token if prefix is present
    const tokenString = token.startsWith('Bearer ') ? token.split(' ')[1] : token;

    let decoded: JwtPayload;
    try {
      // Verify JWT token using secret from config
      decoded = jwt.verify(
        tokenString,
        config.jwt_access_secret as string
      ) as JwtPayload;
    } catch (error) {
      throw new AppError(401, 'Unauthorized access!');
    }

    const { role } = decoded;

    // Check if role matches allowed roles if roles are provided
    if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
      throw new AppError(403, 'You have no access to this route!');
    }

    // Attach decoded user payload to req.user
    req.user = decoded;

    next();
  });
};

export default auth;
