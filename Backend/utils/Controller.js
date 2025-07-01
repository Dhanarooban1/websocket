import { Redisclient } from '../server.js';

// Cricket players pool
export const CRICKET_PLAYERS = [
  { id: 1, name: 'Virat Kohli', role: 'Batsman', country: 'India' },
  { id: 2, name: 'Rohit Sharma', role: 'Batsman', country: 'India' },
  { id: 3, name: 'MS Dhoni', role: 'Wicket-keeper', country: 'India' },
  { id: 4, name: 'Jasprit Bumrah', role: 'Bowler', country: 'India' },
  { id: 5, name: 'Hardik Pandya', role: 'All-rounder', country: 'India' },
  { id: 6, name: 'KL Rahul', role: 'Batsman', country: 'India' },
  { id: 7, name: 'Ravindra Jadeja', role: 'All-rounder', country: 'India' },
  { id: 8, name: 'Mohammed Shami', role: 'Bowler', country: 'India' },
  { id: 9, name: 'Rishabh Pant', role: 'Wicket-keeper', country: 'India' },
  { id: 10, name: 'Shubman Gill', role: 'Batsman', country: 'India' },
  { id: 11, name: 'Babar Azam', role: 'Batsman', country: 'Pakistan' },
  { id: 12, name: 'Kane Williamson', role: 'Batsman', country: 'New Zealand' },
  { id: 13, name: 'Steve Smith', role: 'Batsman', country: 'Australia' },
  { id: 14, name: 'Jos Buttler', role: 'Wicket-keeper', country: 'England' },
  { id: 15, name: 'Ben Stokes', role: 'All-rounder', country: 'England' },
  { id: 16, name: 'Pat Cummins', role: 'Bowler', country: 'Australia' },
  { id: 17, name: 'Trent Boult', role: 'Bowler', country: 'New Zealand' },
  { id: 18, name: 'David Warner', role: 'Batsman', country: 'Australia' },
  { id: 19, name: 'AB de Villiers', role: 'Batsman', country: 'South Africa' },
  { id: 20, name: 'Kagiso Rabada', role: 'Bowler', country: 'South Africa' },
  { id: 21, name: 'Quinton de Kock', role: 'Wicket-keeper', country: 'South Africa' },
  { id: 22, name: 'Rashid Khan', role: 'Bowler', country: 'Afghanistan' },
  { id: 23, name: 'Glenn Maxwell', role: 'All-rounder', country: 'Australia' },
  { id: 24, name: 'Jonny Bairstow', role: 'Wicket-keeper', country: 'England' },
  { id: 25, name: 'Mitchell Starc', role: 'Bowler', country: 'Australia' },
  { id: 26, name: 'Shakib Al Hasan', role: 'All-rounder', country: 'Bangladesh' },
  { id: 27, name: 'Joe Root', role: 'Batsman', country: 'England' },
  { id: 28, name: 'Eoin Morgan', role: 'Batsman', country: 'England' },
  { id: 29, name: 'Faf du Plessis', role: 'Batsman', country: 'South Africa' },
  { id: 30, name: 'Mohammed Siraj', role: 'Bowler', country: 'India' }
];

// Generate unique room ID
const generateRoomId = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Shuffle array utility
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Create a new room
export const createRoom = async (hostName, hostSocketId) => {
  try {
    const roomId = generateRoomId();
    const room = {
      id: roomId,
      host: {
        name: hostName,
        socketId: hostSocketId,
        isHost: true
      },
      users: [{
        name: hostName,
        socketId: hostSocketId,
        isHost: true,
        team: []
      }],
      status: 'waiting', // waiting, selecting, completed
      availablePlayers: [...CRICKET_PLAYERS],
      turnOrder: [],
      currentPlayerIndex: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    await Redisclient.setex(`room:${roomId}`, 3600, JSON.stringify(room)); // 1 hour expiry
    console.log(`✅ Room created: ${roomId} by ${hostName}`);
    
    return room;
  } catch (error) {
    console.error('❌ Error creating room:', error);
    throw new Error('Failed to create room');
  }
};

// Join an existing room
export const joinRoom = async (roomId, userName, userSocketId) => {
  try {
    const roomData = await Redisclient.get(`room:${roomId}`);
    
    if (!roomData) {
      throw new Error('Room not found');
    }

    const room = JSON.parse(roomData);

    // Check if room is already in selection phase
    if (room.status === 'selecting') {
      throw new Error('Cannot join room - selection already in progress');
    }

    // Check if room is completed
    if (room.status === 'completed') {
      throw new Error('Cannot join room - selection has ended');
    }

    // Check if user is already in room by name (allow same user to rejoin with new socket)
    const existingUserIndex = room.users.findIndex(user => 
      user.name.toLowerCase() === userName.toLowerCase()
    );
    
    if (existingUserIndex !== -1) {
      // Update the existing user's socket ID (handling reconnection)
      room.users[existingUserIndex].socketId = userSocketId;
      
      // If this user is the host, update the host socket ID too
      if (room.users[existingUserIndex].isHost) {
        room.host.socketId = userSocketId;
      }
      
      console.log(`✅ User ${userName} reconnected to room: ${roomId}`);
    } else {
      // Check room capacity (max 6 users for this example)
      if (room.users.length >= 6) {
        throw new Error('Room is full');
      }

      // Add new user to room
      room.users.push({
        name: userName,
        socketId: userSocketId,
        isHost: false,
        team: []
      });
      console.log(`✅ New user ${userName} joined room: ${roomId}`);
    }

    room.updatedAt = Date.now();

    // Save updated room
    await Redisclient.setex(`room:${roomId}`, 3600, JSON.stringify(room));
    
    return room;
  } catch (error) {
    console.error('❌ Error joining room:', error);
    throw error;
  }
};

// Get room details
export const getRoomDetails = async (roomId) => {
  try {
    const roomData = await Redisclient.get(`room:${roomId}`);
    
    if (!roomData) {
      throw new Error('Room not found');
    }

    return JSON.parse(roomData);
  } catch (error) {
    console.error('❌ Error getting room details:', error);
    throw error;
  }
};

// Start team selection
export const startSelection = async (roomId, hostSocketId) => {
  try {
    const roomData = await Redisclient.get(`room:${roomId}`);
    
    if (!roomData) {
      throw new Error('Room not found');
    }

    const room = JSON.parse(roomData);

    // Check if user is host
    if (room.host.socketId !== hostSocketId) {
      throw new Error('Only the room host can start selection');
    }

    // Check if minimum users present (at least 2)
    if (room.users.length < 2) {
      throw new Error('Need at least 2 users to start selection');
    }

    // Check if selection already started
    if (room.status === 'selecting') {
      throw new Error('Selection already in progress');
    }

    // Generate random turn order
    room.turnOrder = shuffleArray([...room.users]);
    room.currentPlayerIndex = 0;
    room.status = 'selecting';
    room.updatedAt = Date.now();

    // Save updated room
    await Redisclient.setex(`room:${roomId}`, 3600, JSON.stringify(room));
    console.log(`✅ Selection started in room: ${roomId}`);
    
    return room;
  } catch (error) {
    console.error('❌ Error starting selection:', error);
    throw error;
  }
};

// Select a player
export const selectPlayer = async (roomId, userSocketId, playerId) => {
  try {
    const roomData = await Redisclient.get(`room:${roomId}`);
    
    if (!roomData) {
      throw new Error('Room not found');
    }

    const room = JSON.parse(roomData);

    // Check if selection is active
    if (room.status !== 'selecting') {
      throw new Error('Selection is not active');
    }

    // Check if it's user's turn
    const currentPlayer = room.turnOrder[room.currentPlayerIndex];
    if (currentPlayer.socketId !== userSocketId) {
      throw new Error('Not your turn');
    }

    // Find the player to select
    const playerIndex = room.availablePlayers.findIndex(p => p.id === playerId);
    if (playerIndex === -1) {
      throw new Error('Player not available');
    }

    const selectedPlayer = room.availablePlayers[playerIndex];

    // Remove player from available pool
    room.availablePlayers.splice(playerIndex, 1);

    // Add player to user's team
    const userIndex = room.users.findIndex(u => u.socketId === userSocketId);
    room.users[userIndex].team.push(selectedPlayer);

    // Move to next player
    room.currentPlayerIndex = (room.currentPlayerIndex + 1) % room.turnOrder.length;
    
    // Check if current round is complete (everyone has selected once this round)
    const maxTeamSize = Math.max(...room.users.map(u => u.team.length));
    const minTeamSize = Math.min(...room.users.map(u => u.team.length));
    
    // If there's a difference in team sizes, continue with current round
    // Otherwise, check if we've reached 5 players per team
    if (maxTeamSize >= 5) {
      room.status = 'completed';
    }

    room.updatedAt = Date.now();

    // Save updated room
    await Redisclient.setex(`room:${roomId}`, 3600, JSON.stringify(room));
    
    return {
      selectedPlayer,
      selectedBy: currentPlayer.name,
      availablePlayers: room.availablePlayers,
      currentPlayerIndex: room.currentPlayerIndex,
      nextPlayer: room.status === 'selecting' ? room.turnOrder[room.currentPlayerIndex] : null,
      userTeams: room.users.map(u => ({
        name: u.name,
        team: u.team,
        isHost: u.isHost
      }))
    };
  } catch (error) {
    console.error('❌ Error selecting player:', error);
    throw error;
  }
};

// Auto-select a player when time runs out
export const autoSelectPlayer = async (roomId, userSocketId) => {
  try {
    const roomData = await Redisclient.get(`room:${roomId}`);
    
    if (!roomData) {
      throw new Error('Room not found');
    }

    const room = JSON.parse(roomData);

    // Check if selection is active
    if (room.status !== 'selecting') {
      throw new Error('Selection is not active');
    }

    // Check if it's still this user's turn
    const currentPlayer = room.turnOrder[room.currentPlayerIndex];
    if (currentPlayer.socketId !== userSocketId) {
      throw new Error('Turn has already passed');
    }

    // Auto-select a random player from available pool
    if (room.availablePlayers.length === 0) {
      throw new Error('No players available for auto-selection');
    }

    const randomIndex = Math.floor(Math.random() * room.availablePlayers.length);
    const selectedPlayer = room.availablePlayers[randomIndex];

    // Use the regular selectPlayer logic
    return await selectPlayer(roomId, userSocketId, selectedPlayer.id);
  } catch (error) {
    console.error('❌ Error in auto-selection:', error);
    throw error;
  }
};

// Check if selection is complete
export const checkSelectionComplete = async (roomId) => {
  try {
    const roomData = await Redisclient.get(`room:${roomId}`);
    
    if (!roomData) {
      throw new Error('Room not found');
    }

    const room = JSON.parse(roomData);

    // Check if all users have 5 players
    const isComplete = room.users.every(user => user.team.length >= 5);

    if (isComplete) {
      room.status = 'completed';
      room.updatedAt = Date.now();
      await Redisclient.setex(`room:${roomId}`, 3600, JSON.stringify(room));
    }

    return {
      complete: isComplete,
      teams: room.users.map(u => ({
        name: u.name,
        team: u.team,
        isHost: u.isHost
      }))
    };
  } catch (error) {
    console.error('❌ Error checking selection completion:', error);
    throw error;
  }
};

// Get users in a room
export const getUsersInRoom = async (roomId) => {
  try {
    const roomData = await Redisclient.get(`room:${roomId}`);
    
    if (!roomData) {
      return [];
    }

    const room = JSON.parse(roomData);
    return room.users;
  } catch (error) {
    console.error('❌ Error getting users in room:', error);
    return [];
  }
};

// Remove user from room
export const removeUserFromRoom = async (roomId, userSocketId) => {
  try {
    const roomData = await Redisclient.get(`room:${roomId}`);
    
    if (!roomData) {
      return;
    }

    const room = JSON.parse(roomData);

    // Find user to remove
    const userToRemove = room.users.find(user => user.socketId === userSocketId);
    if (!userToRemove) {
      console.log(`User with socket ${userSocketId} not found in room ${roomId}`);
      return;
    }

    // Remove user from users array
    room.users = room.users.filter(user => user.socketId !== userSocketId);

    // If the host left, make the first remaining user the host
    if (room.host.socketId === userSocketId && room.users.length > 0) {
      room.users[0].isHost = true;
      room.host = {
        name: room.users[0].name,
        socketId: room.users[0].socketId,
        isHost: true
      };
    }

    // If no users left, delete the room
    if (room.users.length === 0) {
      await Redisclient.del(`room:${roomId}`);
      console.log(`🗑️ Room deleted: ${roomId}`);
      return;
    }

    // Update turn order if selection is in progress
    if (room.status === 'selecting') {
      const disconnectedUserIndex = room.turnOrder.findIndex(user => user.socketId === userSocketId);
      if (disconnectedUserIndex !== -1) {
        room.turnOrder.splice(disconnectedUserIndex, 1);
        
        // Adjust current player index if necessary
        if (room.currentPlayerIndex >= room.turnOrder.length) {
          room.currentPlayerIndex = 0;
        }
        if (room.currentPlayerIndex > disconnectedUserIndex) {
          room.currentPlayerIndex--;
        }
      }
    }

    room.updatedAt = Date.now();

    // Save updated room
    await Redisclient.setex(`room:${roomId}`, 3600, JSON.stringify(room));
    console.log(`✅ User ${userToRemove.name} removed from room: ${roomId}`);
  } catch (error) {
    console.error('❌ Error removing user from room:', error);
  }
};

// Clean up expired rooms
export const cleanupExpiredRooms = async (redisClient) => {
  try {
    const keys = await redisClient.keys('room:*');
    let cleanedCount = 0;

    for (const key of keys) {
      try {
        const roomData = await redisClient.get(key);
        if (roomData) {
          const room = JSON.parse(roomData);
          const now = Date.now();
          const roomAge = now - room.createdAt;
          
          // Delete rooms older than 2 hours or completed rooms older than 30 minutes
          const shouldDelete = roomAge > 2 * 60 * 60 * 1000 || // 2 hours
            (room.status === 'completed' && roomAge > 30 * 60 * 1000); // 30 minutes
          
          if (shouldDelete) {
            await redisClient.del(key);
            cleanedCount++;
            console.log(`🧹 Cleaned up expired room: ${key}`);
          }
        }
      } catch (error) {
        console.error(`❌ Error processing room ${key}:`, error);
        // Delete corrupted room data
        await redisClient.del(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`🧹 Cleanup completed: ${cleanedCount} rooms cleaned`);
    }
  } catch (error) {
    console.error('❌ Error in room cleanup:', error);
  }
};