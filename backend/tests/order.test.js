const request = require('supertest');
const app = require('../index');
const sequelize = require('../database/db');
const { Order, OrderItem, Plant, User } = require('../models');
const jwt = require('jsonwebtoken');

describe('Order API', () => {
    let adminToken = '';
    let userToken = '';
    let testPlantId = '';
    let testOrderId = '';

    beforeAll(async () => {
        await sequelize.sync({ force: true });

        // Create an admin user
        const admin = await User.create({
            username: 'admin_order_test',
            email: 'admin_order@example.com',
            password: 'password123',
            role: 'admin'
        });
        adminToken = jwt.sign({ id: admin.id }, process.env.JWT_SECRET || 'secretcode', { expiresIn: '1h' });

        // Create a regular user
        const user = await User.create({
            username: 'user_order_test',
            email: 'user_order@example.com',
            password: 'password123',
            role: 'customer'
        });
        userToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secretcode', { expiresIn: '1h' });

        // Create a plant
        const plant = await Plant.create({
            name: 'Order Test Plant',
            price: '15.00',
            description: 'Test Description',
            category: 'Test Category'
        });
        testPlantId = plant.id;
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it('should place a new order as a customer', async () => {
        const orderData = {
            items: [
                { plantId: testPlantId, quantity: 2, price: 15.00 }
            ],
            totalAmount: 30.00,
            address: '123 Test St'
        };

        const res = await request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${userToken}`)
            .send(orderData);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        testOrderId = res.body.id;
    });

    it('should fetch personal orders for a customer', async () => {
        const res = await request(app)
            .get('/api/orders/myorders')
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should fetch all orders for an admin', async () => {
        const res = await request(app)
            .get('/api/orders')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should confirm an order as an admin', async () => {
        const res = await request(app)
            .put(`/api/orders/${testOrderId}/confirm`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('confirmed');
    });

    it('should return 401 if user is not an admin when fetching all orders', async () => {
        const res = await request(app)
            .get('/api/orders')
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.status).toBe(403); // Middleware usually returns 403 for unauthorized role
    });
});
