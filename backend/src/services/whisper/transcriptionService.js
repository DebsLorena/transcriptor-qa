// src/services/whisper/transcriptionService.js
import fs from 'fs';
import { calculateConfidence } from '../utils/confidenceCalculator.js';
import { logInfo, logError } from '../utils/logger.js';

export class TranscriptionService {
  
  async transcribe(filePath, options = {}) {
    const startTime = Date.now();
    
    try {
      logInfo(`Iniciando transcrição: ${filePath}`);
      const { default: whisperClient } = await import('./whisperClient.js');
      const config = {
        ...whisperClient.getDefaultTranscriptionConfig(),
        ...options
      };

      logInfo(`Configuração de transcrição:`, config);
      const client = whisperClient.getClient();
      const transcription = await client.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        ...config
      });

      const processingTime = Date.now() - startTime;
      const result = this._buildTranscriptionResult(
        transcription, 
        config, 
        filePath, 
        processingTime
      );

      logInfo(`Transcrição concluída em ${processingTime}ms`);
      return result;

    } catch (error) {
      logError('Erro na transcrição:', error);
      throw this._handleTranscriptionError(error);
    }
  }
  _buildTranscriptionResult(transcription, config, filePath, processingTime) {
    const text = transcription.text;
    const stats = fs.statSync(filePath);

    return {
      success: true,
      transcription: {
        text,
        language: config.language,
        model: config.model,
        confidence: calculateConfidence(text),
        wordCount: text.split(' ').length,
        charCount: text.length
      },
      file: {
        originalPath: filePath,
        sizeInMB: stats.size / (1024 * 1024),
        processedAt: new Date().toISOString()
      },
      metadata: {
        processingTimeMs: processingTime,
        options: config
      }
    };
  }

  _handleTranscriptionError(error) {
    const errorMap = {
      400: 'Formato de arquivo não suportado ou arquivo corrompido',
      401: 'API Key inválida ou expirada',
      413: 'Arquivo muito grande para a API Whisper',
      429: 'Limite de rate da API excedido. Tente novamente em alguns segundos'
    };

    const message = errorMap[error.status] || `Erro na API Whisper: ${error.message}`;
    return new Error(message);
  }
}

export default new TranscriptionService();