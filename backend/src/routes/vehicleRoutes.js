import express from 'express';
import { authenticateJWT } from '../middlewares/authenticateJWT.js';
import { checkRole } from '../middlewares/checkRole.js';
import * as vehicleController from '../controllers/vehicleController.js';

const router = express.Router();

router.get('/vehicles', authenticateJWT, checkRole('admin'), vehicleController.getVehicles);
router.get('/vehicles/:id', authenticateJWT, checkRole('admin'), vehicleController.getVehicleById);
router.post('/vehicles', authenticateJWT, checkRole('admin'), vehicleController.createVehicle);
router.put('/vehicles/:id', authenticateJWT, checkRole('admin'), vehicleController.updateVehicle);
router.delete('/vehicles/:id', authenticateJWT, checkRole('admin'), vehicleController.deleteVehicle);

export default router;
