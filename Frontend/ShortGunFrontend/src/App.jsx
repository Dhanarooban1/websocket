import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import './App.css'
import RoomEntry from './components/RoomEntry'
import WaitingRoom from './components/WaitingRoom'
import SelectionRoom from './components/SelectionRoom'
import ResultsView from './components/ResultsView'

const SOCKET_URL = 'http://localhost:5000' // Update this to your backend URL

function App() {
  const [socket, setSocket] = useState(null)
  const [gameState, setGameState] = useState('entry') // entry, waiting, selection, results
  const [roomData, setRoomData] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const [participants, setParticipants] = useState([])
  const [players, setPlayers] = useState([])
  const [selectedPicks, setSelectedPicks] = useState({})
  const [currentTurn, setCurrentTurn] = useState(null)
  const [turnOrder, setTurnOrder] = useState([])
  const [timeLeft, setTimeLeft] = useState(10)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')

  useEffect(() => {
    const newSocket = io(SOCKET_URL)
    setSocket(newSocket)

    newSocket.on('connect', () => {
      setConnectionStatus('connected')
    })

    newSocket.on('disconnect', () => {
      setConnectionStatus('disconnected')
    })

    // Updated to match your backend events
    newSocket.on('room-update', (users) => {
      setParticipants(users)
      if (gameState === 'entry') {
        setGameState('waiting')
      }
    })

    newSocket.on('turn-order', (order) => {
      setTurnOrder(order)
      setGameState('selection')
      if (order.length > 0) {
        setCurrentTurn(order[0].name)
      }
    })

    newSocket.on('your-turn', (playerName) => {
      setCurrentTurn(playerName)
      setTimeLeft(10)
    })

    newSocket.on('player-selected', (data) => {
      setSelectedPicks(data.picks)
      // Remove selected player from available pool would be handled by backend
    })

    newSocket.on('auto-selected', (data) => {
      setSelectedPicks(data.picks)
    })

    newSocket.on('selection-ended', (finalPicks) => {
      setSelectedPicks(finalPicks)
      setGameState('results')
    })

    return () => newSocket.close()
  }, [gameState])

  // Timer countdown effect
  useEffect(() => {
    let timer
    if (gameState === 'selection' && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    }
    return () => clearTimeout(timer)
  }, [timeLeft, gameState])

  const renderCurrentView = () => {
    switch (gameState) {
      case 'entry':
        return <RoomEntry 
          socket={socket} 
          connectionStatus={connectionStatus}
          onJoinRoom={(roomId, username) => {
            setUserInfo({ name: username, id: socket?.id })
            setRoomData({ id: roomId })
          }}
        />
      case 'waiting':
        return <WaitingRoom 
          socket={socket} 
          roomData={roomData}
          participants={participants}
          userInfo={userInfo}
          connectionStatus={connectionStatus}
        />
      case 'selection':
        return <SelectionRoom 
          socket={socket}
          roomData={roomData}
          players={players}
          selectedPicks={selectedPicks}
          currentTurn={currentTurn}
          turnOrder={turnOrder}
          userInfo={userInfo}
          timeLeft={timeLeft}
          connectionStatus={connectionStatus}
        />
      case 'results':
        return <ResultsView 
          selectedPicks={selectedPicks}
          turnOrder={turnOrder}
          userInfo={userInfo}
        />
      default:
        return <RoomEntry 
          socket={socket} 
          connectionStatus={connectionStatus}
          onJoinRoom={(roomId, username) => {
            setUserInfo({ name: username, id: socket?.id })
            setRoomData({ id: roomId })
          }}
        />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {renderCurrentView()}
    </div>
  )
}

export default App
