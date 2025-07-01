import { User, Crown } from 'lucide-react';
import PropTypes from 'prop-types';

const TurnOrder = ({ turnOrder = [], currentPlayerIndex }) => {
  if (turnOrder.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Turn Order</h3>
      <div className="space-y-2">
        {turnOrder.map((user, index) => (
          <div 
            key={index} 
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
              index === currentPlayerIndex 
                ? 'bg-blue-100 border-2 border-blue-300 shadow-md transform scale-105' 
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
              index === currentPlayerIndex 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-300 text-gray-600'
            }`}>
              {index + 1}
            </div>
            
            <div className="flex items-center space-x-2 flex-1">
              <User className="w-4 h-4 text-gray-600" />
              <span className={`font-medium ${
                index === currentPlayerIndex ? 'text-blue-800' : 'text-gray-800'
              }`}>
                {user.name}
              </span>
              {user.isHost && <Crown className="w-4 h-4 text-yellow-500" title="Room Host" />}
            </div>
            
            {index === currentPlayerIndex && (
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full font-semibold animate-pulse">
                  Current Turn
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

TurnOrder.propTypes = {
  turnOrder: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    isHost: PropTypes.bool
  })),
  currentPlayerIndex: PropTypes.number.isRequired
};

export default TurnOrder;
