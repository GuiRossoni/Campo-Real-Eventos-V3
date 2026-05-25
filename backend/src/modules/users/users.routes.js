import { Router } from 'express';
import { usersController } from './users.controller.js';
const router = Router();
router.post('/api/db/write-user-update', usersController.handleUpdateUser);
export default router;
