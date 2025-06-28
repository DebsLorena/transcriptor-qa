
import puppeteer from 'puppeteer';
import { logInfo, logError, logSuccess, logWarn } from '../utils/logger.js';

export class AutomationRunner {
  
  constructor() {
    this.browser = null;
    this.page = null;
    this.isRunning = false;
    this.defaultTimeout = 30000; 
  }

  async initialize(options = {}) {
    try {
      if (this.browser) {
        await this.close();
      }

      logInfo('Inicializando browser para automação...');

      const browserOptions = {
        headless: process.env.PUPPETEER_HEADLESS !== 'false', 
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
          '--disable-blink-features=AutomationControlled',
          '--no-first-run'
        ],
        defaultViewport: {
          width: 1280,
          height: 720
        },
        ...options
      };

      this.browser = await puppeteer.launch(browserOptions);
      this.page = await this.browser.newPage();

      this.page.setDefaultNavigationTimeout(this.defaultTimeout);
      this.page.setDefaultTimeout(this.defaultTimeout);

      await this.page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      await this.page.goto('about:blank');
      await this.delay(1000); 

      this.isRunning = true;
      logSuccess('Browser inicializado com sucesso');

      return {
        success: true,
        message: 'Browser pronto para automação'
      };

    } catch (error) {
      logError('Erro ao inicializar browser:', error);
      throw new Error(`Falha na inicialização: ${error.message}`);
    }
  }


  async executeCommands(commands, options = {}) {
    try {
      if (!this.isRunning || !this.browser || !this.page) {
        logInfo('Browser não inicializado, inicializando...');
        await this.initialize(options);
      }

      if (!Array.isArray(commands) || commands.length === 0) {
        throw new Error('Lista de comandos vazia ou inválida');
      }

      logInfo(`Executando ${commands.length} comando(s)`, {
        commandCount: commands.length,
        firstCommand: commands[0]?.action
      });

      const results = [];
      const startTime = Date.now();

      for (let i = 0; i < commands.length; i++) {
        const command = commands[i];
        
        try {
          logInfo(`Executando comando ${i + 1}/${commands.length}: ${command.action}`);
          
          const result = await this.executeCommand(command);
          results.push({
            commandIndex: i,
            command: command,
            result: result,
            success: true
          });

          if (i < commands.length - 1) {
            await this.delay(500);
          }

        } catch (error) {
          logError(`Erro no comando ${i + 1}:`, error);
          results.push({
            commandIndex: i,
            command: command,
            error: error.message,
            success: false
          });

          if (options.stopOnError) {
            break;
          }
        }
      }

      const executionTime = Date.now() - startTime;
      const successCount = results.filter(r => r.success).length;
      
      logSuccess(`Execução concluída: ${successCount}/${commands.length} comandos bem-sucedidos em ${executionTime}ms`);

      return {
        success: true,
        executedCommands: results.length,
        successfulCommands: successCount,
        failedCommands: results.length - successCount,
        executionTimeMs: executionTime,
        results: results,
        metadata: {
          browserInfo: await this.getBrowserInfo(),
          executedAt: new Date().toISOString()
        }
      };

    } catch (error) {
      logError('Erro na execução de comandos:', error);
      throw new Error(`Falha na execução: ${error.message}`);
    }
  }

  async executeCommand(command) {
    const { action, target, value, duration, direction, amount } = command;

    switch (action) {
      case 'navigate':
        return await this.navigate(target);
        
      case 'click':
        return await this.click(target, command.text);
        
      case 'type':
        return await this.type(target, value);
        
      case 'wait':
        return await this.wait(duration || 2000, target);
        
      case 'scroll':
        return await this.scroll(direction || 'down', amount || 'page');
        
      case 'screenshot':
        return await this.screenshot(target);
        
      case 'extract':
        return await this.extractText(target, command.attribute);
        
      default:
        throw new Error(`Ação não suportada: ${action}`);
    }
  }

  async navigate(url) {
    try {
      logInfo(`Navegando para: ${url}`);
      
      if (!url || url === 'about:blank') {
        throw new Error('URL inválida ou vazia');
      }

      const targetUrl = url.startsWith('http') ? url : `https://${url}`;
      
      await this.page.goto(targetUrl, { 
        waitUntil: 'networkidle2',
        timeout: this.defaultTimeout 
      });

      await this.page.waitForLoadState?.('domcontentloaded').catch(() => {});

      const currentUrl = this.page.url();
      logSuccess(`Navegação concluída: ${currentUrl}`);

      return {
        action: 'navigate',
        target: targetUrl,
        result: currentUrl,
        success: true
      };

    } catch (error) {
      logError(`Erro na navegação para ${url}:`, error);
      throw new Error(`Navegação falhou: ${error.message}`);
    }
  }

  async click(selector, text = null) {
    try {
      logInfo(`Clicando em: ${selector}${text ? ` com texto "${text}"` : ''}`);

      await this.page.waitForLoadState?.('domcontentloaded').catch(() => {});

      let element;

      if (text) {
        const xpath = `//*[contains(text(), "${text}")]`;
        const elements = await this.page.$x(xpath);
        element = elements[0] || null;
      }

      if (!element) {
        await this.page.waitForSelector(selector, { 
          visible: true, 
          timeout: 10000 
        });
        element = await this.page.$(selector);
      }

      if (!element) {
        throw new Error(`Elemento não encontrado: ${selector}${text ? ` com texto "${text}"` : ''}`);
      }

      await this.delay(500);
      await element.click();
      
      logSuccess(`Clique realizado com sucesso`);

      return {
        action: 'click',
        target: selector,
        text: text,
        success: true
      };

    } catch (error) {
      logError(`Erro no clique:`, error);
      throw new Error(`Clique falhou: ${error.message}`);
    }
  }

  async type(selector, text) {
    try {
      logInfo(`Digitando "${text}" em: ${selector}`);

      await this.page.waitForSelector(selector, { 
        state: 'visible', 
        timeout: 10000 
      });

      const element = await this.page.$(selector);
      if (!element) {
        throw new Error(`Campo não encontrado: ${selector}`);
      }

      await element.click({ clickCount: 3 });
      await element.press('Backspace');

      await element.type(text, { delay: 50 });

      logSuccess(`Texto digitado com sucesso`);

      return {
        action: 'type',
        target: selector,
        value: text,
        success: true
      };

    } catch (error) {
      logError(`Erro na digitação:`, error);
      throw new Error(`Digitação falhou: ${error.message}`);
    }
  }

  async wait(duration, selector = null) {
    try {
      if (selector) {
        logInfo(`Aguardando elemento: ${selector}`);
        await this.page.waitForSelector(selector, { timeout: duration });
        logSuccess(`Elemento apareceu: ${selector}`);
      } else {
        logInfo(`Aguardando ${duration}ms`);
        await this.delay(duration);
        logSuccess(`Aguardo de ${duration}ms concluído`);
      }

      return {
        action: 'wait',
        duration: duration,
        target: selector,
        success: true
      };

    } catch (error) {
      logError(`Erro no aguardo:`, error);
      throw new Error(`Aguardo falhou: ${error.message}`);
    }
  }

  async scroll(direction = 'down', amount = 'page') {
    try {
      logInfo(`Rolando página: ${direction} (${amount})`);

      const scrollAmount = amount === 'page' ? 
        await this.page.evaluate(() => window.innerHeight) : 
        parseInt(amount) || 500;

      const scrollY = direction === 'down' ? scrollAmount : -scrollAmount;

      await this.page.evaluate((y) => {
        window.scrollBy(0, y);
      }, scrollY);

      await this.delay(500); 

      logSuccess(`Rolagem concluída`);

      return {
        action: 'scroll',
        direction: direction,
        amount: scrollAmount,
        success: true
      };

    } catch (error) {
      logError(`Erro na rolagem:`, error);
      throw new Error(`Rolagem falhou: ${error.message}`);
    }
  }

  async screenshot(filename = null) {
    try {
      const screenshotName = filename || `screenshot-${Date.now()}.png`;
      const path = `uploads/${screenshotName}`;

      logInfo(`Capturando screenshot: ${screenshotName}`);

      await this.page.screenshot({ 
        path: path,
        fullPage: true 
      });

      logSuccess(`Screenshot salvo: ${path}`);

      return {
        action: 'screenshot',
        filename: screenshotName,
        path: path,
        success: true
      };

    } catch (error) {
      logError(`Erro no screenshot:`, error);
      throw new Error(`Screenshot falhou: ${error.message}`);
    }
  }

  async extractText(selector, attribute = 'text') {
    try {
      logInfo(`Extraindo ${attribute} de: ${selector}`);

      const elements = await this.page.$$(selector);
      const results = [];

      for (const element of elements) {
        let value;
        
        switch (attribute) {
          case 'text':
            value = await element.textContent();
            break;
          case 'html':
            value = await element.innerHTML();
            break;
          default:
            value = await element.getAttribute(attribute);
        }

        if (value && value.trim()) {
          results.push(value.trim());
        }
      }

      logSuccess(`Extraído ${results.length} valor(es)`);

      return {
        action: 'extract',
        target: selector,
        attribute: attribute,
        results: results,
        count: results.length,
        success: true
      };

    } catch (error) {
      logError(`Erro na extração:`, error);
      throw new Error(`Extração falhou: ${error.message}`);
    }
  }

  async close() {
    try {
      if (this.browser) {
        logInfo('Fechando browser...');
        await this.browser.close();
        this.browser = null;
        this.page = null;
        this.isRunning = false;
        logSuccess('Browser fechado com sucesso');
      }
    } catch (error) {
      logError('Erro ao fechar browser:', error);
    }
  }

  async getBrowserInfo() {
    try {
      if (this.page) {
        const userAgent = await this.page.evaluate(() => navigator.userAgent);
        const url = this.page.url();
        const title = await this.page.title();
        
        return {
          userAgent,
          currentUrl: url,
          pageTitle: title
        };
      }
      return null;
    } catch (error) {
      return { error: error.message };
    }
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new AutomationRunner();