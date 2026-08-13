import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const toNumber = (v?: string, fallback?: number) => (v ? Number(v) : fallback);

export default {
  port: toNumber(process.env.PORT, 5000),
  database_url: process.env.DATABASE_URL,
  env: process.env.NODE_ENV || 'development',
  bcrypt_salt_rounds: toNumber(process.env.BCRYPT_SALT_ROUNDS, 10),
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
  stripe_success_url: process.env.STRIPE_SUCCESS_URL || 'http://localhost:5000/api/v1/payments/success',
  stripe_cancel_url: process.env.STRIPE_CANCEL_URL || 'http://localhost:5000/api/v1/payments/cancel',
};
