import multer from 'multer';

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Endpoint não encontrado',
    message: `Rota ${req.method} ${req.originalUrl} não existe`,
    availableEndpoints: [
      'GET /',
      'GET /api/health',
      'GET /api/test',
      'POST /api/transcribe'
    ]
  });
};

export const errorHandler = (error, req, res, next) => {
  console.error('Erro capturado:', error);

  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'Arquivo muito grande',
        message: 'O arquivo deve ter no máximo 10MB'
      });
    }
    
    return res.status(400).json({
      error: 'Erro no upload',
      message: error.message
    });
  }

  if (error.message.includes('Apenas arquivos de áudio')) {
    return res.status(400).json({
      error: 'Tipo de arquivo inválido',
      message: error.message
    });
  }

  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Algo deu errado. Tente novamente.'
  });
};