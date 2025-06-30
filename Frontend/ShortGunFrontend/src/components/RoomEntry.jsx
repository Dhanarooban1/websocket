import { useState } from 'react'
import { Users, Wifi, WifiOff, Play, UserPlus } from 'lucide-react'

const RoomEntry = ({ socket, connectionStatus, onJoinRoom }) => {
  const [username, setUsername] = useState('')
  const [roomCode, setRoomCode] = useState('')
  const [action, setAction] = useState('join') // 'join' or 'create'
  const [isLoading, setIsLoading] = useState(false)

  const handleJoinRoom = () => {
    if (!username.trim() || !roomCode.trim()) return
    setIsLoading(true)
    
    // Join existing room
    socket.emit('join-room', { 
      roomId: roomCode.trim(), 
      user: username.trim() 
    })
    
    onJoinRoom(roomCode.trim(), username.trim())
    
    setTimeout(() => setIsLoading(false), 3000)
  }

  const handleCreateRoom = () => {
    if (!username.trim()) return
    setIsLoading(true)
    
    // Create new room with a random room ID
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase()
    
    socket.emit('join-room', { 
      roomId: newRoomId, 
      user: username.trim() 
    })
    
    onJoinRoom(newRoomId, username.trim())
    
    setTimeout(() => setIsLoading(false), 3000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Connection Status */}
        <div className="mb-6 flex items-center justify-center space-x-2">
          {connectionStatus === 'connected' ? (
            <>
              <Wifi className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="w-5 h-5 text-red-400" />
              <span className="text-red-400 text-sm font-medium">Connecting...</span>
            </>
          )}
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Cricket Team Selection</h1>
            <p className="text-slate-300 text-sm">Join the ultimate team drafting experience</p>
          </div>

          {/* Action Toggle */}
          <div className="flex bg-slate-800/50 rounded-xl p-1 mb-6">
            <button
              onClick={() => setAction('join')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                action === 'join'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Join Room
            </button>
            <button
              onClick={() => setAction('create')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                action === 'create'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Create Room
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                maxLength={20}
              />
            </div>

            {action === 'join' && (
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Room Code
                </label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="Enter room code"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                  maxLength={10}
                />
              </div>
            )}

            <button
              onClick={action === 'join' ? handleJoinRoom : handleCreateRoom}
              disabled={isLoading || connectionStatus !== 'connected' || !username.trim() || (action === 'join' && !roomCode.trim())}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {action === 'join' ? (
                    <UserPlus className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                  <span>{action === 'join' ? 'Join Room' : 'Create Room'}</span>
                </>
              )}
            </button>
          </div>

          {/* Neural Network Pattern */}
          <div className="mt-8 pt-6 border-t border-slate-600/50">
            <div className="flex justify-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomEntry
