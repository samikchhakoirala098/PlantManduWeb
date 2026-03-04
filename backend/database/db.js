const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'samikshya_db', // 1. Database Name 
    process.env.DB_USER || 'postgres',     // 2. Username
    process.env.DB_PASSWORD || 'password', // 3. Password
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false,
    }
);

module.exports = sequelize;