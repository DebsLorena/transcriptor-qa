import nlpCommandParser from '../services/nlp/nlpCommandParser.js';
import { logInfo, logError } from '../services/utils/logger.js';

export const parseTextCommands = async (req, res) => {
  try {
    const { text, context, domain } = req.body;
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Texto obrigatório',
        message: 'Por favor, forneça um texto para análise'
      });
    }

    if (text.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Texto muito longo',
        message: 'O texto deve ter no máximo 1000 caracteres'
      });
    }

    logInfo('Processando comando de texto:', { 
      textLength: text.length,
      context: context || 'none',
      domain: domain || 'general'
    });

    const options = {
      context: context || 'automação web geral',
      domain: domain || 'qualquer site'
    };
    const result = await nlpCommandParser.parseCommands(text, options);
    res.json({
      success: true,
      message: 'Comandos extraídos com sucesso',
      data: {
        parsing: result,
        input: {
          text,
          options,
          processedAt: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    logError('Erro no controller NLP:', error);
    let statusCode = 500;
    let errorType = 'Erro interno';

    if (error.message.includes('API Key')) {
      statusCode = 401;
      errorType = 'Erro de autenticação';
    } else if (error.message.includes('rate')) {
      statusCode = 429;
      errorType = 'Limite excedido';
    }

    res.status(statusCode).json({
      success: false,
      error: errorType,
      message: process.env.NODE_ENV === 'development' 
        ? error.message 
        : 'Erro ao processar comando de texto'
    });
  }
};


export const transcribeAndParse = async (req, res) => {
  try {
    res.status(501).json({
      success: false,
      message: 'Endpoint em desenvolvimento - será implementado na próxima etapa'
    });

  } catch (error) {
    logError('Erro no endpoint combinado:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno',
      message: error.message
    });
  }
};

export const getExamples = (req, res) => {
  try {
    const examples = nlpCommandParser.getExamples();
    
    res.json({
      success: true,
      message: 'Exemplos de comandos suportados',
      data: {
        examples,
        supportedActions: [
          'navigate', 'click', 'type', 'search', 
          'wait', 'scroll', 'screenshot', 'extract'
        ],
        usage: {
          endpoint: 'POST /api/parse',
          requiredFields: ['text'],
          optionalFields: ['context', 'domain']
        }
      }
    });

  } catch (error) {
    logError('Erro ao obter exemplos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno',
      message: error.message
    });
  }
};