import { roomManager } from '../utils/roomManager.js';
import { successHandler } from '../middleware/responseHandler.js';

// Health check endpoint
export const getHealthStatus = async (req, res) => {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    activeRooms: roomManager.getAllRooms().length,
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development'
  };

  successHandler(res, healthData, 'Service is healthy');
};

// Get server information
export const getServerInfo = async (req, res) => {
  const serverInfo = {
    name: 'Cricket Team Selection Backend',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      rooms: '/api/rooms',
      players: '/api/players',
      websocket: 'Socket.IO enabled'
    },
    features: [
      'Real-time multiplayer rooms',
      'Turn-based player selection',
      'Auto-selection on timeout',
      'Room management',
      'Player statistics',
      'Disconnect handling'
    ]
  };

  successHandler(res, serverInfo, '✅ Cricket Team Selection Backend Running');
};
