import { DataTypes } from 'sequelize';
import sequelize from '../utils/database.js';

const Vehicle = sequelize.define('Vehicle', {
    plateNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    owner: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
});

export default Vehicle;
