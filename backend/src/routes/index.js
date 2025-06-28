// backend/src/routes/index.js
import express from 'express';
import healthRoutes from './health.js';
import transcribeRoutes from './transcribe.js';

const router = express.Router();

// Rota principal
router.get('/', (req, res) => {
  res.json({ 
    message: 'Sistema de Reconhecimento de Voz API funcionando!',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      health: 'GET /api/health',
      upload: 'POST /api/transcribe',
      test: 'GET /api/test'
    }
  });
});

// Rotas organizadas
router.use('/api', healthRoutes);
router.use('/api', transcribeRoutes);

export default router;