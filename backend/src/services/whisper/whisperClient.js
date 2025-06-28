import OpenAI from 'openai';

class WhisperClient {
  constructor() {
    this.client = null;
  }

  _initClient() {
    if (!this.client) {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY não encontrada nas variáveis de ambiente');
      }

      this.client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
    return this.client;
  }

  getClient() {
    return this._initClient();
  }

  getDefaultTranscriptionConfig() {
    return {
      model: 'whisper-1',
      language: 'pt',
      response_format: 'json',
      temperature: 0
    };
  }

  getDefaultTranslationConfig() {
    return {
      model: 'whisper-1',
      response_format: 'json',
      temperature: 0
    };
  }

  async validateConnection() {
    try {
      const client = this._initClient();
      await client.models.list();
      return { valid: true };
    } catch (error) {
      return { 
        valid: false, 
        error: error.message 
      };
    }
  }
}

export default new WhisperClient();