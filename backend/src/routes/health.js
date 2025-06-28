// backend/src/routes/health.js
import express from 'express';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    memory: process.memoryUsage()
  });
});

// Rota de teste
router.get('/test', (req, res) => {
  res.json({
    message: 'Rota de teste funcionando!',
    cors: 'OK',
    json: 'OK',
    timestamp: new Date().toISOString()
  });
});

export default router;