import express from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import { getAllPlayers, getPlayersByRole, getTopPlayers } from '../controllers/playerController.js';

const router = express.Router();

// Get available cricket players (for frontend initialization)
router.get('/', asyncHandler(getAllPlayers));

// Get players by role
router.get('/role/:role', asyncHandler(getPlayersByRole));

// Get top players by rating
router.get('/top/:count?', asyncHandler(getTopPlayers));

export default router;
