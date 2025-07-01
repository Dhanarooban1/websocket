import { Wifi, WifiOff } from 'lucide-react';
import PropTypes from 'prop-types';

const ConnectionStatus = ({ isConnected }) => {
  return (
    <div className="flex items-center">
      {isConnected ? (
        <div className="flex items-center text-green-600">
          <Wifi className="w-5 h-5 mr-2" />
          <span className="text-sm">Connected</span>
        </div>
      ) : (
        <div className="flex items-center text-red-600">
          <WifiOff className="w-5 h-5 mr-2" />
          <span className="text-sm">Disconnected</span>
        </div>
      )}
    </div>
  );
};

ConnectionStatus.propTypes = {
  isConnected: PropTypes.bool.isRequired
};

export default ConnectionStatus;
