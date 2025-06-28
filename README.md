# 🎙️ Sistema Inteligente de Reconhecimento de Voz + NLP + Automação

Um sistema completo que transforma áudios em ações automatizadas.  
Integra reconhecimento de voz (transcrição), processamento de linguagem natural (NLP) para interpretar comandos, e automação para executar esses comandos, tudo de forma limpa, modular e escalável.

---

## 📌 Funcionalidades

- 🎧 Upload de áudios (.mp3, .wav) via interface web em Next.js  
- 🧠 Transcrição precisa com OpenAI Whisper API  
- 🤖 Interpretação do texto transcrito com GPT-4 para extrair comandos em formato estruturado  
- ⚙️ Automação de ações com base nos comandos extraídos (ex: navegar em URL, clicar, preencher formulários)  
- 🧪 Testes automatizados de ponta a ponta com Supertest simulando o uso real da API  
- 🌐 Frontend em Next.js para upload, visualização dos resultados e execução das automações  

---

## 📁 Estrutura do Projeto

transcriptor-app/
├── backend/
│ ├── src/
│ │ ├── routes/transcribe.js # Rota para upload e processamento do áudio
│ │ ├── services/whisperService.js # Serviço de integração com Whisper
│ │ ├── services/nlpCommandParser.js # Serviço para interpretar texto em comandos estruturados
│ │ ├── services/automationRunner.js # Serviço que executa ações automatizadas
│ │ └── utils/fileHandler.js # Funções auxiliares para manipulação de arquivos
│ ├── tests/e2eTranscription.test.js # Testes automatizados ponta a ponta
│ ├── uploads/ # Diretório para armazenar arquivos de áudio temporariamente
│ └── app.js # Inicialização do servidor Express
├── frontend/ (Next.js)
│ ├── pages/
│ │ └── index.tsx # Página principal com upload e visualização
│ ├── components/ # Componentes React reutilizáveis
│ └── styles/ # Arquivos de estilos (TailwindCSS)
├── .env # Variáveis de ambiente (API Keys, portas, etc)
├── README.md # Este arquivo

yaml
Copiar
Editar

## 🚀 Como Rodar o Projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/transcriptor-ia.git
cd transcriptor-ia 
```
### 2. Configure as variáveis de ambiente
No diretório backend/, crie um arquivo .env com o conteúdo:

```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
PORT=5000
```
### 3. Instale as dependências
```
# Backend
cd backend
npm install


# Frontend
cd ../frontend
npm install
```
### 4. Inicie os servidores
```
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm run dev
```
---

## 🔧 Tecnologias Utilizadas
### Backend
- Node.js + Express

- Multer (upload de arquivos)

- OpenAI Whisper API (transcrição de áudio)

- OpenAI GPT-4 (NLP para interpretar comandos e gerar testes)

- Supertest + Jest (testes automatizados ponta a ponta)

- Frontend (Next.js)

### Next.js 14+

- TailwindCSS

- Axios (consumo da API)

## ✅ Fluxo de Uso
- O usuário acessa a interface web e faz upload de um áudio contendo comandos em linguagem natural.

- O backend processa o áudio com Whisper e obtém a transcrição textual.

- O texto é enviado para o GPT-4, que interpreta e converte em comandos estruturados.

- O sistema executa as automações solicitadas (ex: navegar para URL, clicar em botões, preencher formulários).

-  Resultados e logs das ações são exibidos na interface.

-  Simultaneamente, testes automatizados validam todo o fluxo para garantir qualidade.

## 🧪 Como Executar os Testes Automatizados
- No diretório backend/, rode:
```
npm run test
```
### Os testes cobrem:

- Upload e processamento do áudio

- Transcrição correta

- Interpretação e geração de comandos

- Execução das automações

- Tempo de resposta e estabilidade da API

## 💡 Possíveis Melhorias Futuras
- Implementar fila de processamento para maior escalabilidade (ex: Redis + Bull)

- Criar histórico e dashboard para transcrições e automações

- Permitir gravação de áudio direto no navegador

- Deploy integrado usando Vercel (frontend) e Render/Heroku (backend)

- Integração com outros serviços de automação e controle de dispositivos

## 📬 Contato
Conecte-se comigo no LinkedIn
Feedbacks, sugestões e contribuições são muito bem-vindos!

## 📜 Licença

Este projeto está licenciado sob a Licença MIT — você pode usar, modificar e distribuir o código, desde que dê os devidos créditos ao autor original (Lorena Debs).  


##* Copyright (c) 2025 Lorena Debs