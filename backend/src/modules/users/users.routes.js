import { Router } from 'express';
import { usersController } from './users.controller.js';
const router = Router();
router.post('/api/db/write-user-update', usersController.handleUpdateUser);
router.post('/api/db/write-financial-settings', usersController.handleUpdateFinancialSettings);
export default router;
