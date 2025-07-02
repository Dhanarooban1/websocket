import PropTypes from 'prop-types';

const AvailablePlayers = ({ players = [], onSelectPlayer, isMyTurn, searchTerm, onSearchChange }) => {
  const filteredPlayers = players.filter(player => 
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role) => {
    const colors = {
      'Batsman': 'bg-blue-100 text-blue-600',
      'Bowler': 'bg-red-100 text-red-600',
      'All-rounder': 'bg-purple-100 text-purple-600',
      'Wicket-keeper': 'bg-green-100 text-green-600'
    };
    return colors[role] || 'bg-gray-100 text-gray-600';
  };

  const getCountryCode = (country) => {
    const codes = {
      'India': 'IN',
      'Pakistan': 'PK',
      'Australia': 'AU',
      'England': 'GB',
      'New Zealand': 'NZ',
      'South Africa': 'ZA',
      'Afghanistan': 'AF',
      'Bangladesh': 'BD'
    };
    return codes[country] || 'XX';
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Available Players
        </h2>
        {!isMyTurn && (
          <div className="flex items-center text-sm text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
            Wait for your turn
          </div>
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
      
      <div className="grid grid-cols-4 gap-4">
        {filteredPlayers.map((player) => (
          <div
            key={player.id}
            className={`bg-white border rounded-lg p-4 transition-all duration-200 flex flex-col h-full ${
              isMyTurn 
                ? 'hover:border-green-300 hover:shadow-md cursor-pointer hover:scale-105 border-gray-300' 
                : 'border-gray-200 cursor-not-allowed opacity-60'
            } ${player.name === 'Virat Kohli' ? 'border-green-400 shadow-md' : ''}`}
          >
            
            <div className="flex justify-between items-start mb-3 min-h-[40px]">
              <h4 className="font-bold text-gray-800 text-sm leading-tight">{player.name}</h4>
              <span className="text-sm font-bold text-gray-600 ml-2 flex-shrink-0">{getCountryCode(player.country)}</span>
            </div>
            
          
            <div className="mb-3 min-h-[28px] flex items-start">
              <span className={`px-2 py-1 text-xs font-medium rounded ${getRoleColor(player.role)}`}>
                {player.role}
              </span>
            </div>
            
            {/* Country section with fixed height */}
            <div className="mb-4 min-h-[20px] flex items-center">
              <span className="text-xs text-gray-500 flex items-center">
                <span className="w-1 h-1 bg-gray-400 rounded-full mr-1"></span>
                {player.country}
              </span>
            </div>
            
            {/* Button section - pushed to bottom */}
            <div className="mt-auto">
              <button
                onClick={() => isMyTurn && onSelectPlayer(player.id)}
                disabled={!isMyTurn}
                className={`w-full py-2 px-3 text-sm font-medium rounded transition-colors ${
                  isMyTurn 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Click to Select
              </button>
            </div>
          </div>
        ))}
      </div>
        
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
