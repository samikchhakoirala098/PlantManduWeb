const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const isTestEnvironment = process.env.NODE_ENV === 'test';
console.log(`Running in ${isTestEnvironment ? 'TEST' : 'DEVELOPMENT'} mode.`);

const sequelize = new Sequelize(
    isTestEnvironment ? (process.env.TEST_DB_NAME || 'samikshya_test_db') : (process.env.DB_NAME || 'samikshya_db'),
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'password',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false,
    }
);

module.exports = sequelize;