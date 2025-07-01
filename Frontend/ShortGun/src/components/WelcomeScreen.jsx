import { Trophy } from 'lucide-react';
import PropTypes from 'prop-types';
import ConnectionStatus from './ConnectionStatus';

const WelcomeScreen = ({ 
  isConnected, 
  userName, 
  setUserName, 
  roomId, 
  setRoomId, 
  showJoinRoom, 
  setShowJoinRoom, 
  onCreateRoom, 
  onJoinRoom, 
  error 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform hover:scale-105 transition-transform duration-300">
        {/* Connection Status */}
        <div className="flex items-center justify-center mb-6">
          <ConnectionStatus isConnected={isConnected} />
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <div className="p-4 bg-blue-100 rounded-full inline-block mb-4">
            <Trophy className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Cricket Team Selection</h1>
          <p className="text-gray-600">Build your dream cricket team in real-time!</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 animate-shake">
            <div className="flex items-center">
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Name Input */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Your Name
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter your name"
            disabled={!isConnected}
            maxLength={20}
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={onCreateRoom}
            disabled={!isConnected || !userName.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
          >
            🏏 Create New Room
          </button>

          <button
            onClick={() => setShowJoinRoom(!showJoinRoom)}
            disabled={!isConnected || !userName.trim()}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
          >
            🚪 Join Existing Room
          </button>
        </div>

        {/* Join Room Form */}
        {showJoinRoom && (
          <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border animate-fade-in">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Room ID
            </label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-3 font-mono text-center text-lg tracking-widest"
              placeholder="ABC123"
              maxLength={6}
            />
            <button
              onClick={onJoinRoom}
              disabled={!roomId.trim()}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105 disabled:hover:scale-100"
            >
              Join Room
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Real-time multiplayer cricket team selection</p>
          <p>Powered by Socket.IO</p>
        </div>
      </div>
    </div>
  );
};

WelcomeScreen.propTypes = {
  isConnected: PropTypes.bool.isRequired,
  userName: PropTypes.string.isRequired,
  setUserName: PropTypes.func.isRequired,
  roomId: PropTypes.string.isRequired,
  setRoomId: PropTypes.func.isRequired,
  showJoinRoom: PropTypes.bool.isRequired,
  setShowJoinRoom: PropTypes.func.isRequired,
  onCreateRoom: PropTypes.func.isRequired,
  onJoinRoom: PropTypes.func.isRequired,
  error: PropTypes.string
};

export default WelcomeScreen;
