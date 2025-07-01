import { Trophy, Wifi, WifiOff, User, Crown } from 'lucide-react';
import PropTypes from 'prop-types';

const Header = ({ room, currentUser, isConnected }) => {
  return (
    <header className="bg-white shadow-lg p-4 border-b-2 border-blue-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Trophy className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Cricket Team Selection</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Room: <span className="font-mono font-semibold text-blue-600">{room?.id}</span></span>
              <span>•</span>
              <span>{room?.users?.length || 0} players</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* Connection Status */}
          <div className="flex items-center">
            {isConnected ? (
              <div className="flex items-center text-green-600">
                <Wifi className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Connected</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <WifiOff className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Disconnected</span>
              </div>
            )}
          </div>
          
          {/* Current User */}
          <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg">
            <User className="w-5 h-5 text-gray-600" />
            <span className="text-gray-800 font-semibold">{currentUser?.name}</span>
            {currentUser?.isHost && (
              <Crown className="w-4 h-4 text-yellow-500" title="Room Host" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.string,
    users: PropTypes.array
  }),
  currentUser: PropTypes.shape({
    name: PropTypes.string,
    isHost: PropTypes.bool
  }),
  isConnected: PropTypes.bool.isRequired
};

export default Header;
