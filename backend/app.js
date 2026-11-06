const express = require('express');
const cors = require('cors');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const userRoutes = require('./routes/userRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Health Check Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Restaurant Reservation System API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/restaurant', restaurantRoutes);
app.use('/api/v1/reservation', reservationRoutes);
app.use('/api/v1/admin', adminRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;

