import { Timer } from 'lucide-react';
import PropTypes from 'prop-types';

const TurnTimer = ({ timeLeft, isMyTurn, currentPlayerName }) => {
  if (timeLeft <= 0) return null;

  return (
    <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
      <div className="flex items-center justify-center space-x-3">
        <Timer className="w-6 h-6 text-red-600 animate-pulse" />
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{timeLeft}s</div>
          <div className="text-sm text-red-600">Time remaining</div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-3 w-full bg-red-200 rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-red-500 transition-all duration-1000 ease-linear"
          style={{ width: `${(timeLeft / 10) * 100}%` }}
        />
      </div>
      
      {isMyTurn ? (
        <p className="text-center text-sm text-red-700 mt-2 font-semibold animate-pulse">
          🔥 Your turn! Select a player quickly!
        </p>
      ) : (
        <p className="text-center text-sm text-red-600 mt-2">
          Waiting for {currentPlayerName} to select...
        </p>
      )}
    </div>
  );
};

TurnTimer.propTypes = {
  timeLeft: PropTypes.number.isRequired,
  isMyTurn: PropTypes.bool.isRequired,
  currentPlayerName: PropTypes.string
};

export default TurnTimer;
