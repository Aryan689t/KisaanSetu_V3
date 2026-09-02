import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import bookingRoutes from './routes/booking.route.js';
import queueRoutes from './routes/queue.route.js';
import operatorRoutes from './routes/operator.route.js';
import adminRoutes from './routes/admin.route.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    service: 'KisanSetu Backend REST API',
    status: 'OPERATIONAL',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/operator', operatorRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint '${req.method} ${req.originalUrl}' not found`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

export default app;
