import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

// Components
import LoadingScreen from './components/LoadingScreen';
import WelcomeScreen from './components/WelcomeScreen';
import GameRoom from './components/GameRoom';
import SelectionComplete from './components/SelectionComplete';
import NotificationSystem from './components/NotificationSystem';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const App = () => {
  // Socket connection
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // User state
  const [userName, setUserName] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  
  // Room state
  const [roomId, setRoomId] = useState('');
  const [room, setRoom] = useState(null);
  const [isInRoom, setIsInRoom] = useState(false);
  
  // Game state
  const [gameStatus, setGameStatus] = useState('waiting');
  const [turnOrder, setTurnOrder] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [userTeams, setUserTeams] = useState([]);
  const [finalTeams, setFinalTeams] = useState([]);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(0);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const timerRef = useRef(null);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Add periodic room sync effect
  useEffect(() => {
    if (socket && room && isInRoom) {
      const syncInterval = setInterval(() => {
        socket.emit('sync-room', { roomId: room.id }, (response) => {
          if (response.success) {
            // Silent update - no notification for periodic sync
            setRoom(response.room);
          }
        });
      }, 10000); // Sync every 10 seconds (increased from 5 to reduce frequency)

      return () => clearInterval(syncInterval);
    }
  }, [socket, room, isInRoom]);

  // Separate effect to handle current user synchronization when room or userName changes
  useEffect(() => {
    if (userName && room && room.users) {
      const user = room.users.find(u => u.name === userName);
      if (user) {
        setCurrentUser({
          name: user.name,
          isHost: user.isHost,
          socketId: user.socketId
        });
        
        // Log for debugging
        console.log('Current user updated:', {
          name: user.name,
          isHost: user.isHost,
          socketId: user.socketId
        });
      }
    }
  }, [userName, room]);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      maxReconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      console.log('Connected to server with socket ID:', newSocket.id);
      setIsConnected(true);
      setSocket(newSocket);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setError('Failed to connect to server');
      setIsConnected(false);
    });

    // Room events
    newSocket.on('room-updated', (updatedRoom) => {
      console.log('Room updated:', updatedRoom);
      console.log('Users in room:', updatedRoom.users?.length || 0);
      console.log('User names:', updatedRoom.users?.map(u => u.name) || []);
      setRoom(updatedRoom);
      
      // Show brief notification for actual room events
      setNotification('Room updated');
      setTimeout(() => setNotification(''), 1500);
    });

    newSocket.on('user-joined', (data) => {
      setNotification(data.message);
      setTimeout(() => setNotification(''), 3000);
    });

    newSocket.on('user-disconnected', (data) => {
      setNotification(data.message);
      setTimeout(() => setNotification(''), 3000);
    });

    // Selection events
    newSocket.on('selection-started', (data) => {
      setGameStatus('selecting');
      setTurnOrder(data.turnOrder);
      setCurrentPlayerIndex(0);
      setAvailablePlayers(data.availablePlayers);
      setNotification('Team selection started!');
      setTimeout(() => setNotification(''), 3000);
    });

    newSocket.on('turn-timer-started', (data) => {
      // Start timer inline to avoid dependency issues
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setTimeLeft(10);
      
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            setIsMyTurn(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      const currentPlayer = data.currentPlayer;
      setIsMyTurn(currentPlayer.socketId === newSocket.id);
    });

    newSocket.on('player-selected', (data) => {
      setAvailablePlayers(data.availablePlayers);
      setCurrentPlayerIndex(data.currentPlayerIndex);
      setUserTeams(data.userTeams);
      setNotification(`${data.selectedBy} selected ${data.selectedPlayer.name}`);
      setTimeout(() => setNotification(''), 3000);
      // Stop timer inline
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setTimeLeft(0);
      setIsMyTurn(false);
    });

    newSocket.on('auto-selected', (data) => {
      setAvailablePlayers(data.availablePlayers);
      setCurrentPlayerIndex(data.currentPlayerIndex);
      setUserTeams(data.userTeams);
      setNotification(data.message);
      setTimeout(() => setNotification(''), 5000);
      // Stop timer inline
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setTimeLeft(0);
      setIsMyTurn(false);
    });

    newSocket.on('selection-ended', (data) => {
      setGameStatus('completed');
      setFinalTeams(data.finalTeams);
      setNotification(data.message);
      // Stop timer inline
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setTimeLeft(0);
      setIsMyTurn(false);
    });

    newSocket.on('error', (data) => {
      setError(data.message);
      setTimeout(() => setError(''), 5000);
    });

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      newSocket.close();
    };
  }, []); // Removed userName dependency to prevent socket reconnection on every keystroke

  // Room functions
  const createRoom = () => {
    if (!userName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!socket) {
      setError('Not connected to server');
      return;
    }

    setLoading(true);
    socket.emit('create-room', { userName: userName.trim() }, (response) => {
      setLoading(false);
      if (response.success) {
        setRoom(response.room);
        setRoomId(response.roomId);
        setIsInRoom(true);
        // Don't manually set currentUser here - let the useEffect handle it from room data
        setNotification('Room created successfully!');
        setTimeout(() => setNotification(''), 3000);
      } else {
        setError(response.error);
        setTimeout(() => setError(''), 5000);
      }
    });
  };

  const joinRoom = () => {
    if (!userName.trim() || !roomId.trim()) {
      setError('Please enter your name and room ID');
      return;
    }

    if (!socket) {
      setError('Not connected to server');
      return;
    }

    setLoading(true);
    socket.emit('join-room', { 
      roomId: roomId.trim().toUpperCase(), 
      userName: userName.trim() 
    }, (response) => {
      setLoading(false);
      if (response.success) {
        setRoom(response.room);
        setIsInRoom(true);
        // Don't manually set currentUser here - let the useEffect handle it from room data
        setShowJoinRoom(false);
        setNotification('Joined room successfully!');
        setTimeout(() => setNotification(''), 3000);
        
        // Immediately sync room state after joining
        setTimeout(() => {
          socket.emit('sync-room', { roomId: response.room.id }, (syncResponse) => {
            if (syncResponse.success) {
              setRoom(syncResponse.room);
            }
          });
        }, 500);
      } else {
        setError(response.error);
        setTimeout(() => setError(''), 5000);
      }
    });
  };

  const startSelection = () => {
    if (!socket || !room) return;

    // Check if current user is the host
    if (!currentUser?.isHost) {
      setError('Only the host can start the selection');
      setTimeout(() => setError(''), 5000);
      return;
    }

    // Check if there are enough players
    if (!room?.users || room.users.length < 2) {
      setError('Need at least 2 players to start selection');
      setTimeout(() => setError(''), 5000);
      return;
    }

    setLoading(true);
    socket.emit('start-selection', { roomId: room.id }, (response) => {
      setLoading(false);
      if (!response.success) {
        setError(response.error);
        setTimeout(() => setError(''), 5000);
      }
    });
  };

  const selectPlayer = (playerId) => {
    if (!socket || !room || !isMyTurn) return;

    // Optimistic update - immediately update the UI
    const selectedPlayer = availablePlayers.find(p => p.id === playerId);
    if (selectedPlayer) {
      // Remove player from available list immediately
      setAvailablePlayers(prev => prev.filter(p => p.id !== playerId));
      
      // Update current user's team immediately
      setUserTeams(prev => {
        const updated = prev.map(user => {
          if (user.name === currentUser.name) {
            return {
              ...user,
              team: [...(user.team || []), selectedPlayer]
            };
          }
          return user;
        });
        
        // If user doesn't exist in userTeams yet, add them
        if (!updated.find(u => u.name === currentUser.name)) {
          updated.push({
            name: currentUser.name,
            isHost: currentUser.isHost,
            team: [selectedPlayer]
          });
        }
        
        return updated;
      });
    }

    socket.emit('select-player', { 
      roomId: room.id, 
      playerId 
    }, (response) => {
      if (!response.success) {
        setError(response.error);
        setTimeout(() => setError(''), 5000);
        
        // If there's an error, we should revert the optimistic update
        // The server will send the correct state anyway, so we don't need to do anything here
      }
    });
  };

  const leaveRoom = () => {
    if (socket && room) {
      socket.emit('leave-room');
      setIsInRoom(false);
      setRoom(null);
      setGameStatus('waiting');
      setTurnOrder([]);
      setCurrentPlayerIndex(0);
      setAvailablePlayers([]);
      setUserTeams([]);
      setFinalTeams([]);
      setTimeLeft(0);
      setIsMyTurn(false);
      setNotification('Left room successfully');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const backToHome = () => {
    leaveRoom();
  };

  // Helper functions
  const getCurrentPlayer = () => {
    if (!turnOrder.length || currentPlayerIndex >= turnOrder.length) return null;
    return turnOrder[currentPlayerIndex];
  };

  const handleNotificationClose = (type) => {
    if (type === 'notification') {
      setNotification('');
    } else if (type === 'error') {
      setError('');
    }
  };

  // Render loading screen
  if (loading) {
    return <LoadingScreen message="Loading..." />;
  }

  // Render welcome screen
  if (!isInRoom) {
    return (
      <WelcomeScreen
        isConnected={isConnected}
        userName={userName}
        setUserName={setUserName}
        roomId={roomId}
        setRoomId={setRoomId}
        showJoinRoom={showJoinRoom}
        setShowJoinRoom={setShowJoinRoom}
        onCreateRoom={createRoom}
        onJoinRoom={joinRoom}
        error={error}
      />
    );
  }

  // Render game screen
  return (
    <>
      {/* Notifications */}
      <NotificationSystem
        notification={notification}
        error={error}
        onClose={handleNotificationClose}
      />

      {gameStatus === 'completed' ? (
        <SelectionComplete
          finalTeams={finalTeams}
          currentUser={currentUser}
          onBackToHome={backToHome}
        />
      ) : (
        <GameRoom
          room={room}
          currentUser={currentUser}
          availablePlayers={availablePlayers}
          onSelectPlayer={selectPlayer}
          isMyTurn={isMyTurn}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          gameStatus={gameStatus}
          onLeaveRoom={leaveRoom}
          onStartSelection={startSelection}
          timeLeft={timeLeft}
          currentPlayer={getCurrentPlayer()}
          userTeams={userTeams}
        />
      )}
    </>
  );
};

export default App;