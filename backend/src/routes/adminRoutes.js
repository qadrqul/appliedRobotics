import express from 'express';
import { authenticateJWT } from '../middlewares/authenticateJWT.js';
import { checkRole } from '../middlewares/checkRole.js';
import * as adminController from '../controllers/adminController.js';


const router = express.Router();

router.get('/users', authenticateJWT, checkRole('admin'), adminController.getUsers);
router.get('/users/:id', authenticateJWT, checkRole('admin'), adminController.getUserById);
router.post('/users', authenticateJWT, checkRole('admin'), adminController.createUser);
router.put('/users/:id', authenticateJWT, checkRole('admin'), adminController.updateUser);
router.delete('/users/:id', authenticateJWT, checkRole('admin'), adminController.deleteUser);

export default router;
