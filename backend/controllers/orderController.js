const { Order, OrderItem, Plant, User } = require('../models');

const placeOrder = async (req, res) => {
    const { items, totalAmount, address } = req.body;
    try {
        const order = await Order.create({
            userId: req.user.id,
            totalAmount,
            address,
            status: 'pending',
        });

        for (const item of items) {
            await OrderItem.create({
                orderId: order.id,
                plantId: item.plantId,
                quantity: item.quantity,
                price: item.price,
            });
        }

        res.status(201).json(order);
    } catch (error) {
        console.error('Checkout Error:', error);
        res.status(500).json({ message: error.message });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.user.id },
            include: [{ model: OrderItem, include: [Plant] }],
        });
        res.json(orders);
    } catch (error) {
        console.error('Get My Orders Error:', error);
        res.status(500).json({ message: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                { model: User, attributes: ['username', 'email'] },
                { model: OrderItem, include: [Plant] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(orders);
    } catch (error) {
        console.error('Get All Orders Error:', error);
        res.status(500).json({ message: error.message });
    }
};

const confirmOrder = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (order) {
            order.status = 'confirmed';
            await order.save();
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { placeOrder, getMyOrders, getAllOrders, confirmOrder };
