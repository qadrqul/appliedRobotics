import express from 'express';
import { authenticateJWT } from '../middlewares/authenticateJWT.js';
import * as userController from '../controllers/userController.js';

const router = express.Router();

router.put('/users/:id/password', authenticateJWT, userController.updatePassword);

export default router;
