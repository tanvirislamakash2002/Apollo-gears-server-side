import bcrypt from 'bcrypt';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from './auth.utils';

export const AuthService = {
    async registerUser(payload: { email: string; password?: string; name?: string }) {
        const { email, password, name } = payload;

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) throw new AppError(409, 'Email already registered');

        const hashed = password ? await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUND ?? 10)) : undefined;

        const user = await prisma.user.create({
            data: {
                email,
                password: hashed,
                name,
            },
        });

        // remove password before returning
        // @ts-ignore - runtime strip
        if (user && 'password' in user) delete (user as any).password;
        return user;
    },

    async loginUser(payload: { email: string; password: string }) {
        const { email, password } = payload;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) throw new AppError(401, 'Invalid credentials');

        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new AppError(401, 'Invalid credentials');

        const accessToken = signAccessToken({ userId: user.id, role: user.role });
        const refreshToken = signRefreshToken({ userId: user.id, role: user.role });

        // hide password
        // @ts-ignore
        delete (user as any).password;

        return { user, accessToken, refreshToken };
    },

    async refreshTokens(refreshToken: string) {
        try {
            const payload = verifyRefreshToken(refreshToken) as { userId: string; role: string };
            const accessToken = signAccessToken({ userId: payload.userId, role: payload.role });
            const newRefreshToken = signRefreshToken({ userId: payload.userId, role: payload.role });
            return { accessToken, refreshToken: newRefreshToken };
        } catch (err) {
            throw new AppError(401, 'Invalid refresh token');
        }
    },
};