import Vehicle from '../models/vehicle.js';

const createVehicle = async (req, res) => {
    const { plateNumber, owner, status } = req.body;

    try {
        const vehicle = await Vehicle.create({ plateNumber, owner, status });
        res.status(201).json(vehicle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create vehicle' });
    }
};


const getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.findAll();
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve vehicles' });
    }
};

const getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByPk(req.params.id);
        if (vehicle) {
            res.status(200).json(vehicle);
        } else {
            res.status(404).json({ error: 'Vehicle not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve vehicle' });
    }
};

const updateVehicle = async (req, res) => {
    try {
        const { plateNumber, owner, status, userId } = req.body;
        const vehicle = await Vehicle.findByPk(req.params.id);
        if (vehicle) {
            vehicle.plateNumber = plateNumber || vehicle.plateNumber;
            vehicle.owner = owner || vehicle.owner;
            vehicle.status = status || vehicle.status;
            vehicle.userId = userId || vehicle.userId;
            await vehicle.save();
            res.status(200).json(vehicle);
        } else {
            res.status(404).json({ error: 'Vehicle not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update vehicle' });
    }
};

const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByPk(req.params.id);
        if (vehicle) {
            await vehicle.destroy();
            res.status(200).json({ message: 'Vehicle deleted' });
        } else {
            res.status(404).json({ error: 'Vehicle not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete vehicle' });
    }
};

export { createVehicle, getVehicles, getVehicleById, updateVehicle, deleteVehicle };

