import { Trophy, Users, Zap, RotateCcw, UserPlus, LogIn } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center p-4">
      {/* Connection Status */}
      <div className="absolute top-4 right-4">
        <ConnectionStatus isConnected={isConnected} />
      </div>

      {/* Main Content Container */}
      <div className="w-full max-w-lg">
        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="p-6 bg-green-500 rounded-full inline-block mb-6 shadow-lg">
            <Trophy className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Cricket Teams</h1>
          <p className="text-lg text-gray-600">Real-time team selection experience</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 animate-shake">
            <div className="flex items-center">
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Get Started Section */}
        {!showJoinRoom && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">Get Started</h2>
            
            {/* Name Input */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
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
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg flex items-center justify-center space-x-3"
              >
                <UserPlus className="w-5 h-5" />
                <span>Create New Room</span>
              </button>

              <button
                onClick={() => setShowJoinRoom(true)}
                disabled={!isConnected || !userName.trim()}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg flex items-center justify-center space-x-3"
              >
                <LogIn className="w-5 h-5" />
                <span>Join Existing Room</span>
              </button>
            </div>
          </div>
        )}

        {/* Join Room Form */}
        {showJoinRoom && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Create Room</h2>
              <button
                onClick={() => setShowJoinRoom(false)}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                ← Back
              </button>
            </div>
            
            {/* Name Input */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                placeholder="Enter your name"
                disabled={!isConnected}
                maxLength={20}
              />
            </div>

            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Room ID
            </label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 mb-6 font-mono text-center text-lg tracking-widest"
              placeholder="ABC123"
              maxLength={6}
            />
            <button
              onClick={onJoinRoom}
              disabled={!roomId.trim() || !userName.trim()}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
            >
              Create Room
            </button>
          </div>
        )}

        {/* Features Section */}
        <div className="flex justify-center space-x-12">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2 mx-auto">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm text-gray-600 font-medium">Multiplayer</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2 mx-auto">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-sm text-gray-600 font-medium">Real-time</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2 mx-auto">
              <RotateCcw className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600 font-medium">Turn-based</p>
          </div>
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
