# Cricket Team Selection - Frontend

A real-time multiplayer cricket team selection application built with React, Socket.IO, and Tailwind CSS.

![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-brightgreen?style=for-the-badge&logo=vercel)

![Backend](https://img.shields.io/badge/Backend-Render-blue?style=for-the-badge&logo=render)

**🔗 Live Application:** [https://websocket-gules.vercel.app](https://websocket-gules.vercel.app)


## 🎮 Game Overview

Players create or join rooms and take turns selecting from a pool of 30 professional cricket players. Each player has 10 seconds to make their choice, or a random player will be auto-selected. Build a balanced team of 5 players and compete with friends!

## ✨ Key Technical Features

### 🔄 Real-time Communication
- **Socket.IO** for bidirectional real-time communication
- Instant updates across all connected clients
- Live room status and player selection broadcasting

```javascript
// Real-time player selection updates
socket.on('playerSelected', ({ playerId, playerData, updatedRoom }) => {
  // Instant UI updates for all players in the room
});
```

### 👥 Multi-user Synchronization
- **Redis-powered state management** for consistent game state
- Synchronized room updates across multiple users
- Persistent session handling

```javascript
// Synchronized room state management
const updateRoomInRedis = async (roomId, roomData) => {
  await redisClient.set(`room:${roomId}`, JSON.stringify(roomData));
  io.to(roomId).emit('roomUpdate', roomData);
};
```

### ⏱️ Turn Handling
- **10-second turn timer** with visual countdown
- Automatic turn progression system
- Auto-selection fallback mechanism

```javascript
// Sophisticated turn management
const advanceTurn = (room) => {
  const currentIndex = room.players.findIndex(p => p.id === room.currentTurn);
  const nextIndex = (currentIndex + 1) % room.players.length;
  room.currentTurn = room.players[nextIndex].id;
};
```


### 🏗️ Event-based Architecture
- Comprehensive event system for all game interactions
- Clean separation of concerns
- Robust error handling and recovery

```javascript
// Event-driven game flow
socket.on('gameStarted', handleGameStart);
socket.on('turnAdvanced', handleTurnAdvance);
socket.on('gameCompleted', handleGameCompletion);
```

## 🚀 Features

- **Real-time Multiplayer**: Join rooms and see updates in real-time
- **Turn-based Selection**: Host-first turn order with 10-second timer per turn
- **Auto-selection**: Automatic player selection if time runs out
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Live Updates**: Real-time notifications and game state updates
- **Team Building**: Each player builds a team of 5 cricket players
- **Role-based Players**: Batsmen, Bowlers, All-rounders, and Wicket-keepers


## 📁 Project Structure

### Backend Structure
```
websocket/
├── Backend/
├── middleware/
│   └── responseHandler.js      # Response handling middleware
├── node_modules/               # Dependencies
├── socket/
│   └── socketController.js     # Socket.IO event handlers
├── utils/
│   ├── Controllers.js          # Main controller logic
│   └── playerPool.js           # Cricket players database
├── .env                        # Environment variables
├── .gitignore                  # Git ignore rules
├── package-lock.json           # Locked dependency versions
├── package.json                # Dependencies and scripts
└── server.js                   # Main server entry point
```

### Frontend Structure
```
src/
├── components/
│   ├── AvailablePlayers.jsx    # Player selection interface
│   ├── ConnectionStatus.jsx     # Connection indicator
│   ├── Header.jsx              # App header
│   ├── LoadingScreen.jsx       # Loading component
│   ├── NotificationSystem.jsx  # Alerts and notifications
│   ├── PlayersList.jsx         # Room participants list
│   ├── RoomStatus.jsx          # Room information panel
│   ├── TeamsDisplay.jsx        # Teams and final results
│   ├── TurnOrder.jsx           # Turn sequence display
│   ├── TurnTimer.jsx           # Selection timer
│   └── WelcomeScreen.jsx       # Landing page
├── App.jsx                     # Main application component
├── main.jsx                    # Application entry point
├── index.css                   # Global styles and animations
└── App.css                     # Component-specific styles
```


## 🔧 API Endpoints

### Socket Events

#### Client → Server
- `createRoom` - Create new game room
- `joinRoom` - Join existing room
- `startGame` - Begin player selection
- `selectPlayer` - Pick a cricket player
- `disconnect` - Handle player leaving

#### Server → Client
- `roomUpdate` - Live room state changes
- `gameStarted` - Game initialization
- `playerSelected` - Player pick notifications
- `turnAdvanced` - Turn progression
- `gameCompleted` - Final results

## 🛠 Tech Stack

- **React 18** - Frontend framework
- **Socket.IO Client** - Real-time communication
- **Tailwind CSS** - Styling and responsive design
- **Lucide React** - Icons
- **Vite** - Build tool and dev server
- **PropTypes** - Runtime type checking

## 📦 Installation

1. Navigate to the frontend directory:
```bash
cd Frontend/ShortGun
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🎮 How to Use

### Creating a Room
1. Enter your name
2. Click "Create New Room"
3. Share the room ID with other players
4. Wait for at least 2 players to join
5. Click "Start Team Selection" to begin

### Joining a Room
1. Enter your name
2. Click "Join Existing Room"
3. Enter the room ID provided by the host
4. Wait for the host to start the selection

### Team Selection Process
1. Players take turns with the host always going first, followed by others in randomized order
2. Each player has 10 seconds to select a cricket player
3. If time runs out, a player is auto-selected
4. Continue until each player has 5 players
5. View final teams and scores


## 🔧 Configuration

### Environment Variables
The app connects to the backend at `http://localhost:5000` by default. To change this, update the `SOCKET_URL` constant in `App.jsx`.

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📄 License

This project is part of an interview assignment and is for demonstration purposes.

**Built with ❤️ for cricket fans and real-time gaming enthusiasts!**

🔗 **Live Demo**: [https://websocket-gules.vercel.app](https://websocket-gules.vercel.app)