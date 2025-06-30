// Room management service for cricket team selection
import { cricketPlayers } from './playerPool.js';

class RoomManager {
  constructor() {
    this.rooms = new Map();
    this.userRoomMap = new Map(); // Track which room each user is in
  }

  // Generate unique room ID
  generateRoomId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // Create a new room
  createRoom(hostSocketId, hostName) {
    const roomId = this.generateRoomId();
    const room = {
      id: roomId,
      hostId: hostSocketId,
      users: [{
        id: hostSocketId,
        name: hostName,
        isHost: true,
        isReady: true
      }],
      playerPool: cricketPlayers(),
      picks: {},
      turnOrder: [],
      currentTurnIndex: 0,
      gameState: 'waiting', // waiting, active, completed
      turnTimer: null,
      createdAt: new Date(),
      maxPlayers: 6,
      playersPerTeam: 5,
      turnDuration: 10000 // 10 seconds
    };

    this.rooms.set(roomId, room);
    this.userRoomMap.set(hostSocketId, roomId);
    return room;
  }

  // Join existing room
  joinRoom(roomId, socketId, userName) {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.gameState !== 'waiting') {
      throw new Error('Game already in progress');
    }

    if (room.users.length >= room.maxPlayers) {
      throw new Error('Room is full');
    }

    // Check if user already in room
    const existingUser = room.users.find(user => user.id === socketId);
    if (existingUser) {
      return room; // User already in room
    }

    // Add user to room
    room.users.push({
      id: socketId,
      name: userName,
      isHost: false,
      isReady: true
    });

    this.userRoomMap.set(socketId, roomId);
    return room;
  }

  // Get room by ID
  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  // Get room by user socket ID
  getRoomByUser(socketId) {
    const roomId = this.userRoomMap.get(socketId);
    return roomId ? this.rooms.get(roomId) : null;
  }

  // Remove user from room
  removeUser(socketId) {
    const roomId = this.userRoomMap.get(socketId);
    if (!roomId) return null;

    const room = this.rooms.get(roomId);
    if (!room) return null;

    // Remove user from room
    room.users = room.users.filter(user => user.id !== socketId);
    this.userRoomMap.delete(socketId);

    // If host left, make someone else host
    if (room.users.length > 0 && room.hostId === socketId) {
      room.hostId = room.users[0].id;
      room.users[0].isHost = true;
    }

    // If room is empty, delete it
    if (room.users.length === 0) {
      this.rooms.delete(roomId);
      return null;
    }

    return room;
  }

  // Start game
  startGame(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.users.length < 2) {
      throw new Error('Need at least 2 players to start');
    }

    if (room.gameState !== 'waiting') {
      throw new Error('Game already started');
    }

    // Randomize turn order
    room.turnOrder = [...room.users].sort(() => Math.random() - 0.5);
    room.currentTurnIndex = 0;
    room.gameState = 'active';
    room.picks = {};

    // Initialize picks for each user
    room.users.forEach(user => {
      room.picks[user.id] = [];
    });

    return room;
  }

  // Select player
  selectPlayer(roomId, userId, playerId) {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.gameState !== 'active') {
      throw new Error('Game not active');
    }

    const currentUser = room.turnOrder[room.currentTurnIndex];
    if (currentUser.id !== userId) {
      throw new Error('Not your turn');
    }

    // Find and remove player from pool
    const playerIndex = room.playerPool.findIndex(player => player.id === playerId);
    if (playerIndex === -1) {
      throw new Error('Player not available');
    }

    const selectedPlayer = room.playerPool.splice(playerIndex, 1)[0];
    room.picks[userId].push(selectedPlayer);

    // Clear any existing timer
    if (room.turnTimer) {
      clearTimeout(room.turnTimer);
      room.turnTimer = null;
    }

    return { room, selectedPlayer, currentUser };
  }

  // Auto-select player (when timer expires)
  autoSelectPlayer(roomId) {
    const room = this.rooms.get(roomId);
    if (!room || room.gameState !== 'active') {
      return null;
    }

    const currentUser = room.turnOrder[room.currentTurnIndex];
    if (!currentUser || room.playerPool.length === 0) {
      return null;
    }

    // Randomly select a player
    const randomIndex = Math.floor(Math.random() * room.playerPool.length);
    const selectedPlayer = room.playerPool.splice(randomIndex, 1)[0];
    room.picks[currentUser.id].push(selectedPlayer);

    room.turnTimer = null;
    return { room, selectedPlayer, currentUser };
  }

  // Move to next turn
  nextTurn(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    // Check if game is complete
    const allUsersHaveMaxPlayers = room.users.every(user => 
      room.picks[user.id] && room.picks[user.id].length >= room.playersPerTeam
    );

    if (allUsersHaveMaxPlayers) {
      room.gameState = 'completed';
      return { room, gameCompleted: true };
    }

    // Move to next player
    room.currentTurnIndex = (room.currentTurnIndex + 1) % room.turnOrder.length;
    return { room, gameCompleted: false };
  }

  // Get game statistics
  getGameStats(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const stats = {
      roomId: room.id,
      totalPlayers: room.users.length,
      gameState: room.gameState,
      currentRound: Math.floor(
        Object.values(room.picks).reduce((sum, picks) => sum + picks.length, 0) / room.users.length
      ) + 1,
      playersRemaining: room.playerPool.length,
      leaderboard: room.users.map(user => ({
        name: user.name,
        teamSize: room.picks[user.id]?.length || 0,
        teamScore: room.picks[user.id]?.reduce((sum, player) => sum + player.rating, 0) || 0
      })).sort((a, b) => b.teamScore - a.teamScore)
    };

    return stats;
  }

  // Get all rooms (for admin purposes)
  getAllRooms() {
    return Array.from(this.rooms.values()).map(room => ({
      id: room.id,
      players: room.users.length,
      state: room.gameState,
      createdAt: room.createdAt
    }));
  }

  // Clean up old rooms
  cleanupOldRooms(maxAgeMinutes = 60) {
    const cutoffTime = new Date(Date.now() - maxAgeMinutes * 60 * 1000);
    
    for (const [roomId, room] of this.rooms.entries()) {
      if (room.createdAt < cutoffTime && room.gameState === 'completed') {
        // Remove all users from userRoomMap
        room.users.forEach(user => {
          this.userRoomMap.delete(user.id);
        });
        
        // Clear any timers
        if (room.turnTimer) {
          clearTimeout(room.turnTimer);
        }
        
        // Delete room
        this.rooms.delete(roomId);
        console.log(`🧹 Cleaned up old room: ${roomId}`);
      }
    }
  }
}

// Singleton instance
export const roomManager = new RoomManager();

// Auto cleanup every 30 minutes
setInterval(() => {
  roomManager.cleanupOldRooms();
}, 30 * 60 * 1000);
