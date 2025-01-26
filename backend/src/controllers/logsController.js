import Logs from '../models/logs.js';

const createLog = async (req, res) => {
    try {
        const { plateNumber, status } = req.body;
        const log = await Logs.create({ plateNumber, status });
        res.status(201).json(log);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create log' });
    }
};

const getLogs = async (req, res) => {
    try {
        const logs = await Logs.findAll();
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve logs' });
    }
};

const getLogById = async (req, res) => {
    try {
        const log = await Logs.findByPk(req.params.id);
        if (log) {
            res.status(200).json(log);
        } else {
            res.status(404).json({ error: 'Log not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve log' });
    }
};

export { createLog, getLogs, getLogById };

