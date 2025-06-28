// backend/app.js
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configurações
import corsConfig from './src/config/cors.js';
import { errorHandler, notFoundHandler } from './src/middleware/errorHandler.js';

// Rotas
import routes from './src/routes/index.js';

// Configuração para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega variáveis de ambiente
dotenv.config();

// Inicializa Express
const app = express();

// Middlewares globais
app.use(corsConfig);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas principais
app.use('/', routes);

// Middlewares de erro (sempre por último)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;