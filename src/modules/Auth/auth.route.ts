import express from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { registerSchema, loginSchema, refreshSchema } from './auth.validation';

const router = express.Router();

router.post('/register', validateRequest(registerSchema), AuthController.register);
router.post('/login', validateRequest(loginSchema), AuthController.login);
router.post('/refresh-token', validateRequest(refreshSchema), AuthController.refreshToken);

export default router;
export { router as AuthRoutes };
