const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const gmailRoutes = require('./routes/gmailRoutes');
const { handleGoogleCallback } = require('./controllers/authController');

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
      process.env.FRONTEND_URL,
      'https://gmail-client-api.onrender.com' // Allow self-requests
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow in production
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend folder
const frontendPath = path.join(__dirname, '../../frontend');
app.use(express.static(frontendPath));

// Routes
app.use('/api', authRoutes);
app.use('/api/gmail', gmailRoutes);

// OAuth Callback Routes (before SPA fallback)
app.get('/auth/callback', handleGoogleCallback);

// Serve index.html for all non-API routes (SPA fallback)
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(frontendPath, 'index.html'));
  }
});

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

// Initialize app and start server
async function initializeApp() {
  try {
    // Only initialize Prisma if DATABASE_URL is available
    if (!process.env.DATABASE_URL && NODE_ENV === 'production') {
      console.warn('⚠️  DATABASE_URL not available yet, starting server without database...');
      console.warn('⚠️  Database will be initialized when environment variables are ready');
    } else if (process.env.DATABASE_URL) {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      
      try {
        // Test database connection
        await prisma.$queryRaw`SELECT 1`;
        console.log('✅ Database connected and ready');
      } catch (dbError) {
        console.warn('⚠️  Database not yet available:', dbError.message);
        console.warn('⚠️  Will retry when database is ready');
      } finally {
        await prisma.$disconnect();
      }
    }

    // Start the server regardless of database status
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`🌐 Environment: ${NODE_ENV}`);
      startTokenRefreshService();
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Start the application
initializeApp();
