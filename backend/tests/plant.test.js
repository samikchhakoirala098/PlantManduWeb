const request = require('supertest');
const app = require('../index');
const sequelize = require('../database/db');
const { Plant, User } = require('../models');
const jwt = require('jsonwebtoken');

describe('Plant CRUD API', () => {
    let adminToken = '';
    let testPlantId = '';

    beforeAll(async () => {
        await sequelize.sync({ force: true });

        // Create an admin user for token
        const admin = await User.create({
            username: 'admin_test',
            email: 'admin_test@example.com',
            password: 'password123',
            role: 'admin'
        });

        adminToken = jwt.sign({ id: admin.id }, process.env.JWT_SECRET || 'secretcode', { expiresIn: '1h' });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it('should create a new plant as admin', async () => {
        const res = await request(app)
            .post('/api/plants')
            .set('Authorization', `Bearer ${adminToken}`)
            .field('name', 'Test Plant')
            .field('price', '20.50')
            .field('description', 'Test Description')
            .field('category', 'Test Category');

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        testPlantId = res.body.id;
    });

    it('should fetch all plants', async () => {
        const res = await request(app).get('/api/plants');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should fetch a single plant by id', async () => {
        const res = await request(app).get(`/api/plants/${testPlantId}`);
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Test Plant');
    });

    it('should update a plant as admin', async () => {
        const res = await request(app)
            .put(`/api/plants/${testPlantId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Updated Plant' });

        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Updated Plant');
    });

    it('should delete a plant as admin', async () => {
        const res = await request(app)
            .delete(`/api/plants/${testPlantId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Plant removed');
    });
});
