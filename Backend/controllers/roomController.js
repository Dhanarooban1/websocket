import { roomManager } from '../utils/roomManager.js';
import { successHandler } from '../middleware/responseHandler.js';

// Get all available rooms (for lobby/discovery)
export const getAllRooms = async (req, res) => {
  const rooms = roomManager.getAllRooms();
  successHandler(res, rooms, 'Rooms retrieved successfully');
};

// Get specific room details
export const getRoomById = async (req, res) => {
  const { roomId } = req.params;
  const room = roomManager.getRoom(roomId);
  
  if (!room) {
    return res.status(404).json({
      status: 'error',
      message: 'Room not found'
    });
  }

  // Return safe room data (without sensitive info)
  const safeRoomData = {
    id: room.id,
    users: room.users.map(user => ({
      name: user.name,
      isHost: user.isHost,
      isReady: user.isReady
    })),
    gameState: room.gameState,
    maxPlayers: room.maxPlayers,
    playersPerTeam: room.playersPerTeam,
    availablePlayersCount: room.playerPool.length
  };

  successHandler(res, safeRoomData, 'Room details retrieved successfully');
};

// Get game statistics for a room
export const getRoomStats = async (req, res) => {
  const { roomId } = req.params;
  const stats = roomManager.getGameStats(roomId);
  
  if (!stats) {
    return res.status(404).json({
      status: 'error',
      message: 'Room not found'
    });
  }

  successHandler(res, stats, 'Game statistics retrieved successfully');
};
