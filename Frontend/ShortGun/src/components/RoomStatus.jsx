import { Users, Crown, Play, Clock } from 'lucide-react';
import PropTypes from 'prop-types';
import TurnTimer from './TurnTimer';

const RoomStatus = ({ 
  room, 
  gameStatus, 
  currentPlayer, 
  timeLeft, 
  isMyTurn, 
  currentUser, 
  onStartSelection 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting':
        return 'text-yellow-600 bg-yellow-100';
      case 'selecting':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'waiting':
        return '⏳ Waiting to Start';
      case 'selecting':
        return '🏏 Selection in Progress';
      case 'completed':
        return '✅ Selection Complete';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Users className="w-5 h-5 mr-2" />
        Room Status
      </h2>
      
      <div className="space-y-4">
        {/* Status */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Status:</span>
          <span className={`font-semibold px-3 py-1 rounded-full text-sm ${getStatusColor(gameStatus)}`}>
            {getStatusText(gameStatus)}
          </span>
        </div>
        
        {/* Players Count */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Players:</span>
          <span className="font-semibold text-gray-800">{room?.users?.length || 0}/6</span>
        </div>

        {/* Room ID */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Room ID:</span>
          <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {room?.id}
          </span>
        </div>

        {/* Current Turn */}
        {gameStatus === 'selecting' && currentPlayer && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 font-medium">Current Turn:</span>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-blue-600">{currentPlayer.name}</span>
                {currentPlayer.isHost && <Crown className="w-4 h-4 text-yellow-500" />}
              </div>
            </div>
            
            {/* Turn Timer */}
            <TurnTimer 
              timeLeft={timeLeft}
              isMyTurn={isMyTurn}
              currentPlayerName={currentPlayer.name}
            />
          </div>
        )}

        {/* Start Selection Button */}
        {gameStatus === 'waiting' && currentUser?.isHost && (
          <div className="border-t pt-4">
            <button
              onClick={onStartSelection}
              disabled={!room?.users || room.users.length < 2}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-105 disabled:hover:scale-100"
            >
              <Play className="w-5 h-5" />
              <span>Start Team Selection</span>
            </button>
            {(!room?.users || room.users.length < 2) && (
              <p className="text-xs text-gray-500 text-center mt-2">
                Need at least 2 players to start
              </p>
            )}
          </div>
        )}

        {/* Waiting for Host */}
        {gameStatus === 'waiting' && !currentUser?.isHost && (
          <div className="border-t pt-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span className="text-sm">Waiting for host to start selection...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

RoomStatus.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.string,
    users: PropTypes.array
  }),
  gameStatus: PropTypes.string.isRequired,
  currentPlayer: PropTypes.shape({
    name: PropTypes.string,
    isHost: PropTypes.bool
  }),
  timeLeft: PropTypes.number.isRequired,
  isMyTurn: PropTypes.bool.isRequired,
  currentUser: PropTypes.shape({
    name: PropTypes.string,
    isHost: PropTypes.bool
  }),
  onStartSelection: PropTypes.func.isRequired
};

export default RoomStatus;
