# Cricket Team Selection - Frontend

A real-time multiplayer cricket team selection application built with React, Socket.IO, and Tailwind CSS.

## 🚀 Features

- **Real-time Multiplayer**: Join rooms and see updates in real-time
- **Turn-based Selection**: Host-first turn order with 10-second timer per turn
- **Auto-selection**: Automatic player selection if time runs out
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Live Updates**: Real-time notifications and game state updates
- **Team Building**: Each player builds a team of 5 cricket players
- **Role-based Players**: Batsmen, Bowlers, All-rounders, and Wicket-keepers
- **Search Functionality**: Search through available players
- **Team Scoring**: Points-based team evaluation at the end

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

## 🏗 Project Structure

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

## 🎨 Components Overview

### Core Components

- **App.jsx**: Main application logic and state management
- **WelcomeScreen**: Initial screen for creating/joining rooms
- **Header**: Navigation bar with room info and user details
- **LoadingScreen**: Loading states and transitions

### Game Components

- **RoomStatus**: Displays room information, player count, and game status
- **PlayersList**: Shows all participants in the room
- **TurnOrder**: Displays the randomized turn sequence
- **AvailablePlayers**: Interactive player selection interface
- **TeamsDisplay**: Shows current teams and final results
- **TurnTimer**: 10-second countdown timer for each turn

### UI Components

- **ConnectionStatus**: Socket connection indicator
- **NotificationSystem**: Toast notifications and error handling

## 🎯 Game Features

### Player Pool
- 30 cricket players from various countries
- 4 role types: Batsman, Bowler, All-rounder, Wicket-keeper
- Players from India, Pakistan, Australia, England, New Zealand, South Africa, Afghanistan, Bangladesh

### Team Building
- Each player builds a team of exactly 5 players
- No role restrictions (can pick any combination)
- Real-time team updates visible to all players

### Scoring System
- Batsman: 2 points
- Bowler: 2 points  
- All-rounder: 3 points
- Wicket-keeper: 2 points
- Teams ranked by total points at the end

### Timer System
- 10-second timer per turn
- Visual countdown with progress bar
- Auto-selection if time expires
- Clear turn indicators

## 🔄 Real-time Events

The app listens to these Socket.IO events:

- `room-updated`: Room state changes
- `user-joined`: New player joined
- `user-disconnected`: Player left
- `selection-started`: Game begins
- `turn-timer-started`: Timer starts for current player
- `player-selected`: Player manually selected
- `auto-selected`: Player auto-selected due to timeout
- `selection-ended`: All teams complete

## 🎨 Styling & Animations

### Custom Animations
- Fade-in effects for new elements
- Shake animation for errors
- Hover effects for interactive elements
- Progress bars and loading spinners
- Team completion celebrations

### Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interactions
- Optimized for various screen sizes

## 🚨 Error Handling

- Connection status monitoring
- Graceful error messages
- Auto-retry for failed operations
- User-friendly error notifications
- Validation for user inputs

## 📱 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🔧 Configuration

### Environment Variables
The app connects to the backend at `http://localhost:5000` by default. To change this, update the `SOCKET_URL` constant in `App.jsx`.

### Build Configuration
- Vite configuration in `vite.config.js`
- Tailwind configuration in `tailwind.config.js`
- ESLint configuration in `eslint.config.js`

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

## 🐛 Common Issues

### Connection Issues
- Ensure the backend server is running on port 5000
- Check if WebSocket connections are allowed
- Verify CORS settings match frontend URL

### Timer Issues
- Timer automatically stops when component unmounts
- Manual timer cleanup in useEffect cleanup function
- Timer state synced across all clients

### Room Issues
- Room IDs are case-insensitive
- Maximum 6 players per room
- Rooms auto-expire after 2 hours

## 🤝 Contributing

1. Follow the existing code structure
2. Use PropTypes for component validation
3. Maintain responsive design principles
4. Add appropriate error handling
5. Include loading states for async operations

## 📄 License

This project is part of an interview assignment and is for demonstration purposes.
