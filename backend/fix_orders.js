const sequelize = require('./database/db');
require('./models'); // Ensure associations are loaded

async function syncAndFix() {
    try {
        console.log('Syncing database schema...');
        await sequelize.sync({ alter: true });
        console.log('Schema synced.');

        const { Order, OrderItem, User, Plant } = require('./models');
        const admin = await User.findOne({ where: { email: 'admin@plantmandu.com' } });
        const customer = await User.findOne({ where: { role: 'customer' } });
        const plant = await Plant.findOne();

        const targetUser = customer || admin;

        if (!targetUser) {
            console.log('No user found to link orders to.');
            process.exit(0);
        }

        // 1. Fix Orders
        const orders = await Order.findAll();
        for (const order of orders) {
            if (!order.userId) {
                order.userId = targetUser.id;
                await order.save();
                console.log(`Linked order ${order.id} to user ${targetUser.email}`);
            }
        }

        // 2. Fix OrderItems
        // We need to check if they have orderId and plantId
        const items = await OrderItem.findAll();
        for (const item of items) {
            let changed = false;
            if (!item.orderId && orders.length > 0) {
                item.orderId = orders[0].id; // Link to first order if missing
                changed = true;
            }
            if (!item.plantId && plant) {
                item.plantId = plant.id; // Link to first plant if missing
                changed = true;
            }
            if (changed) {
                await item.save();
                console.log(`Linked OrderItem ${item.id}`);
            }
        }

        console.log('Comprehensive fix complete.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

syncAndFix();
