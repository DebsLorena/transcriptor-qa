import { transcribeAudio } from '../services/whisper/index.js';
import fileValidator from '../services/file/fileValidator.js';
import { logError, logTranscription } from '../services/utils/logger.js';
import fs from 'fs';

export const uploadAudio = async (req, res) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum arquivo de áudio foi enviado',
        message: 'Por favor, envie um arquivo de áudio válido'
      });
    }

    filePath = req.file.path;
    
    logTranscription('start', `Arquivo recebido: ${req.file.originalname}`, {
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    const validation = fileValidator.validate(filePath);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Arquivo inválido',
        message: validation.error
      });
    }

    const options = {
      language: req.body.language || req.query.language || 'pt',
      format: req.body.format || req.query.format || 'json',
      temperature: parseFloat(req.body.temperature || req.query.temperature || '0')
    };

    logTranscription('processing', 'Iniciando transcrição', options);
    const result = await transcribeAudio(filePath, options);
    const keepFile = req.body.keepFile === 'true' || req.query.keepFile === 'true';
    if (!keepFile) {
      setTimeout(() => cleanupFile(filePath), 5000);
    }

    logTranscription('complete', 'Transcrição concluída', {
      wordCount: result.transcription.wordCount,
      confidence: result.transcription.confidence
    });

    res.json({
      success: true,
      message: 'Transcrição realizada com sucesso!',
      data: {
        transcription: result.transcription,
        file: {
          originalName: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
          uploadedAt: new Date().toISOString()
        },
        metadata: result.metadata
      }
    });

  } catch (error) {
    logError('Erro no controller de transcrição:', error);

    if (filePath) cleanupFile(filePath);

    const statusCode = getErrorStatusCode(error);
    res.status(statusCode).json({
      success: false,
      error: getErrorType(error), 
      message: getErrorMessage(error)
    });
  }
};

function cleanupFile(filePath) { 
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logTranscription('cleanup', `Arquivo removido: ${filePath}`);
    }
  } catch (error) {
    logError('Erro na limpeza de arquivo:', error);
  }
}

function getErrorStatusCode(error) {
  if (error.message.includes('API Key')) return 401;
  if (error.message.includes('rate')) return 429;
  if (error.message.includes('grande')) return 413;
  return 500;
}

function getErrorType(error) {
  if (error.message.includes('API Key')) return 'Erro de autenticação';
  if (error.message.includes('rate')) return 'Limite excedido';
  if (error.message.includes('grande')) return 'Arquivo muito grande';
  return 'Erro interno do servidor';
}

function getErrorMessage(error) {
  if (process.env.NODE_ENV === 'development') {
    return error.message;
  }
  
  if (error.message.includes('API Key')) return 'Problema com configuração da API';
  if (error.message.includes('rate')) return 'Muitas requisições. Tente novamente em alguns segundos';
  return 'Erro ao processar arquivo de áudio';
}