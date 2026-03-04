const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const sequelize = require('./database/db');
require('./models'); // Load associations

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body);
  next();
});
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/plants', require('./routes/plantRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

app.get('/', (req, res) => {
  res.send('PlantMandu Backend is running');
});

// Database sync and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    // Only Sync in dev/prod, not in every test run unless handled specifically
    if (process.env.NODE_ENV !== 'test') {
      await sequelize.sync({ alter: true });
      console.log('Database synced');
    }
  } catch (err) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Unable to connect to the database:', err.message);
      console.log('Note: Server will still start, but DB-dependent features will fail.');
    }
  }

  if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
};

startServer();

module.exports = app;
