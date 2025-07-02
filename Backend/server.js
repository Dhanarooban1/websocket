import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import Redis from 'ioredis';

import { errorHandler } from './middleware/responseHandler.js';

import { setupSocket } from './socket/socketController.js';


dotenv.config();

const app = express();
const server = http.createServer(app);

const Redisclient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379,
  username: process.env.REDIS_USERNAME || 'default',
  password: process.env.REDIS_PASSWORD,
});

Redisclient.on('connect', () => console.log('✅ Redis connected'));
Redisclient.on('error', (err) => console.error('❌ Redis error:', err));


// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || [
    "http://localhost:3000", 
    "http://localhost:5173", 
    "http://localhost:5174",
    "https://websocket-gules.vercel.app"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));



app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to the Cricket Team Selection API'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    status: 'error',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Global error handler
app.use(errorHandler);

// Setup Socket.IO
const io = setupSocket(server);

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`🛑 ${signal} received, shutting down gracefully`);
  server.close(() => {
    console.log('💤 Process terminated');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

server.listen(PORT, () => {
  console.log('🚀 Cricket Team Selection Backend Started!');
  console.log(`🚀 Server: http://${HOST}:${PORT}`);
  console.log(`🔌 Socket.IO: WebSocket connections enabled`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Start cleanup interval - run every 10 minutes
  console.log('🧹 Room cleanup service started');
});

export { app, server, io , Redisclient }; 
