import { DataTypes } from 'sequelize';
import sequelize from '../utils/database.js';

const Logs = sequelize.define('Logs', {
    plateNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('entered', 'exited'),
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
});

export default Logs;
