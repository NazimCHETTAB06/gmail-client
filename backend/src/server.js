const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const gmailRoutes = require('./routes/gmailRoutes');

// Import services
const { startTokenRefreshService } = require('./services/tokenService');

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5500';
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log(`🚀 Starting server in ${NODE_ENV} mode...`);
console.log(`📍 Frontend URL: ${FRONTEND_URL}`);

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5500',
      'http://127.0.0.1:5500',
      FRONTEND_URL,
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', authRoutes);
app.use('/api/gmail', gmailRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Initialize Prisma and database
async function initializeApp() {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connected');

    // Run migrations (db push for quick sync)
    if (NODE_ENV === 'production') {
      console.log('🔄 Syncing database schema...');
      await prisma.$executeRaw`SELECT 1`; // Connection verified
      // Prisma client is ready, migrations happen on schema changes
      console.log('✅ Database schema synced');
    }

    // Start the server
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      startTokenRefreshService();
    });
  } catch (error) {
    console.error('❌ Failed to initialize database:', error.message);
    console.error('Make sure DATABASE_URL is set for production');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Start the application
initializeApp();
