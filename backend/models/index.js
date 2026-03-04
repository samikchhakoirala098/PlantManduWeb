const User = require('./User');
const Plant = require('./Plant');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Relationships
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Plant.hasMany(OrderItem, { foreignKey: 'plantId' });
OrderItem.belongsTo(Plant, { foreignKey: 'plantId' });

module.exports = { User, Plant, Order, OrderItem };
