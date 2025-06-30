import { useState, useEffect } from 'react'
import { Clock, User, Trophy, Zap, Target, Wifi, WifiOff } from 'lucide-react'
import { samplePlayers } from '../data/players'

const SelectionRoom = ({ 
  socket, 
  roomData,
  selectedPicks, 
  currentTurn, 
  turnOrder, 
  userInfo, 
  timeLeft, 
  connectionStatus 
}) => {
  // Use sample players as fallback since your backend uses cricketPlayers()
  const [availablePlayers] = useState(samplePlayers)

  const selectPlayer = (player) => {
    if (!socket || currentTurn !== userInfo?.name || !player || !roomData?.id) return
    socket.emit('select-player', { roomId: roomData.id, player })
  }

  const isMyTurn = currentTurn === userInfo?.name
  const mySelectedPlayers = selectedPicks[userInfo?.id] || []

  // Get remaining available players (those not yet selected by anyone)
  const allSelectedPlayers = Object.values(selectedPicks).flat()
  const remainingPlayers = availablePlayers.filter(player => 
    !allSelectedPlayers.some(selected => selected.id === player.id)
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Team Selection</h1>
                <p className="text-slate-300 text-sm">Draft your dream cricket team</p>
              </div>
            </div>
            
            {/* Connection Status */}
            <div className="flex items-center space-x-2">
              {connectionStatus === 'connected' ? (
                <>
                  <Wifi className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400 text-sm font-medium">Live</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 text-sm font-medium">Disconnected</span>
                </>
              )}
            </div>
          </div>

          {/* Turn Indicator */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${isMyTurn ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                <span className="text-white font-medium">
                  {isMyTurn ? "Your Turn" : `${currentTurn}'s Turn`}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className={`font-bold ${timeLeft <= 3 ? 'text-red-400' : 'text-white'}`}>
                  {timeLeft}s
                </span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-3 w-full bg-slate-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ${
                  timeLeft <= 3 ? 'bg-red-500' : 'bg-blue-500'
                }`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Available Players */}
          <div className="lg:col-span-3">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Available Players ({remainingPlayers.length})</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {remainingPlayers.map((player) => (
                  <div
                    key={player.id}
                    onClick={() => isMyTurn && selectPlayer(player)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                      isMyTurn 
                        ? 'border-blue-500/50 hover:border-blue-400 hover:bg-blue-500/10 hover:scale-105' 
                        : 'border-slate-600/50 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium text-sm">{player.name}</h3>
                        <p className="text-slate-300 text-xs">{player.role}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Zap className="w-3 h-3 text-yellow-400" />
                          <span className="text-yellow-400 text-xs font-medium">{player.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {remainingPlayers.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-400">All players have been selected!</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Turn Order */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4">
              <h3 className="text-white font-medium mb-3 flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Turn Order</span>
              </h3>
              
              <div className="space-y-2">
                {turnOrder.map((player, index) => (
                  <div
                    key={player.id}
                    className={`p-2 rounded-lg flex items-center space-x-2 ${
                      currentTurn === player.name 
                        ? 'bg-blue-500/20 border border-blue-400/50' 
                        : 'bg-slate-800/30'
                    }`}
                  >
                    <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <span className={`text-sm flex-1 ${
                      currentTurn === player.name ? 'text-blue-300 font-medium' : 'text-slate-300'
                    }`}>
                      {player.name}
                    </span>
                    {currentTurn === player.name && (
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* My Team */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4">
              <h3 className="text-white font-medium mb-3 flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4" />
                  <span>My Team</span>
                </span>
                <span className="text-xs text-slate-400">({mySelectedPlayers.length}/5)</span>
              </h3>
              
              <div className="space-y-2">
                {[...Array(5)].map((_, index) => {
                  const player = mySelectedPlayers[index]
                  return (
                    <div
                      key={index}
                      className={`p-2 rounded-lg border-2 border-dashed ${
                        player 
                          ? 'border-emerald-500/50 bg-emerald-500/10' 
                          : 'border-slate-600/50 bg-slate-800/20'
                      }`}
                    >
                      {player ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {player.name.split(' ').map(n => n[0]).join('').slice(0, 1)}
                            </span>
                          </div>
                          <div>
                            <p className="text-emerald-300 text-xs font-medium">{player.name}</p>
                            <p className="text-emerald-400/70 text-xs">{player.role}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 border-2 border-dashed border-slate-500 rounded-full" />
                          <span className="text-slate-500 text-xs">Position {index + 1}</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Game Progress */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4">
              <h3 className="text-white font-medium mb-3">Game Progress</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Round:</span>
                  <span className="text-white font-medium">
                    {Math.floor(Object.values(selectedPicks).reduce((sum, picks) => sum + picks.length, 0) / turnOrder.length) + 1} / 5
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Players Left:</span>
                  <span className="text-white font-medium">{remainingPlayers.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SelectionRoom
