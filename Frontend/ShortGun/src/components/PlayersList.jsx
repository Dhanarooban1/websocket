import { Users, Crown, User } from 'lucide-react';
import PropTypes from 'prop-types';

const PlayersList = ({ users = [] }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Users className="w-5 h-5 mr-2" />
        Players ({users.length})
      </h3>
      <div className="space-y-2">
        {users.map((user, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <User className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-800">{user.name}</span>
              {user.isHost && <Crown className="w-4 h-4 text-yellow-500" title="Room Host" />}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {user.team?.length || 0}/5 players
              </span>
              <div className="w-8 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${((user.team?.length || 0) / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No players in room yet
          </div>
        )}
      </div>
    </div>
  );
};

PlayersList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    isHost: PropTypes.bool,
    team: PropTypes.array
  }))
};

export default PlayersList;
