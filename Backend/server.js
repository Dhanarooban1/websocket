import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';

import { errorHandler } from './middleware/responseHandler.js';
import asyncHandler from './middleware/asyncHandler.js';
import { getServerInfo } from './controllers/systemController.js';

import { setupSocket } from './socket/socketHandler.js';
import apiRoutes from './routes/api.js';

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || ["http://localhost:3000", "http://localhost:5173"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', asyncHandler(getServerInfo));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    status: 'error',
    message: `Route ${req.method} ${req.path} not found`,
    availableRoutes: {
      'GET /': 'Server information',
      'GET /api/health': 'Health check',
      'GET /api/rooms': 'List all rooms',
      'GET /api/players': 'Get all players',
      'WebSocket': 'Real-time game events'
    }
  });
});

// Global error handler
app.use(errorHandler);

// Setup Socket.IO
const io = setupSocket(server);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('💤 Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('💤 Process terminated');
    process.exit(0);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

server.listen(PORT, () => {
  console.log('🏏 ===============================================');
  console.log('🚀 Cricket Team Selection Backend Started!');
  console.log('🏏 ===============================================');
  console.log(`� Server: http://${HOST}:${PORT}`);
  console.log(`🔌 Socket.IO: WebSocket connections enabled`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 API Documentation:`);
  console.log(`   - Health Check: http://${HOST}:${PORT}/api/health`);
  console.log(`   - Rooms API: http://${HOST}:${PORT}/api/rooms`);
  console.log(`   - Players API: http://${HOST}:${PORT}/api/players`);
  console.log('🏏 ===============================================');
});

export { app, server, io };
