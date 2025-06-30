import { successHandler } from '../middleware/responseHandler.js';

// Get available cricket players (for frontend initialization)
export const getAllPlayers = async (req, res) => {
  const { cricketPlayersData } = await import('../utils/playerPool.js');
  
  successHandler(res, cricketPlayersData, 'Players retrieved successfully');
};

// Get players by role
export const getPlayersByRole = async (req, res) => {
  const { role } = req.params;
  const { getPlayersByRole } = await import('../utils/playerPool.js');
  
  const players = getPlayersByRole(role);
  successHandler(res, players, `${role} players retrieved successfully`);
};

// Get top players by rating
export const getTopPlayers = async (req, res) => {
  const count = parseInt(req.params.count) || 10;
  const { getTopPlayers } = await import('../utils/playerPool.js');
  
  const players = getTopPlayers(count);
  successHandler(res, players, `Top ${count} players retrieved successfully`);
};
