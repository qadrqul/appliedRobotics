import express from 'express';
import { authenticateJWT } from '../middlewares/authenticateJWT.js';
import { checkRole } from '../middlewares/checkRole.js';
import * as logController from '../controllers/logsController.js';

const router = express.Router();

router.get('/logs', authenticateJWT, checkRole('admin'), logController.getLogs);
router.get('/logs/:id', authenticateJWT, checkRole('admin'), logController.getLogById);
router.post('/logs', authenticateJWT, checkRole('admin'), logController.createLog);

export default router;
