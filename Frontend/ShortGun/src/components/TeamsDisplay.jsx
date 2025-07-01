import { User, Crown, Trophy, Star } from 'lucide-react';
import PropTypes from 'prop-types';

const TeamsDisplay = ({ teams = [], gameStatus, currentUser }) => {
  const getRoleColor = (role) => {
    const colors = {
      'Batsman': 'bg-green-100 text-green-800 border-green-200',
      'Bowler': 'bg-red-100 text-red-800 border-red-200',
      'All-rounder': 'bg-blue-100 text-blue-800 border-blue-200',
      'Wicket-keeper': 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[role] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getCountryFlag = (country) => {
    const flags = {
      'India': '🇮🇳',
      'Pakistan': '🇵🇰',
      'Australia': '🇦🇺',
      'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      'New Zealand': '🇳🇿',
      'South Africa': '🇿🇦',
      'Afghanistan': '🇦🇫',
      'Bangladesh': '🇧🇩'
    };
    return flags[country] || '🏏';
  };

  const getTeamScore = (team) => {
    const rolePoints = {
      'Batsman': 2,
      'Bowler': 2,
      'All-rounder': 3,
      'Wicket-keeper': 2
    };
    return team.reduce((score, player) => score + (rolePoints[player.role] || 1), 0);
  };

  const sortedTeams = gameStatus === 'completed' 
    ? [...teams].sort((a, b) => getTeamScore(b.team) - getTeamScore(a.team))
    : teams;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
          {gameStatus === 'completed' ? 'Final Teams' : 'Current Teams'}
        </h2>
        {gameStatus === 'completed' && (
          <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full font-semibold">
            Selection Complete!
          </span>
        )}
      </div>
      
      <div className="space-y-6">
        {sortedTeams.map((user, index) => {
          const isCurrentUserTeam = user.name === currentUser?.name;
          const teamScore = getTeamScore(user.team || []);
          const isWinner = gameStatus === 'completed' && index === 0 && teams.length > 1;
          
          return (
            <div 
              key={index} 
              className={`border-2 rounded-lg p-4 transition-all ${
                isCurrentUserTeam 
                  ? 'border-blue-300 bg-blue-50' 
                  : 'border-gray-200'
              } ${isWinner ? 'ring-2 ring-yellow-400 bg-yellow-50' : ''}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {isWinner && <Star className="w-5 h-5 text-yellow-500" />}
                  <User className="w-5 h-5 text-gray-600" />
                  <span className={`font-bold text-lg ${isWinner ? 'text-yellow-700' : 'text-gray-800'}`}>
                    {user.name}
                  </span>
                  {user.isHost && <Crown className="w-5 h-5 text-yellow-500" title="Room Host" />}
                  {isCurrentUserTeam && (
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                      You
                    </span>
                  )}
                  {isWinner && (
                    <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full font-semibold">
                      Winner!
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 font-medium">
                    {user.team?.length || 0}/5 players
                  </span>
                  {gameStatus === 'completed' && (
                    <span className="text-sm font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded">
                      Score: {teamScore}
                    </span>
                  )}
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        isCurrentUserTeam ? 'bg-blue-500' : 'bg-gray-400'
                      }`}
                      style={{ width: `${((user.team?.length || 0) / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {user.team?.map((player, playerIndex) => (
                  <div 
                    key={playerIndex} 
                    className="flex items-center justify-between p-3 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getCountryFlag(player.country)}</span>
                      <div>
                        <span className="font-semibold text-gray-800">{player.name}</span>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 text-xs font-semibold rounded border ${getRoleColor(player.role)}`}>
                            {player.role}
                          </span>
                          <span className="text-xs text-gray-500">{player.country}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Empty slots */}
                {Array.from({ length: 5 - (user.team?.length || 0) }).map((_, emptyIndex) => (
                  <div 
                    key={`empty-${emptyIndex}`} 
                    className="flex items-center p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
                  >
                    <span className="text-gray-400 text-sm font-medium">
                      {gameStatus === 'selecting' ? 'Waiting for selection...' : 'Empty slot'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        
        {teams.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p>No teams formed yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

TeamsDisplay.propTypes = {
  teams: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    isHost: PropTypes.bool,
    team: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired
    }))
  })),
  gameStatus: PropTypes.string.isRequired,
  currentUser: PropTypes.shape({
    name: PropTypes.string
  })
};

export default TeamsDisplay;
