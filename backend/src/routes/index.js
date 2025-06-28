
import express from 'express';
import healthRoutes from './health.js';
import transcribeRoutes from './transcribe.js';
import nlpRoutes from './nlp.js';
import automationRoutes from './automation.js';

const router = express.Router();

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

router.use('/api', healthRoutes);
router.use('/api', transcribeRoutes);
router.use('/api', nlpRoutes);
router.use('/api', automationRoutes);

export default router;