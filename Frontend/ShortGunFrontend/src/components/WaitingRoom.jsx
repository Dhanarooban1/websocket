import { useState } from 'react'
import { Users, Copy, Check, Play, Crown, Wifi, WifiOff } from 'lucide-react'

const WaitingRoom = ({ socket, roomData, participants, userInfo, connectionStatus }) => {
  const [copied, setCopied] = useState(false)
  const [isStarting, setIsStarting] = useState(false)

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomData?.id || '')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy room code:', err)
    }
  }

  const startSelection = () => {
    if (!socket || !roomData?.id) return
    setIsStarting(true)
    socket.emit('start-selection', { roomId: roomData.id })
    setTimeout(() => setIsStarting(false), 3000)
  }

  const isHost = participants.length > 0 && participants[0]?.id === userInfo?.id

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
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
              <span className="text-red-400 text-sm font-medium">Connection Lost</span>
            </>
          )}
        </div>

        {/* Main Container */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Waiting Room</h1>
            <p className="text-slate-300 text-sm">Share the room code with your friends</p>
          </div>

          {/* Room Code Section */}
          <div className="bg-slate-800/50 rounded-xl p-6 mb-8">
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-2">Room Code</p>
              <div className="flex items-center justify-center space-x-3">
                <span className="text-3xl font-bold text-white tracking-wider">
                  {roomData?.id || 'LOADING...'}
                </span>
                <button
                  onClick={copyRoomCode}
                  className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                  disabled={!roomData?.id}
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-blue-400" />
                  )}
                </button>
              </div>
              {copied && (
                <p className="text-emerald-400 text-sm mt-2">Room code copied!</p>
              )}
            </div>
          </div>

          {/* Participants List */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Participants ({participants.length})
              </h3>
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < participants.length ? 'bg-emerald-400' : 'bg-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {participants.map((participant, index) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-600/30"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {participant.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{participant.name}</p>
                      {index === 0 && (
                        <p className="text-amber-400 text-xs flex items-center space-x-1">
                          <Crown className="w-3 h-3" />
                          <span>Host</span>
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-emerald-400 text-sm">Ready</span>
                  </div>
                </div>
              ))}
            </div>

            {participants.length < 2 && (
              <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <p className="text-amber-300 text-sm text-center">
                  Waiting for more players to join... (Minimum 2 players required)
                </p>
              </div>
            )}
          </div>

          {/* Start Button (Host Only) */}
          {isHost && (
            <div className="text-center">
              <button
                onClick={startSelection}
                disabled={participants.length < 2 || isStarting || connectionStatus !== 'connected'}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-emerald-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 mx-auto"
              >
                {isStarting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Start Selection</span>
                  </>
                )}
              </button>
              <p className="text-slate-400 text-xs mt-2">
                Only the host can start the team selection
              </p>
            </div>
          )}

          {!isHost && (
            <div className="text-center">
              <p className="text-slate-400 text-sm">
                Waiting for the host to start the selection...
              </p>
              <div className="flex justify-center space-x-2 mt-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Neural Network Visual */}
          <div className="mt-8 pt-6 border-t border-slate-600/50">
            <div className="flex justify-center items-center space-x-4">
              {participants.map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-400/50 rounded-full" />
                  {i < participants.length - 1 && (
                    <div className="w-8 h-px bg-slate-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WaitingRoom
