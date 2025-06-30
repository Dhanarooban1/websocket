import { Server } from 'socket.io';
import { roomManager } from '../utils/roomManager.js';

export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "*",
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // Handle room creation and joining
    socket.on('join-room', ({ roomId, user }) => {
      try {
        let room;
        let isNewRoom = false;

        if (roomId && roomManager.getRoom(roomId)) {
          // Join existing room
          room = roomManager.joinRoom(roomId, socket.id, user);
          console.log(`👥 User ${user} joined room ${roomId}`);
        } else {
          // Create new room
          room = roomManager.createRoom(socket.id, user);
          isNewRoom = true;
          console.log(`🎮 User ${user} created room ${room.id}`);
        }

        // Join socket room
        socket.join(room.id);

        // Send room data to the user who joined
        socket.emit('room-joined', {
          room: {
            id: room.id,
            gameState: room.gameState,
            maxPlayers: room.maxPlayers,
            playersPerTeam: room.playersPerTeam
          },
          user: {
            id: socket.id,
            name: user,
            isHost: room.users.find(u => u.id === socket.id)?.isHost || false
          },
          isNewRoom
        });

        // Broadcast updated user list to all users in the room
        io.to(room.id).emit('room-update', room.users);

      } catch (error) {
        console.error(`❌ Error joining room: ${error.message}`);
        socket.emit('error', {
          type: 'JOIN_ROOM_ERROR',
          message: error.message
        });
      }
    });

    // Handle game start
    socket.on('start-selection', ({ roomId }) => {
      try {
        const room = roomManager.getRoom(roomId);
        if (!room) {
          throw new Error('Room not found');
        }

        // Check if user is host
        const user = room.users.find(u => u.id === socket.id);
        if (!user || !user.isHost) {
          throw new Error('Only host can start the game');
        }

        // Start the game
        const startedRoom = roomManager.startGame(roomId);
        
        console.log(`🚀 Game started in room ${roomId} with ${startedRoom.users.length} players`);

        // Broadcast turn order and game start
        io.to(roomId).emit('selection-started', {
          turnOrder: startedRoom.turnOrder,
          currentTurn: startedRoom.turnOrder[0]?.name,
          availablePlayers: startedRoom.playerPool,
          gameState: startedRoom.gameState
        });

        // Start the first turn
        startTurn(roomId, io);

      } catch (error) {
        console.error(`❌ Error starting game: ${error.message}`);
        socket.emit('error', {
          type: 'START_GAME_ERROR', 
          message: error.message
        });
      }
    });

    // Handle player selection
    socket.on('select-player', ({ roomId, player }) => {
      try {
        const result = roomManager.selectPlayer(roomId, socket.id, player.id);
        
        console.log(`⚡ Player ${result.currentUser.name} selected ${result.selectedPlayer.name}`);

        // Broadcast the selection to all users
        io.to(roomId).emit('player-selected', {
          userId: socket.id,
          userName: result.currentUser.name,
          player: result.selectedPlayer,
          picks: result.room.picks,
          availablePlayers: result.room.playerPool
        });

        // Move to next turn
        proceedToNextTurn(roomId, io);

      } catch (error) {
        console.error(`❌ Error selecting player: ${error.message}`);
        socket.emit('error', {
          type: 'SELECT_PLAYER_ERROR',
          message: error.message
        });
      }
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${socket.id}`);
      
      const room = roomManager.removeUser(socket.id);
      if (room) {
        console.log(`👋 User removed from room ${room.id}`);
        
        // If game was active and someone left, pause or handle appropriately
        if (room.gameState === 'active') {
          // Clear any active timers
          if (room.turnTimer) {
            clearTimeout(room.turnTimer);
            room.turnTimer = null;
          }
          
          // Notify remaining users
          io.to(room.id).emit('player-disconnected', {
            message: 'A player has disconnected. Game paused.',
            remainingUsers: room.users
          });
          
          // If only one player left, end the game
          if (room.users.length === 1) {
            room.gameState = 'completed';
            io.to(room.id).emit('selection-ended', {
              reason: 'insufficient_players',
              picks: room.picks,
              finalStats: roomManager.getGameStats(room.id)
            });
          } else {
            // Continue with remaining players
            proceedToNextTurn(room.id, io);
          }
        } else {
          // Just update the room for waiting state
          io.to(room.id).emit('room-update', room.users);
        }
      }
    });

    // Handle manual leave room
    socket.on('leave-room', () => {
      const room = roomManager.removeUser(socket.id);
      if (room) {
        socket.leave(room.id);
        io.to(room.id).emit('room-update', room.users);
        socket.emit('left-room');
      }
    });

    // Handle get room stats
    socket.on('get-stats', ({ roomId }) => {
      const stats = roomManager.getGameStats(roomId);
      if (stats) {
        socket.emit('room-stats', stats);
      } else {
        socket.emit('error', {
          type: 'STATS_ERROR',
          message: 'Could not retrieve room statistics'
        });
      }
    });
  });

  // Helper function to start a turn
  function startTurn(roomId, io) {
    const room = roomManager.getRoom(roomId);
    if (!room || room.gameState !== 'active') return;

    const currentUser = room.turnOrder[room.currentTurnIndex];
    if (!currentUser) return;

    console.log(`⏰ Starting turn for ${currentUser.name} in room ${roomId}`);

    // Notify all users whose turn it is
    io.to(roomId).emit('turn-started', {
      currentPlayer: currentUser.name,
      currentPlayerId: currentUser.id,
      timeLimit: room.turnDuration / 1000,
      remainingPlayers: room.playerPool.length
    });

    // Start countdown timer
    let timeLeft = room.turnDuration / 1000;
    const countdownInterval = setInterval(() => {
      timeLeft--;
      io.to(roomId).emit('turn-timer', { timeLeft });
      
      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
      }
    }, 1000);

    // Set auto-selection timer
    room.turnTimer = setTimeout(() => {
      clearInterval(countdownInterval);
      
      const autoResult = roomManager.autoSelectPlayer(roomId);
      if (autoResult) {
        console.log(`🤖 Auto-selected ${autoResult.selectedPlayer.name} for ${autoResult.currentUser.name}`);
        
        // Broadcast auto-selection
        io.to(roomId).emit('auto-selected', {
          userId: autoResult.currentUser.id,
          userName: autoResult.currentUser.name,
          player: autoResult.selectedPlayer,
          picks: autoResult.room.picks,
          availablePlayers: autoResult.room.playerPool
        });

        // Move to next turn
        proceedToNextTurn(roomId, io);
      }
    }, room.turnDuration);
  }

  // Helper function to proceed to next turn
  function proceedToNextTurn(roomId, io) {
    const result = roomManager.nextTurn(roomId);
    if (!result) return;

    const { room, gameCompleted } = result;

    if (gameCompleted) {
      console.log(`🏆 Game completed in room ${roomId}`);
      
      // Clear any timers
      if (room.turnTimer) {
        clearTimeout(room.turnTimer);
        room.turnTimer = null;
      }

      // Get final statistics
      const finalStats = roomManager.getGameStats(roomId);
      
      // Broadcast game end
      io.to(roomId).emit('selection-ended', {
        picks: room.picks,
        finalStats,
        leaderboard: finalStats.leaderboard
      });
    } else {
      // Continue to next turn
      setTimeout(() => {
        startTurn(roomId, io);
      }, 1000); // Small delay for better UX
    }
  }

  console.log('🔧 Socket.IO server configured and ready');
  return io;
};
