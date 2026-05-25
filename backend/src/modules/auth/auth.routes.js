import { Router } from 'express';
import { authController } from './auth.controller.js';
const router = Router();
router.post('/api/db/write-user-register', authController.handleRegister);
export default router;
