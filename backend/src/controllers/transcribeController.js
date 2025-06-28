// backend/src/controllers/transcribeController.js

export const uploadAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'Nenhum arquivo de áudio foi enviado',
        message: 'Por favor, envie um arquivo de áudio válido'
      });
    }

    // Por enquanto, apenas retorna info do arquivo
    // Aqui será integrado o whisperService depois
    res.json({
      message: 'Arquivo recebido com sucesso!',
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
        path: req.file.path
      },
      status: 'ready_for_processing'
    });

  } catch (error) {
    console.error('Erro no controller de upload:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};