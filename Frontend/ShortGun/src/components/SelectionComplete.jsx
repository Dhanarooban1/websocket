import { Trophy, Home, Shield } from 'lucide-react';
import PropTypes from 'prop-types';

const SelectionComplete = ({ finalTeams = [], currentUser, onBackToHome }) => {
  // Find the current user's team
  const userTeam = finalTeams.find(team => team.name === currentUser?.name);

  // Debug logging
  console.log('SelectionComplete - finalTeams:', finalTeams);
  console.log('SelectionComplete - currentUser:', currentUser);
  console.log('SelectionComplete - userTeam:', userTeam);

  const getPlayerRoleDisplay = (player) => {
    const roleColors = {
      'Batsman': 'bg-blue-100 text-blue-800',
      'Fast Bowler': 'bg-red-100 text-red-800',
      'Spin Bowler': 'bg-red-100 text-red-800',
      'Wicket-keeper': 'bg-green-100 text-green-800',
      'All-rounder': 'bg-purple-100 text-purple-800'
    };
    
    return roleColors[player.role] || 'bg-gray-100 text-gray-800';
  };

  const getCountryFlag = (country) => {
    const flags = {
      'India': '🇮🇳',
      'Australia': '🇦🇺',
      'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      'South Africa': '🇿🇦',
      'Pakistan': '🇵🇰',
      'New Zealand': '🇳🇿',
      'West Indies': '🇯🇲',
      'Sri Lanka': '🇱🇰',
      'Bangladesh': '🇧🇩',
      'Afghanistan': '🇦🇫'
    };
    return flags[country] || '🏴';
  };

  const getCountryCode = (country) => {
    const codes = {
      'India': 'IN',
      'Australia': 'AU',
      'England': 'GB',
      'South Africa': 'ZA',
      'Pakistan': 'PK',
      'New Zealand': 'NZ',
      'West Indies': 'WI',
      'Sri Lanka': 'LK',
      'Bangladesh': 'BD',
      'Afghanistan': 'AF'
    };
    return codes[country] || 'XX';
  };

  const TeamCard = ({ team, isUserTeam = false }) => (
    <div className={`bg-white rounded-xl p-6 shadow-lg border-2 ${isUserTeam ? 'border-green-400' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {isUserTeam ? (
            <Trophy className="w-6 h-6 text-green-600" />
          ) : (
            <Shield className="w-6 h-6 text-gray-600" />
          )}
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {isUserTeam ? 'Your Team' : team.name}
            </h3>
            {isUserTeam && (
              <span className="text-sm text-green-600 font-medium">Your Team</span>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-800">{team.team.length}</div>
          <div className="text-sm text-gray-600">Players</div>
        </div>
      </div>

      <div className="space-y-3">
        {team.team.map((player, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <div>
                <div className="font-semibold text-gray-800">{player.name}</div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded ${getPlayerRoleDisplay(player)}`}>
                    {player.role}
                  </span>
                  <span className="text-sm text-gray-600">
                    {getCountryFlag(player.country)} {player.country}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-800">
                {getCountryCode(player.country)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // PropTypes for TeamCard
  TeamCard.propTypes = {
    team: PropTypes.shape({
      name: PropTypes.string,
      team: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        role: PropTypes.string,
        rating: PropTypes.number,
        country: PropTypes.string,
        specialty: PropTypes.string
      }))
    }).isRequired,
    isUserTeam: PropTypes.bool
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <h1 className="text-3xl font-bold text-gray-800">Selection Complete!</h1>
            </div>
            <p className="text-gray-600 text-lg">Here are all the final teams</p>
          </div>
        </div>
      </div>

      {/* Teams Display */}
      <div className="max-w-7xl mx-auto p-6">
        {!finalTeams || finalTeams.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No teams found</h3>
            <p className="text-gray-600 mb-6">There seems to be an issue with loading the team data.</p>
            <button
              onClick={onBackToHome}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg flex items-center space-x-2 mx-auto"
            >
              <Home className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
          </div>
        ) : (
          <>
            {userTeam && (
          <div className="mb-8">
            {/* Your Team Header */}
            <div className="bg-green-500 rounded-t-xl p-4 text-white">
              <div className="flex items-center justify-center space-x-2">
                <Trophy className="w-6 h-6" />
                <span className="text-xl font-bold">Your Team</span>
              </div>
            </div>
            
            {/* Your Team Players in horizontal layout */}
            <div className="bg-green-500 px-6 pb-6">
              <div className="grid grid-cols-5 gap-4">
                {userTeam.team.map((player, index) => (
                  <div key={index} className="bg-green-600 rounded-lg p-3 text-white text-center">
                    <div className="font-semibold text-sm mb-1">{player.name}</div>
                    <div className="text-xs opacity-90 mb-1">
                      {getCountryCode(player.country)}
                    </div>
                    <div className="text-xs bg-green-700 px-2 py-1 rounded">
                      {player.role === 'Wicket-keeper' ? 'Keeper' :
                       player.role === 'All-rounder' ? 'All-rounder' :
                       player.role === 'Fast Bowler' ? 'Fast' :
                       player.role === 'Spin Bowler' ? 'Spin' :
                       player.role}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Teams Comparison */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {finalTeams.map((team, index) => (
            <TeamCard 
              key={index} 
              team={team} 
              isUserTeam={team === userTeam}
            />
          ))}
        </div>

        {/* Back to Home Button */}
        <div className="text-center">
          <button
            onClick={onBackToHome}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg flex items-center space-x-2 mx-auto"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </div>
        </>
        )}
      </div>
    </div>
  );
};

SelectionComplete.propTypes = {
  finalTeams: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    isHost: PropTypes.bool,
    team: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      role: PropTypes.string,
      rating: PropTypes.number,
      country: PropTypes.string,
      specialty: PropTypes.string
    }))
  })),
  currentUser: PropTypes.shape({
    name: PropTypes.string,
    isHost: PropTypes.bool
  }),
  onBackToHome: PropTypes.func.isRequired
};

export default SelectionComplete;
