import express from 'express';
import roomRoutes from './roomRoutes.js';
import playerRoutes from './playerRoutes.js';
import healthRoutes from './healthRoutes.js';

const router = express.Router();

// Mount route modules
router.use('/rooms', roomRoutes);
router.use('/players', playerRoutes);
router.use('/health', healthRoutes);

export default router;
