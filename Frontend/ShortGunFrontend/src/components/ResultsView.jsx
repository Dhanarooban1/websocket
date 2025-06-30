import { Trophy, Medal, Star, User, Download, RotateCcw } from 'lucide-react'

const ResultsView = ({ selectedPicks, turnOrder, userInfo }) => {
  const myTeam = selectedPicks[userInfo?.id] || []
  
  const getTeamScore = (players) => {
    return players.reduce((total, player) => total + (player.rating || 0), 0)
  }

  const teamsWithScores = turnOrder.map(player => ({
    ...player,
    team: selectedPicks[player.id] || [],
    score: getTeamScore(selectedPicks[player.id] || [])
  })).sort((a, b) => b.score - a.score)

  const myRank = teamsWithScores.findIndex(team => team.id === userInfo?.id) + 1
  const isWinner = myRank === 1

  const downloadResults = () => {
    const results = teamsWithScores.map((team, index) => ({
      rank: index + 1,
      player: team.name,
      score: team.score,
      team: team.team.map(p => `${p.name} (${p.role}, ${p.rating})`).join(', ')
    }))

    const csv = [
      'Rank,Player,Score,Team',
      ...results.map(r => `${r.rank},${r.player},${r.score},"${r.team}"`)
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cricket-draft-results.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const playAgain = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
            isWinner 
              ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
              : 'bg-gradient-to-br from-blue-400 to-purple-600'
          }`}>
            {isWinner ? (
              <Trophy className="w-10 h-10 text-white" />
            ) : (
              <Medal className="w-10 h-10 text-white" />
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            {isWinner ? '🎉 Congratulations!' : 'Draft Complete!'}
          </h1>
          <p className="text-slate-300">
            {isWinner 
              ? 'You drafted the best team!' 
              : `You finished ${myRank}${myRank === 2 ? 'nd' : myRank === 3 ? 'rd' : 'th'} place`
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leaderboard */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                <Trophy className="w-6 h-6" />
                <span>Final Leaderboard</span>
              </h2>

              <div className="space-y-4">
                {teamsWithScores.map((team, index) => (
                  <div
                    key={team.id}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      team.id === userInfo?.id
                        ? 'border-blue-400 bg-blue-500/10'
                        : 'border-slate-600/30 bg-slate-800/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-amber-600 text-white' :
                          'bg-slate-600 text-white'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold flex items-center space-x-2">
                            <span>{team.name}</span>
                            {team.id === userInfo?.id && (
                              <span className="text-blue-400 text-sm">(You)</span>
                            )}
                          </h3>
                          <p className="text-slate-400 text-sm">Team Score: {team.score}</p>
                        </div>
                      </div>

                      {index === 0 && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className="text-yellow-400 font-semibold">Winner</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                      {team.team.map((player, playerIndex) => (
                        <div
                          key={playerIndex}
                          className="p-2 bg-slate-700/50 rounded-lg"
                        >
                          <p className="text-white text-xs font-medium truncate">{player.name}</p>
                          <p className="text-slate-400 text-xs">{player.role}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Star className="w-2 h-2 text-yellow-400" />
                            <span className="text-yellow-400 text-xs">{player.rating}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* My Team Summary */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Your Team</span>
              </h3>

              <div className="space-y-3">
                {myTeam.map((player, index) => (
                  <div
                    key={index}
                    className="p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium text-sm">{player.name}</p>
                        <p className="text-blue-300 text-xs">{player.role}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400" />
                        <span className="text-yellow-400 text-sm font-bold">{player.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Total Score:</span>
                  <span className="text-white font-bold text-lg">{getTeamScore(myTeam)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={downloadResults}
                className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Results</span>
              </button>

              <button
                onClick={playAgain}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all flex items-center justify-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>
            </div>

            {/* Stats */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4">
              <h4 className="text-white font-medium mb-3">Match Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Your Rank:</span>
                  <span className="text-white font-medium">#{myRank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Players:</span>
                  <span className="text-white font-medium">{turnOrder.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Best Score:</span>
                  <span className="text-white font-medium">{teamsWithScores[0]?.score || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Your Score:</span>
                  <span className="text-white font-medium">{getTeamScore(myTeam)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Neural Network Pattern */}
        <div className="mt-8 pt-6 border-t border-slate-600/50">
          <div className="flex justify-center space-x-2">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultsView
