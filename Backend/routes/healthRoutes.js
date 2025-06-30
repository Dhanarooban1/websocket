import express from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import { getHealthStatus } from '../controllers/systemController.js';

const router = express.Router();

// Health check endpoint
router.get('/', asyncHandler(getHealthStatus));

export default router;
