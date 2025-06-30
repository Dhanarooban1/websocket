import express from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import { getAllRooms, getRoomById, getRoomStats } from '../controllers/roomController.js';

const router = express.Router();

// Get all available rooms (for lobby/discovery)
router.get('/', asyncHandler(getAllRooms));

// Get specific room details
router.get('/:roomId', asyncHandler(getRoomById));

// Get game statistics for a room
router.get('/:roomId/stats', asyncHandler(getRoomStats));

export default router;
