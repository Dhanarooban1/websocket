import PropTypes from 'prop-types';

const AvailablePlayers = ({ players = [], onSelectPlayer, isMyTurn, searchTerm, onSearchChange }) => {
  const filteredPlayers = players.filter(player => 
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role) => {
    const colors = {
      'Batsman': 'bg-green-100 text-green-800',
      'Bowler': 'bg-red-100 text-red-800',
      'All-rounder': 'bg-blue-100 text-blue-800',
      'Wicket-keeper': 'bg-yellow-100 text-yellow-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Available Players ({filteredPlayers.length})
        </h2>
        {!isMyTurn && (
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Not your turn
          </span>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search players by name, role, or country..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div className="max-h-96 overflow-y-auto space-y-3">
        {filteredPlayers.map((player) => (
          <div
            key={player.id}
            onClick={() => isMyTurn && onSelectPlayer(player.id)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              isMyTurn 
                ? 'hover:bg-blue-50 hover:border-blue-300 border-gray-200 cursor-pointer hover:shadow-md transform hover:scale-105' 
                : 'border-gray-200 cursor-not-allowed opacity-60'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl">{getCountryFlag(player.country)}</span>
                  <h4 className="font-bold text-gray-800 text-lg">{player.name}</h4>
                </div>
                
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(player.role)}`}>
                    {player.role}
                  </span>
                  <span className="text-sm text-gray-600 font-medium">{player.country}</span>
                </div>
              </div>
              
              {isMyTurn && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPlayer(player.id);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition duration-200 transform hover:scale-105 shadow-md"
                >
                  Select
                </button>
              )}
            </div>
          </div>
        ))}
        
        {filteredPlayers.length === 0 && searchTerm && (
          <div className="text-center py-8 text-gray-500">
            <p>No players found matching &quot;{searchTerm}&quot;</p>
          </div>
        )}
        
        {players.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>All players have been selected!</p>
          </div>
        )}
      </div>
    </div>
  );
};

AvailablePlayers.propTypes = {
  players: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired
  })),
  onSelectPlayer: PropTypes.func.isRequired,
  isMyTurn: PropTypes.bool.isRequired,
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired
};

export default AvailablePlayers;
