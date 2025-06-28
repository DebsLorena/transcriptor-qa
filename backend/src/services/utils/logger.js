class Logger {
  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  info(message, data = null) {
    if (this.isProduction) return;
    
    const timestamp = new Date().toISOString();
    console.log(`🔵 [${timestamp}] ${message}`);
    
    if (data) {
      console.log('📄 Data:', JSON.stringify(data, null, 2));
    }
  }
  error(message, error = null) {
    const timestamp = new Date().toISOString();
    console.error(`🔴 [${timestamp}] ${message}`);
    
    if (error) {
      if (error.stack) {
        console.error('📋 Stack:', error.stack);
      } else {
        console.error('❌ Error:', error);
      }
    }
  }

  warn(message, data = null) {
    if (this.isProduction) return;
    
    const timestamp = new Date().toISOString();
    console.warn(`🟡 [${timestamp}] ${message}`);
    
    if (data) {
      console.warn('⚠️  Data:', data);
    }
  }

  success(message, data = null) {
    if (this.isProduction) return;
    
    const timestamp = new Date().toISOString();
    console.log(`🟢 [${timestamp}] ${message}`);
    
    if (data) {
      console.log('✅ Data:', data);
    }
  }

  transcription(phase, message, data = null) {
    if (this.isProduction) return;
    
    const phases = {
      start: '🎙️',
      processing: '⚙️',
      complete: '✅',
      error: '❌',
      cleanup: '🗑️'
    };
    
    const icon = phases[phase] || '📝';
    const timestamp = new Date().toISOString();
    
    console.log(`${icon} [${timestamp}] [TRANSCRIPTION] ${message}`);
    
    if (data) {
      console.log('📊 Details:', data);
    }
  }

  performance(operation, duration, details = null) {
    if (this.isProduction) return;
    
    const timestamp = new Date().toISOString();
    console.log(`⏱️  [${timestamp}] [PERFORMANCE] ${operation}: ${duration}ms`);
    
    if (details) {
      console.log('📈 Details:', details);
    }
  }
}

const logger = new Logger();

export const logInfo = (message, data) => logger.info(message, data);
export const logError = (message, error) => logger.error(message, error);
export const logWarn = (message, data) => logger.warn(message, data);
export const logSuccess = (message, data) => logger.success(message, data);
export const logTranscription = (phase, message, data) => logger.transcription(phase, message, data);
export const logPerformance = (operation, duration, details) => logger.performance(operation, duration, details);

export default logger;