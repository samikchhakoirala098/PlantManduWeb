const request = require('supertest');
const app = require('../index');
const sequelize = require('../database/db');
const { User } = require('../models');

describe('Authentication API', () => {
    beforeAll(async () => {
        // Sync database before tests
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        // Close connection after tests
        await sequelize.close();
    });

    const testUser = {
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        password: 'password123'
    };

    it('should register a new user successfully', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.email).toBe(testUser.email);
    });

    it('should login and return a JWT token', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should return 401 for incorrect password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: 'wrongpassword'
            });

        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Invalid email or password');
    });
});
