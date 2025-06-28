
import OpenAI from 'openai';
import { logInfo, logError } from '../utils/logger.js';

export class NLPCommandParser {
  
  constructor() {
    this.client = null;
    this.supportedCommands = [
      'navigate', 'click', 'type', 'search', 'wait', 'scroll', 'screenshot', 'extract'
    ];
  }

  _initClient() {
    if (!this.client) {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY não encontrada');
      }
      this.client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
    return this.client;
  }
  async parseCommands(transcriptionText, options = {}) {
    try {
      logInfo('Iniciando análise NLP do texto:', { 
        textLength: transcriptionText.length,
        preview: transcriptionText.substring(0, 100) + '...'
      });

      const client = this._initClient();
      const systemPrompt = this._buildSystemPrompt();
      const userPrompt = this._buildUserPrompt(transcriptionText, options);

      logInfo('Enviando para GPT-4:', { systemPrompt, userPrompt });
      const response = await client.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.1,
        max_tokens: 1500
      });

      const rawResult = response.choices[0].message.content;
      logInfo('Resposta do GPT-4:', { rawResult });
      const parsedCommands = this._processGPTResponse(rawResult, transcriptionText);
      
      logInfo('Comandos extraídos:', { 
        commandCount: parsedCommands.commands.length,
        confidence: parsedCommands.confidence 
      });

      return parsedCommands;

    } catch (error) {
      logError('Erro no parsing NLP:', error);
      throw new Error(`Falha na interpretação do texto: ${error.message}`);
    }
  }
  _buildSystemPrompt() {
    return `Você é um assistente especializado em interpretar comandos de voz em português para automação web.

Sua função é analisar texto transcrito e extrair comandos estruturados para automação de browsers.

COMANDOS SUPORTADOS:
- navigate: Navegar para uma URL
- click: Clicar em elemento (botão, link, etc.)
- type: Digitar texto em campo
- search: Buscar por texto na página
- wait: Aguardar tempo ou elemento
- scroll: Rolar página (up/down)
- screenshot: Capturar tela
- extract: Extrair dados da página

FORMATO DE RESPOSTA (JSON obrigatório):
{
  "intent": "descrição da intenção geral",
  "confidence": 0.85,
  "commands": [
    {
      "action": "navigate",
      "target": "https://google.com",
      "description": "Abrir Google",
      "priority": 1
    },
    {
      "action": "type",
      "target": "input[name='q']",
      "value": "texto a digitar",
      "description": "Digitar na busca",
      "priority": 2
    }
  ],
  "metadata": {
    "language": "pt",
    "complexity": "simple",
    "requiresConfirmation": false
  }
}

REGRAS:
1. SEMPRE retorne APENAS JSON válido, sem texto adicional
2. Comece sua resposta diretamente com '{'
3. Seja preciso na interpretação
4. Use seletores CSS simples quando possível
5. Priorize segurança (não comandos destrutivos sem confirmação)
6. Se não entender, retorne confidence baixo
7. NÃO adicione explicações fora do JSON`;
  }
  _buildUserPrompt(text, options) {
    const context = options.context || 'automação web geral';
    const domain = options.domain || 'qualquer site';
    
    return `Analise este texto transcrito de comando de voz e extraia comandos estruturados:

TEXTO: "${text}"

CONTEXTO: ${context}
DOMÍNIO: ${domain}

Por favor, interprete a intenção do usuário e converta em comandos executáveis.

Exemplos de interpretações:
- "Abrir o Google" → navigate para google.com
- "Clicar no botão enviar" → click no elemento button com texto "enviar"
- "Digitar meu nome no campo email" → type no input[type="email"]
- "Fazer uma busca por inteligência artificial" → navegar + digitar + clicar

IMPORTANTE: Responda APENAS com JSON válido seguindo o formato especificado. Não adicione explicações ou texto fora do JSON.`;
  }

  _processGPTResponse(rawResponse, originalText) {
    try {
      const parsed = JSON.parse(rawResponse);
      
      if (!parsed.commands || !Array.isArray(parsed.commands)) {
        throw new Error('Estrutura de comandos inválida');
      }

      const validatedCommands = parsed.commands.map((cmd, index) => {
        return this._validateCommand(cmd, index);
      }).filter(cmd => cmd !== null);
      const baseConfidence = parsed.confidence || 0.5;
      const adjustedConfidence = this._calculateAdjustedConfidence(
        baseConfidence, 
        validatedCommands.length, 
        originalText
      );

      return {
        success: true,
        intent: parsed.intent || 'Comando não especificado',
        confidence: adjustedConfidence,
        commands: validatedCommands,
        metadata: {
          ...parsed.metadata,
          originalText,
          parsedAt: new Date().toISOString(),
          commandCount: validatedCommands.length,
          processingTime: Date.now()
        }
      };

    } catch (error) {
      logError('Erro ao processar resposta do GPT:', error);
      
      return {
        success: false,
        intent: 'Falha na interpretação',
        confidence: 0.1,
        commands: [],
        metadata: {
          error: error.message,
          originalText,
          parsedAt: new Date().toISOString()
        }
      };
    }
  }

  _validateCommand(command, index) {
    try {
      if (!command.action || !this.supportedCommands.includes(command.action)) {
        logError(`Comando ${index}: ação '${command.action}' não suportada`);
        return null;
      }

      const validatedCommand = {
        id: `cmd_${index + 1}`,
        action: command.action,
        description: command.description || `Comando ${command.action}`,
        priority: command.priority || index + 1,
        ...this._validateCommandFields(command)
      };

      return validatedCommand;

    } catch (error) {
      logError(`Erro na validação do comando ${index}:`, error);
      return null;
    }
  }

  _validateCommandFields(command) {
    const fields = {};

    switch (command.action) {
      case 'navigate':
        fields.target = this._validateURL(command.target);
        break;
        
      case 'click':
        fields.target = command.target || 'button'; 
        fields.text = command.text || null; 
        break;
        
      case 'type':
        fields.target = command.target || 'input'; 
        fields.value = command.value || command.text || '';
        break;
        
      case 'search':
        fields.query = command.query || command.value || command.text || '';
        break;
        
      case 'wait':
        fields.duration = parseInt(command.duration) || 2000; 
        fields.target = command.target || null; 
        break;
        
      case 'scroll':
        fields.direction = command.direction || 'down';
        fields.amount = command.amount || 'page';
        break;
        
      case 'extract':
        fields.target = command.target || 'body';
        fields.attribute = command.attribute || 'text';
        break;
    }

    return fields;
  }

  _validateURL(url) {
    if (!url) return 'about:blank';
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      const commonSites = {
        'google': 'https://google.com',
        'youtube': 'https://youtube.com',
        'facebook': 'https://facebook.com',
        'gmail': 'https://gmail.com',
        'github': 'https://github.com'
      };
      
      return commonSites[url.toLowerCase()] || `https://${url}`;
    }
    
    return url;
  }
  _calculateAdjustedConfidence(baseConfidence, commandCount, originalText) {
    let adjusted = baseConfidence;
    
    if (commandCount === 0) adjusted *= 0.3;
    
    if (commandCount > 1) adjusted = Math.min(1, adjusted + 0.1);
    
    if (originalText.length < 10) adjusted *= 0.7;
    const keywords = ['abrir', 'clicar', 'digitar', 'buscar', 'navegar', 'ir para'];
    const hasKeywords = keywords.some(word => 
      originalText.toLowerCase().includes(word)
    );
    if (hasKeywords) adjusted = Math.min(1, adjusted + 0.15);
    
    return Math.round(adjusted * 100) / 100; 
  }
  getExamples() {
    return [
      {
        input: "Abrir o Google e buscar por inteligência artificial",
        expected: [
          { action: "navigate", target: "https://google.com" },
          { action: "type", target: "input[name='q']", value: "inteligência artificial" },
          { action: "click", target: "input[type='submit']" }
        ]
      },
      {
        input: "Clicar no botão enviar",
        expected: [
          { action: "click", target: "button", text: "enviar" }
        ]
      },
      {
        input: "Digitar meu email no campo de login",
        expected: [
          { action: "type", target: "input[type='email']", value: "{email}" }
        ]
      }
    ];
  }
}

export default new NLPCommandParser();