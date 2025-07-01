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

  
  const selectionTimers = new Map();

  io.on('connection', (socket) => {
    console.log(`👤 User connected: ${socket.id}`);

  


    socket.on('create-room', async (data, callback) => {
      try {
        const { userName } = data;
        if (!userName?.trim()) {
          return callback({ success: false, error: 'User name is required' });
        }
        const roomData = await createRoom(userName, socket.id);
        await socket.join(roomData.roomId);
        callback({ 
          success: true, 
          roomId: roomData.roomId,
          room: roomData
        });
        io.to(roomData.roomId).emit('room-updated', roomData);
        
      } catch (error) {
        console.error('❌ Error creating room:', error);
        callback({ success: false, error: error.message });
      }
    });


    socket.on('join-room', async (data, callback) => {
      try {
        const { roomId, userName } = data;
        
        if (!roomId?.trim() || !userName?.trim()) {
          return callback({ success: false, error: 'Room ID and user name are required' });
        }

        const roomData = await joinRoom(roomId, userName, socket.id);
        await socket.join(roomId);
        
        console.log(`👥 ${userName} joined room: ${roomId}`);
        
        callback({ 
          success: true, 
          room: roomData
        });
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

 
    socket.on('start-selection', async (data, callback) => {
      try {
        const { roomId } = data;
        
        if (!roomId?.trim()) {
          return callback({ success: false, error: 'Room ID is required' });
        }

        const roomData = await startSelection(roomId, socket.id);
        
        callback({ success: true });

        io.to(roomId).emit('selection-started', {
          turnOrder: roomData.turnOrder,
          currentPlayerIndex: roomData.currentPlayerIndex,
          currentPlayer: roomData.turnOrder[0],
          availablePlayers: roomData.availablePlayers
        });
        startTurnTimer(roomId, roomData.turnOrder[0]);
        
      } catch (error) {
        console.error('❌ Error starting selection:', error);
        callback({ success: false, error: error.message });
      }
    });

    socket.on('select-player', async (data, callback) => {
      try {
        const { roomId, playerId } = data;
        
        if (!roomId?.trim() || !playerId) {
          return callback({ success: false, error: 'Room ID and player ID are required' });
        }

        const result = await selectPlayer(roomId, socket.id, playerId);
        
        clearTurnTimer(roomId);
        
      
        callback({ success: true });

        io.to(roomId).emit('player-selected', {
          selectedPlayer: result.selectedPlayer,
          selectedBy: result.selectedBy,
          availablePlayers: result.availablePlayers,
          currentPlayerIndex: result.currentPlayerIndex,
          nextPlayer: result.nextPlayer,
          userTeams: result.userTeams
        });

        const isComplete = await checkSelectionComplete(roomId);
        if (isComplete.complete) {
          console.log(`🏆 Selection completed in room: ${roomId}`);
          io.to(roomId).emit('selection-ended', {
            finalTeams: isComplete.teams,
            message: 'Team selection completed!'
          });
        } else if (result.nextPlayer) {
          startTurnTimer(roomId, result.nextPlayer);
        }
        
      } catch (error) {
        console.error('❌ Error selecting player:', error);
        callback({ success: false, error: error.message });
      }
    });


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

   
    socket.on('sync-room', async (data, callback) => {
      try {
        const { roomId } = data;
        
        if (!roomId?.trim()) {
          return callback({ success: false, error: 'Room ID is required' });
        }

        const roomData = await getRoomDetails(roomId);
        
       
        if (!socket.rooms.has(roomId)) {
          await socket.join(roomId);
        }
        
        callback({ success: true, room: roomData });
     
      } catch (error) {
        console.error('❌ Error syncing room:', error);
        callback({ success: false, error: error.message });
      }
    });

 
    socket.on('disconnect', async () => {
      try {
        console.log(`👤 User disconnected: ${socket.id}`);
        
     
        const rooms = Array.from(socket.rooms).filter(room => room !== socket.id);
        
        for (const roomId of rooms) {
          try {
            const users = await getUsersInRoom(roomId);
            const disconnectedUser = users.find(user => user.socketId === socket.id);
            
            if (disconnectedUser) {
              await removeUserFromRoom(roomId, socket.id);
              clearTurnTimer(roomId);
              
              // Notify other users
              socket.to(roomId).emit('user-disconnected', {
                userName: disconnectedUser.name,
                message: `${disconnectedUser.name} has left the room`
              });

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

  
    const startTurnTimer = (roomId, currentPlayer) => {
    
      clearTurnTimer(roomId);
      
   
      io.to(roomId).emit('turn-timer-started', {
        currentPlayer: currentPlayer,
        timeLimit: 10000 // 10 seconds
      });
      
      const timer = setTimeout(async () => {
        try {
          const result = await autoSelectPlayer(roomId, currentPlayer.socketId);
          
    
          io.to(roomId).emit('auto-selected', {
            selectedPlayer: result.selectedPlayer,
            selectedBy: result.selectedBy,
            availablePlayers: result.availablePlayers,
            currentPlayerIndex: result.currentPlayerIndex,
            nextPlayer: result.nextPlayer,
            userTeams: result.userTeams,
            message: `Time's up! Auto-selected ${result.selectedPlayer.name} for ${currentPlayer.name}`
          });

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
      }, 10000); 
      
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