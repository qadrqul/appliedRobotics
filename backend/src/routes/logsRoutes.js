import express from 'express';
import { authenticateJWT } from '../middlewares/authenticateJWT.js';
import * as logController from '../controllers/logsController.js';

const router = express.Router();

router.get('/logs', authenticateJWT, logController.getLogs);
router.get('/logs/:id', authenticateJWT, logController.getLogById);
router.post('/logs', authenticateJWT, logController.createLog);

export default router;
