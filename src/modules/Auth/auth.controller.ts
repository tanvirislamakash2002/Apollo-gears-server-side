import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { AuthService } from './auth.service';
import { cookieOptions } from './auth.utils';

export const AuthController = {
    register: catchAsync(async (req: Request, res: Response) => {
        const payload = req.body;
        const user = await AuthService.registerUser(payload);
        res.status(httpStatus.CREATED).json({ success: true, message: 'User registered', data: user });
    }),

    login: catchAsync(async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const result = await AuthService.loginUser({ email, password });

        // set refresh token as cookie
        res.cookie('refreshToken', result.refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(httpStatus.OK).json({ success: true, message: 'Logged in', data: { user: result.user, accessToken: result.accessToken } });
    }),

    refreshToken: catchAsync(async (req: Request, res: Response) => {
        const token = req.cookies?.refreshToken || req.body.refreshToken;
        if (!token) return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: 'No refresh token provided' });

        const tokens = await AuthService.refreshTokens(token);

        // rotate refresh token cookie
        res.cookie('refreshToken', tokens.refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(httpStatus.OK).json({ success: true, message: 'Token refreshed', data: { accessToken: tokens.accessToken } });
    }),
};