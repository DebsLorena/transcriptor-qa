import fs from 'fs';
import path from 'path';

export class FileValidator {
  
  constructor() {
    this.maxSizeMB = 25; 
    this.allowedExtensions = ['.mp3', '.wav', '.m4a', '.mp4', '.mpeg', '.mpga', '.webm'];
    this.allowedMimeTypes = [
      'audio/mpeg', 
      'audio/wav', 
      'audio/mp3', 
      'audio/m4a',
      'audio/mp4',
      'audio/webm'
    ];
  }

  validate(filePath) {
    try {
      if (!fs.existsSync(filePath)) {
        return this._createErrorResult('Arquivo não encontrado');
      }
      const sizeValidation = this._validateSize(filePath);
      if (!sizeValidation.valid) {
        return sizeValidation;
      }
      const extensionValidation = this._validateExtension(filePath);
      if (!extensionValidation.valid) {
        return extensionValidation;
      }
      const integrityValidation = this._validateIntegrity(filePath);
      if (!integrityValidation.valid) {
        return integrityValidation;
      }

      return this._createSuccessResult(filePath, sizeValidation.sizeInMB, extensionValidation.extension);

    } catch (error) {
      return this._createErrorResult(`Erro na validação: ${error.message}`);
    }
  }

  _validateSize(filePath) {
    const stats = fs.statSync(filePath);
    const sizeInMB = stats.size / (1024 * 1024);

    if (sizeInMB > this.maxSizeMB) {
      return this._createErrorResult(
        `Arquivo muito grande: ${sizeInMB.toFixed(2)}MB. Máximo: ${this.maxSizeMB}MB`
      );
    }

    if (sizeInMB < 0.001) { 
      return this._createErrorResult('Arquivo muito pequeno ou vazio');
    }

    return { valid: true, sizeInMB };
  }

  _validateExtension(filePath) {
    const extension = path.extname(filePath).toLowerCase();

    if (!this.allowedExtensions.includes(extension)) {
      return this._createErrorResult(
        `Extensão não suportada: ${extension}. Permitidas: ${this.allowedExtensions.join(', ')}`
      );
    }

    return { valid: true, extension };
  }

  _validateIntegrity(filePath) {
    try {
      const fd = fs.openSync(filePath, 'r');
      const buffer = Buffer.alloc(10);
      fs.readSync(fd, buffer, 0, 10, 0);
      fs.closeSync(fd);

      const isEmptyOrZeros = buffer.every(byte => byte === 0);
      if (isEmptyOrZeros) {
        return this._createErrorResult('Arquivo parece estar corrompido ou vazio');
      }

      return { valid: true };

    } catch (error) {
      return this._createErrorResult('Não foi possível ler o arquivo - pode estar corrompido');
    }
  }

  _createErrorResult(message) {
    return {
      valid: false,
      error: message
    };
  }

  _createSuccessResult(filePath, sizeInMB, extension) {
    return {
      valid: true,
      file: {
        path: filePath,
        sizeInMB: parseFloat(sizeInMB.toFixed(2)),
        extension,
        validatedAt: new Date().toISOString()
      }
    };
  }

  isValidMimeType(mimeType) {
    return this.allowedMimeTypes.includes(mimeType);
  }

  getLimits() {
    return {
      maxSizeMB: this.maxSizeMB,
      allowedExtensions: this.allowedExtensions,
      allowedMimeTypes: this.allowedMimeTypes
    };
  }
}

export default new FileValidator();