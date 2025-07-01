import { Copy, LogOut, Users2, Check } from 'lucide-react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import NotificationSystem from './NotificationSystem';
import AvailablePlayers from './AvailablePlayers';
import TurnTimer from './TurnTimer';

const GameRoom = ({ 
  room, 
  currentUser, 
  availablePlayers = [], 
  onSelectPlayer, 
  isMyTurn, 
  searchTerm, 
  onSearchChange,
  gameStatus,
  onLeaveRoom,
  onStartSelection,
  timeLeft = 0,
  currentPlayer,
  userTeams = []
}) => {
  const [copied, setCopied] = useState(false);

  const copyRoomId = () => {
    navigator.clipboard.writeText(room?.id || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    // Show toast notification
    NotificationSystem.showSuccess('Room ID copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Cricket Team Selection</h1>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Room ID:</span>
                  <span className="font-mono font-semibold text-lg">{room?.id}</span>
                  <button
                    onClick={copyRoomId}
                    className={`p-2 hover:bg-gray-100 rounded transition-colors ${copied ? 'bg-green-100' : ''}`}
                    title={copied ? 'Copied!' : 'Copy Room ID'}
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>
                
                {/* Host indicator */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Host:</span>
                  <span className="text-sm font-semibold text-yellow-700 bg-yellow-100 px-2 py-1 rounded border border-yellow-200">
                    👑 {room?.users?.find(u => u.isHost)?.name || 'Unknown'}
                  </span>
                  {currentUser?.isHost && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">
                      (You)
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Users2 className="w-5 h-5" />
                <span>{room?.users?.length || 0} players</span>
              </div>
              <button
                onClick={onLeaveRoom}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Leave</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Players List */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-4">
                <Users2 className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Players ({room?.users?.length || 0})
                </h2>
              </div>
              
              <div className="space-y-3">
                {room?.users?.map((user, index) => {
                  // Find the current team data for this user from userTeams
                  const currentUserTeam = userTeams.find(team => team.name === user.name);
                  const teamCount = currentUserTeam?.team?.length || user.team?.length || 0;
                  
                  return (
                    <div
                      key={index}
                      className="border-2 border-gray-200 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-800">{user.name}</span>
                          {user.isHost && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-medium border border-yellow-200">
                              👑 Host
                            </span>
                          )}
                          {user.name === currentUser?.name && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              You
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">Team</div>
                      <div className="text-right text-sm text-gray-500">
                        {teamCount}/5
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Middle Panel - Available Players */}
          <div className="col-span-6">
            {gameStatus === 'selecting' ? (
              <AvailablePlayers
                players={availablePlayers}
                onSelectPlayer={onSelectPlayer}
                isMyTurn={isMyTurn}
                searchTerm={searchTerm}
                onSearchChange={onSearchChange}
              />
            ) : (
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Available Players</h2>
                <div className="text-center py-12">
                  <Users2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Waiting for Players</h3>
                  <p className="text-gray-600">Waiting for the host to start the selection...</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Current Status */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg p-6">
              {gameStatus === 'waiting' ? (
                <div className="text-center">
                  <Users2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Waiting for Players</h3>
                  <p className="text-gray-600 mb-6">Waiting for the host to start the selection...</p>
                  
                  {/* Start Selection Button for Host */}
                  {currentUser?.isHost ? (
                    <div className="space-y-3">
                      <button
                        onClick={onStartSelection}
                        disabled={!room?.users || room.users.length < 2}
                        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed shadow-md"
                      >
                        🚀 Start Team Selection
                      </button>
                      {(!room?.users || room.users.length < 2) && (
                        <p className="text-xs text-gray-500">Need at least 2 players to start</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 bg-blue-50 px-4 py-3 rounded-lg border border-blue-200">
                        <span className="font-semibold">👑 Only the host can start the selection</span>
                        <br />
                        <span className="text-xs text-gray-500">
                          Host: {room?.users?.find(u => u.isHost)?.name || 'Unknown'}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Team Selection Active</h3>
                  <p className="text-sm text-gray-600 mb-4">Players are selecting their teams...</p>
                  
                  {/* Current Turn Info */}
                  {currentPlayer && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-600">Current Turn:</div>
                      <div className="font-semibold text-blue-600">{currentPlayer.name}</div>
                    </div>
                  )}
                  
                  {/* Timer Display */}
                  {timeLeft > 0 && (
                    <TurnTimer 
                      timeLeft={timeLeft}
                      isMyTurn={isMyTurn}
                      currentPlayerName={currentPlayer?.name}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

GameRoom.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.string,
    users: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      isHost: PropTypes.bool,
      team: PropTypes.array
    }))
  }),
  currentUser: PropTypes.shape({
    name: PropTypes.string,
    isHost: PropTypes.bool
  }),
  availablePlayers: PropTypes.array,
  onSelectPlayer: PropTypes.func.isRequired,
  isMyTurn: PropTypes.bool.isRequired,
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  gameStatus: PropTypes.string.isRequired,
  onLeaveRoom: PropTypes.func.isRequired,
  onStartSelection: PropTypes.func.isRequired,
  timeLeft: PropTypes.number,
  currentPlayer: PropTypes.shape({
    name: PropTypes.string,
    isHost: PropTypes.bool
  }),
  userTeams: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    isHost: PropTypes.bool,
    team: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      role: PropTypes.string,
      country: PropTypes.string
    }))
  }))
};

export default GameRoom;
