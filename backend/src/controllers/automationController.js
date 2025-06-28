import automationRunner from '../services/automation/automationRunner.js';
import { logInfo, logError, logSuccess } from '../services/utils/logger.js';

export const executeCommands = async (req, res) => {
  try {
    const { commands, options = {} } = req.body;
    if (!commands || !Array.isArray(commands) || commands.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Comandos obrigatórios',
        message: 'Por favor, forneça uma lista de comandos para executar'
      });
    }

    if (commands.length > 20) {
      return res.status(400).json({
        success: false,
        error: 'Muitos comandos',
        message: 'Máximo de 20 comandos por execução'
      });
    }

    logInfo('Iniciando execução de automação', {
      commandCount: commands.length,
      options
    });

    const result = await automationRunner.executeCommands(commands, {
      stopOnError: options.stopOnError !== false, 
      headless: options.headless !== false,
      ...options
    });

    logSuccess('Automação concluída', {
      successfulCommands: result.successfulCommands,
      totalCommands: result.executedCommands
    });

    res.json({
      success: true,
      message: `Automação executada: ${result.successfulCommands}/${result.executedCommands} comandos bem-sucedidos`,
      data: {
        execution: result,
        summary: {
          totalCommands: result.executedCommands,
          successful: result.successfulCommands,
          failed: result.failedCommands,
          executionTime: `${result.executionTimeMs}ms`
        }
      }
    });

  } catch (error) {
    logError('Erro no controller de automação:', error);

    let statusCode = 500;
    let errorType = 'Erro interno';

    if (error.message.includes('Falha na inicialização')) {
      statusCode = 503;
      errorType = 'Serviço indisponível';
    } else if (error.message.includes('timeout')) {
      statusCode = 408;
      errorType = 'Timeout';
    }

    res.status(statusCode).json({
      success: false,
      error: errorType,
      message: process.env.NODE_ENV === 'development' 
        ? error.message 
        : 'Erro ao executar automação'
    });
  }
};

export const executeSingleCommand = async (req, res) => {
  try {
    const { action, target, value, options = {} } = req.body;

    if (!action) {
      return res.status(400).json({
        success: false,
        error: 'Ação obrigatória',
        message: 'Por favor, especifique uma ação'
      });
    }

    const command = {
      id: 'single_cmd',
      action,
      target,
      value,
      description: `Comando único: ${action}`
    };

    logInfo('Executando comando único', command);

    const result = await automationRunner.executeCommands([command], options);

    res.json({
      success: true,
      message: 'Comando executado com sucesso',
      data: {
        command,
        result: result.results[0]
      }
    });

  } catch (error) {
    logError('Erro na execução de comando único:', error);
    res.status(500).json({
      success: false,
      error: 'Erro na execução',
      message: error.message
    });
  }
};

export const initializeBrowser = async (req, res) => {
  try {
    const { options = {} } = req.body;

    logInfo('Inicializando browser via endpoint');

    const result = await automationRunner.initialize({
      headless: options.headless !== false,
      ...options
    });

    res.json({
      success: true,
      message: 'Browser inicializado com sucesso',
      data: result
    });

  } catch (error) {
    logError('Erro na inicialização do browser:', error);
    res.status(500).json({
      success: false,
      error: 'Falha na inicialização',
      message: error.message
    });
  }
};

export const closeBrowser = async (req, res) => {
  try {
    logInfo('Fechando browser via endpoint');

    await automationRunner.close();

    res.json({
      success: true,
      message: 'Browser fechado com sucesso'
    });

  } catch (error) {
    logError('Erro ao fechar browser:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao fechar browser',
      message: error.message
    });
  }
};
export const getStatus = (req, res) => {
  try {
    const status = {
      running: automationRunner.isRunning,
      browserActive: !!automationRunner.browser,
      pageActive: !!automationRunner.page,
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Status da automação',
      data: status
    });

  } catch (error) {
    logError('Erro ao obter status:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno',
      message: error.message
    });
  }
};