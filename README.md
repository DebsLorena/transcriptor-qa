# 🎙️ Sistema Inteligente de Reconhecimento de Voz + NLP + Automação

Um sistema completo que transforma áudios em ações automatizadas.
Integra reconhecimento de voz (transcrição), processamento de linguagem natural (NLP) para interpretar comandos, e automação para executar esses comandos, tudo de forma limpa, modular e escalável.

## 📌 Funcionalidades

- 🎧 **Upload de áudios** (.mp3, .wav) via interface web em Next.js
- 🧠 **Transcrição precisa** com OpenAI Whisper API
- 🤖 **Interpretação inteligente** do texto transcrito com GPT-4 para extrair comandos em formato estruturado
- ⚙️ **Automação de ações** com Puppeteer (navegar, clicar, preencher formulários, fazer screenshots)
- 🌐 **Frontend moderno** em Next.js 15 + TypeScript para upload e visualização dos resultados

## 📁 Estrutura do Projeto

```
transcriptor-app/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── transcribeController.js    # Controlador de transcrição
│   │   │   └── automationController.js    # Controlador de automação
│   │   ├── routes/
│   │   │   ├── transcribe.js              # Rotas de transcrição
│   │   │   └── automation.js              # Rotas de automação
│   │   ├── services/
│   │   │   ├── audio/
│   │   │   │   └── whisperService.js      # Integração com Whisper API
│   │   │   ├── nlp/
│   │   │   │   └── nlpCommandParser.js    # Parser de comandos com GPT-4
│   │   │   ├── automation/
│   │   │   │   └── automationRunner.js    # Executor de automações com Puppeteer
│   │   │   └── utils/
│   │   │       ├── fileHandler.js         # Manipulação de arquivos
│   │   │       └── logger.js              # Sistema de logs
│   │   └── config/
│   │       └── environment.js             # Configurações de ambiente
│   ├── uploads/                            # Diretório temporário para áudios
│   ├── server.js                           # Servidor Express principal
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                   # Página principal
│   │   │   └── layout.tsx                 # Layout da aplicação
│   │   ├── components/
│   │   │   ├── AudioUploader.tsx          # Componente de upload
│   │   │   ├── TranscriptionDisplay.tsx   # Display de transcrição
│   │   │   └── CommandList.tsx            # Lista de comandos gerados
│   │   └── services/
│   │       └── api.ts                     # Cliente da API
│   ├── public/                            # Arquivos públicos
│   └── package.json
├── .env.example                           # Exemplo de variáveis de ambiente
└── README.md                              # Este arquivo
```

## 🚀 Como Rodar o Projeto

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/transcriptor-ia.git
cd transcriptor-ia
```

### 2. Configure as variáveis de ambiente
No diretório `backend/`, crie um arquivo `.env`:

```env
# OpenAI
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx

# Server
PORT=5000
NODE_ENV=development

# Upload
MAX_FILE_SIZE=10485760  # 10MB em bytes
UPLOAD_DIR=./uploads
```

### 3. Instale as dependências

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Inicie os servidores

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

- Backend rodará em: http://localhost:5000
- Frontend rodará em: http://localhost:3000

## 🔧 Tecnologias Utilizadas

### Backend
- **Node.js** (v18+) + **Express** - Servidor e API REST
- **Multer** - Upload e gerenciamento de arquivos
- **OpenAI SDK** - Integração com Whisper API e GPT-4
- **Puppeteer** - Automação de navegador
- **Axios** - Requisições HTTP
- **fs-extra** - Manipulação avançada de arquivos
- **Dotenv** - Gerenciamento de variáveis de ambiente

### Frontend
- **Next.js 15** - Framework React com App Router
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Estilização
- **React Icons** - Ícones da interface

## ✅ Fluxo de Uso

1. **Upload**: O usuário acessa a interface web e faz upload de um áudio contendo comandos em linguagem natural
2. **Transcrição**: O backend processa o áudio com Whisper API e obtém a transcrição textual
3. **Interpretação**: O texto é enviado para o GPT-4, que interpreta e converte em comandos estruturados JSON
4. **Execução**: O Puppeteer executa as automações solicitadas (navegar, clicar, preencher formulários, etc.)
5. **Resultados**: Logs detalhados e resultados das ações são exibidos em tempo real na interface

## 📊 Exemplos de Comandos Suportados

O sistema interpreta comandos naturais como:

- "Navegue para o YouTube e pesquise por vídeos de programação"
- "Clique no primeiro resultado da pesquisa"
- "Preencha o formulário com meu nome e email"
- "Tire uma screenshot da página"
- "Role a página até o final"

## 🚀 Deploy

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Railway/Render)
Configure as variáveis de ambiente na plataforma e faça o deploy direto do GitHub.

## 💡 Melhorias Futuras

- [ ] Implementar testes automatizados com Jest e Supertest
- [ ] Suporte a mais formatos de áudio (.ogg, .m4a, .flac)
- [ ] Gravação de áudio direto no navegador
- [ ] Fila de processamento com Redis/Bull para escalabilidade
- [ ] Dashboard com histórico de transcrições e automações
- [ ] Webhooks para integração com outros serviços
- [ ] Modo batch para processar múltiplos áudios
- [ ] Export de automações como scripts reutilizáveis

## 🔒 Segurança

- Validação rigorosa de uploads (tipo, tamanho, conteúdo)
- Rate limiting nas APIs
- Sanitização de comandos antes da execução
- Timeout em automações para prevenir loops infinitos
- Logs detalhados para auditoria

## 📬 Contato

Conecte-se comigo no [LinkedIn](https://linkedin.com/in/lorenadebs)

Feedbacks, sugestões e contribuições são muito bem-vindos!

## 📜 Licença

Este projeto está licenciado sob a **Licença MIT** — você pode usar, modificar e distribuir o código, desde que dê os devidos créditos ao autor original.

---

**© 2025 Lorena Debs**