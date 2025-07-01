import { Server } from 'socket.io';
import { 
  createRoom, 
  joinRoom, 
  getRoomDetails, 
  startSelection, 
  selectPlayer, 
  autoSelectPlayer,
  checkSelectionComplete,
  getUsersInRoom,
  removeUserFromRoom
} from '../utils/Controller.js';

export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || [
        "http://localhost:3000", 
        "http://localhost:5173",
        "http://localhost:5174",
        "https://websocket-gules.vercel.app"
      ],
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  // Store active timers for auto-selection
  const selectionTimers = new Map();

  io.on('connection', (socket) => {
    console.log(`👤 User connected: ${socket.id}`);

    // Handle room creation
    socket.on('create-room', async (data, callback) => {
      try {
        const { userName } = data;
        
        if (!userName?.trim()) {
          return callback({ success: false, error: 'User name is required' });
        }

        const roomData = await createRoom(userName, socket.id);
        
        // Join the socket room
        await socket.join(roomData.roomId);
        
        console.log(`🏠 Room created: ${roomData.roomId} by ${userName}`);
        
        callback({ 
          success: true, 
          roomId: roomData.roomId,
          room: roomData
        });

        // Emit room update to all users in the room (including the host)
        console.log(`📢 Broadcasting room creation to room ${roomData.roomId}, users count: ${roomData.users.length}`);
        io.to(roomData.roomId).emit('room-updated', roomData);
        
      } catch (error) {
        console.error('❌ Error creating room:', error);
        callback({ success: false, error: error.message });
      }
    });

    // Handle joining room
    socket.on('join-room', async (data, callback) => {
      try {
        const { roomId, userName } = data;
        
        if (!roomId?.trim() || !userName?.trim()) {
          return callback({ success: false, error: 'Room ID and user name are required' });
        }

        const roomData = await joinRoom(roomId, userName, socket.id);
        
        // Join the socket room
        await socket.join(roomId);
        
        console.log(`👥 ${userName} joined room: ${roomId}`);
        
        callback({ 
          success: true, 
          room: roomData
        });

        // Notify all users in the room about the updated room state
        console.log(`📢 Broadcasting room update to room ${roomId}, users count: ${roomData.users.length}`);
        io.to(roomId).emit('room-updated', roomData);
        io.to(roomId).emit('user-joined', { 
          userName, 
          message: `${userName} joined the room!` 
        });
        
      } catch (error) {
        console.error('❌ Error joining room:', error);
        callback({ success: false, error: error.message });
      }
    });

    // Handle starting selection
    socket.on('start-selection', async (data, callback) => {
      try {
        const { roomId } = data;
        
        if (!roomId?.trim()) {
          return callback({ success: false, error: 'Room ID is required' });
        }

        const roomData = await startSelection(roomId, socket.id);
        
        console.log(`🎯 Selection started in room: ${roomId}`);
        
        callback({ success: true });

        // Notify all users that selection has started
        io.to(roomId).emit('selection-started', {
          turnOrder: roomData.turnOrder,
          currentPlayerIndex: roomData.currentPlayerIndex,
          currentPlayer: roomData.turnOrder[0],
          availablePlayers: roomData.availablePlayers
        });

        // Start the first turn timer
        startTurnTimer(roomId, roomData.turnOrder[0]);
        
      } catch (error) {
        console.error('❌ Error starting selection:', error);
        callback({ success: false, error: error.message });
      }
    });

    // Handle player selection
    socket.on('select-player', async (data, callback) => {
      try {
        const { roomId, playerId } = data;
        
        if (!roomId?.trim() || !playerId) {
          return callback({ success: false, error: 'Room ID and player ID are required' });
        }

        const result = await selectPlayer(roomId, socket.id, playerId);
        
        // Clear any existing timer for this room
        clearTurnTimer(roomId);
        
        console.log(`⚡ Player selected in room ${roomId}: ${result.selectedPlayer.name}`);
        
        callback({ success: true });

        // Notify all users about the selection
        io.to(roomId).emit('player-selected', {
          selectedPlayer: result.selectedPlayer,
          selectedBy: result.selectedBy,
          availablePlayers: result.availablePlayers,
          currentPlayerIndex: result.currentPlayerIndex,
          nextPlayer: result.nextPlayer,
          userTeams: result.userTeams
        });

        // Check if selection is complete
        const isComplete = await checkSelectionComplete(roomId);
        if (isComplete.complete) {
          console.log(`🏆 Selection completed in room: ${roomId}`);
          io.to(roomId).emit('selection-ended', {
            finalTeams: isComplete.teams,
            message: 'Team selection completed!'
          });
        } else if (result.nextPlayer) {
          // Start timer for next player
          startTurnTimer(roomId, result.nextPlayer);
        }
        
      } catch (error) {
        console.error('❌ Error selecting player:', error);
        callback({ success: false, error: error.message });
      }
    });

    // Handle getting room details
    socket.on('get-room-details', async (data, callback) => {
      try {
        const { roomId } = data;
        
        if (!roomId?.trim()) {
          return callback({ success: false, error: 'Room ID is required' });
        }

        const roomData = await getRoomDetails(roomId);
        callback({ success: true, room: roomData });
        
      } catch (error) {
        console.error('❌ Error getting room details:', error);
        callback({ success: false, error: error.message });
      }
    });

    // Handle room sync request - helps fix state inconsistencies
    socket.on('sync-room', async (data, callback) => {
      try {
        const { roomId } = data;
        
        if (!roomId?.trim()) {
          return callback({ success: false, error: 'Room ID is required' });
        }

        const roomData = await getRoomDetails(roomId);
        
        // Join the socket room if not already joined
        if (!socket.rooms.has(roomId)) {
          await socket.join(roomId);
        }
        
        callback({ success: true, room: roomData });
        
        // Don't emit room-updated for sync requests to avoid spam notifications
        // Only return the data in the callback
        
      } catch (error) {
        console.error('❌ Error syncing room:', error);
        callback({ success: false, error: error.message });
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      try {
        console.log(`👤 User disconnected: ${socket.id}`);
        
        // Get all rooms this socket was in
        const rooms = Array.from(socket.rooms).filter(room => room !== socket.id);
        
        for (const roomId of rooms) {
          try {
            const users = await getUsersInRoom(roomId);
            const disconnectedUser = users.find(user => user.socketId === socket.id);
            
            if (disconnectedUser) {
              await removeUserFromRoom(roomId, socket.id);
              
              // Clear any timer for this user
              clearTurnTimer(roomId);
              
              // Notify other users
              socket.to(roomId).emit('user-disconnected', {
                userName: disconnectedUser.name,
                message: `${disconnectedUser.name} has left the room`
              });

              // Get updated room data and notify remaining users
              const updatedRoom = await getRoomDetails(roomId);
              if (updatedRoom && updatedRoom.users.length > 0) {
                console.log(`📢 Broadcasting disconnect update to room ${roomId}, remaining users: ${updatedRoom.users.length}`);
                io.to(roomId).emit('room-updated', updatedRoom);
              }
            }
          } catch (error) {
            console.error(`❌ Error handling disconnect for room ${roomId}:`, error);
          }
        }
      } catch (error) {
        console.error('❌ Error handling disconnect:', error);
      }
    });

    // Auto-selection timer functions
    const startTurnTimer = (roomId, currentPlayer) => {
      // Clear existing timer if any
      clearTurnTimer(roomId);
      
      console.log(`⏰ Starting 10s timer for ${currentPlayer.name} in room ${roomId}`);
      
      // Notify users about the timer
      io.to(roomId).emit('turn-timer-started', {
        currentPlayer: currentPlayer,
        timeLimit: 10000 // 10 seconds in milliseconds
      });
      
      const timer = setTimeout(async () => {
        try {
          console.log(`⏰ Auto-selecting for ${currentPlayer.name} in room ${roomId}`);
          
          const result = await autoSelectPlayer(roomId, currentPlayer.socketId);
          
          // Notify all users about auto-selection
          io.to(roomId).emit('auto-selected', {
            selectedPlayer: result.selectedPlayer,
            selectedBy: result.selectedBy,
            availablePlayers: result.availablePlayers,
            currentPlayerIndex: result.currentPlayerIndex,
            nextPlayer: result.nextPlayer,
            userTeams: result.userTeams,
            message: `Time's up! Auto-selected ${result.selectedPlayer.name} for ${currentPlayer.name}`
          });

          // Check if selection is complete
          const isComplete = await checkSelectionComplete(roomId);
          if (isComplete.complete) {
            console.log(`🏆 Selection completed in room: ${roomId}`);
            io.to(roomId).emit('selection-ended', {
              finalTeams: isComplete.teams,
              message: 'Team selection completed!'
            });
          } else if (result.nextPlayer) {
            // Start timer for next player
            startTurnTimer(roomId, result.nextPlayer);
          }
          
        } catch (error) {
          console.error('❌ Error in auto-selection:', error);
          io.to(roomId).emit('error', { message: 'Error in auto-selection' });
        }
      }, 10000); // 10 seconds
      
      selectionTimers.set(roomId, timer);
    };

    const clearTurnTimer = (roomId) => {
      const timer = selectionTimers.get(roomId);
      if (timer) {
        clearTimeout(timer);
        selectionTimers.delete(roomId);
        console.log(`⏰ Timer cleared for room ${roomId}`);
      }
    };
  });

  return io;
};