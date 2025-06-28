// backend/server.js
import app from './app.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 Acesse: http://localhost:${PORT}`);
  console.log(`🔊 Upload de áudio: POST http://localhost:${PORT}/api/transcribe`);
  console.log(`💾 Arquivos salvos em: ${path.join(__dirname, 'uploads')}`);
});