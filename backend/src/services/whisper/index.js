export { default as whisperClient } from './whisperClient.js';
export { default as transcriptionService } from './transcriptionService.js';


export const transcribeAudio = async (filePath, options = {}) => {
  const { default: service } = await import('./transcriptionService.js');
  return service.transcribe(filePath, options);
};