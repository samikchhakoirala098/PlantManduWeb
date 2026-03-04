const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const OrderItem = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    orderId: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    plantId: {
        type: DataTypes.UUID,
        allowNull: true,
    }
});

module.exports = OrderItem;
