# 📚 Documentação da API - Sistema de Reconhecimento de Voz + NLP + Automação

## 📋 Índice

- [Visão Geral](#visão-geral)
- [URL Base](#url-base)
- [Autenticação](#autenticação)
- [Endpoints](#endpoints)
  - [Principal](#principal)
  - [Health Check](#health-check)
  - [Transcrição](#transcrição)
  - [NLP](#nlp)
  - [Automação](#automação)
- [Códigos de Status](#códigos-de-status)
- [Exemplos de Uso](#exemplos-de-uso)

---

## 🌐 Visão Geral

Esta API fornece serviços de transcrição de áudio, processamento de linguagem natural e automação de comandos. O sistema processa arquivos de áudio, transcreve o conteúdo, interpreta comandos usando IA e executa ações automatizadas.

## 🔗 URL Base

```
http://localhost:5000
```

## 🔐 Autenticação

> **Nota**: Atualmente, a API não requer autenticação. Em produção, recomenda-se implementar autenticação via JWT ou API Key.

---

## 📡 Endpoints

### Principal

#### `GET /`

Retorna informações gerais sobre a API.

**Resposta de Sucesso (200)**
```json
{
  "message": "Sistema de Reconhecimento de Voz API funcionando!",
  "version": "1.0.0",
  "status": "online",
  "endpoints": {
    "health": "GET /api/health",
    "upload": "POST /api/transcribe",
    "test": "GET /api/test"
  }
}
```

---

### Health Check

#### `GET /api/health`

Verifica o status de saúde da aplicação.

**Resposta de Sucesso (200)**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-30T12:00:00.000Z",
  "uptime": 3600,
  "environment": "development",
  "memory": {
    "rss": 56782848,
    "heapTotal": 36098048,
    "heapUsed": 20436024,
    "external": 1824656,
    "arrayBuffers": 26498
  }
}
```

#### `GET /api/test`

Endpoint de teste para verificar conectividade.

**Resposta de Sucesso (200)**
```json
{
  "message": "Rota de teste funcionando!",
  "cors": "OK",
  "json": "OK",
  "timestamp": "2025-01-30T12:00:00.000Z"
}
```

---

### Transcrição

#### `POST /api/transcribe`

Realiza upload e transcrição de arquivo de áudio.

**Headers**
```
Content-Type: multipart/form-data
```

**Parâmetros do Formulário**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| audio | File | Sim | Arquivo de áudio (.mp3, .wav, .m4a, .ogg) |

**Limites**
- Tamanho máximo: 10MB
- Formatos aceitos: MP3, WAV, M4A, OGG

**Resposta de Sucesso (200)**
```json
{
  "success": true,
  "message": "Áudio transcrito com sucesso",
  "data": {
    "transcription": "Navegue para o YouTube e pesquise por vídeos de programação",
    "language": "pt",
    "duration": 5.2,
    "confidence": 0.95
  }
}
```

**Resposta de Erro (400)**
```json
{
  "success": false,
  "error": "Arquivo inválido",
  "message": "Por favor, envie um arquivo de áudio válido (.mp3, .wav, .m4a, .ogg)"
}
```

---

### NLP (Processamento de Linguagem Natural)

#### `POST /api/parse`

Interpreta texto e extrai comandos estruturados.

**Headers**
```
Content-Type: application/json
```

**Corpo da Requisição**
```json
{
  "text": "Navegue para o YouTube e pesquise por React tutorials"
}
```

**Resposta de Sucesso (200)**
```json
{
  "success": true,
  "message": "Comandos extraídos com sucesso",
  "data": {
    "commands": [
      {
        "action": "navigate",
        "target": "https://youtube.com",
        "description": "Abrir YouTube"
      },
      {
        "action": "type",
        "target": "input[name='search_query']",
        "value": "React tutorials",
        "description": "Digitar 'React tutorials' na busca"
      },
      {
        "action": "click",
        "target": "button[type='submit']",
        "description": "Clicar no botão de pesquisa"
      }
    ],
    "originalText": "Navegue para o YouTube e pesquise por React tutorials",
    "confidence": 0.92
  }
}
```

#### `POST /api/transcribe-and-parse`

Transcreve áudio e interpreta comandos em um único endpoint.

**Headers**
```
Content-Type: multipart/form-data
```

**Parâmetros do Formulário**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| audio | File | Sim | Arquivo de áudio com comandos |

**Resposta de Sucesso (200)**
```json
{
  "success": true,
  "message": "Áudio processado e comandos extraídos",
  "data": {
    "transcription": "Abra o Google e pesquise por notícias de tecnologia",
    "commands": [
      {
        "action": "navigate",
        "target": "https://google.com",
        "description": "Abrir Google"
      },
      {
        "action": "type",
        "target": "input[name='q']",
        "value": "notícias de tecnologia",
        "description": "Digitar termo de busca"
      }
    ],
    "processingTime": 2845
  }
}
```

#### `GET /api/examples`

Retorna exemplos de comandos suportados.

**Resposta de Sucesso (200)**
```json
{
  "success": true,
  "data": {
    "examples": [
      {
        "category": "navegação",
        "commands": [
          "Navegue para o site do Google",
          "Abra o YouTube",
          "Vá para a página inicial"
        ]
      },
      {
        "category": "interação",
        "commands": [
          "Clique no botão de login",
          "Preencha o campo email com teste@email.com",
          "Role a página até o final"
        ]
      },
      {
        "category": "busca",
        "commands": [
          "Pesquise por JavaScript tutorials",
          "Procure vídeos sobre React"
        ]
      }
    ]
  }
}
```

---

### Automação

#### `POST /api/execute`

Executa uma lista de comandos de automação.

**Headers**
```
Content-Type: application/json
```

**Corpo da Requisição**
```json
{
  "commands": [
    {
      "action": "navigate",
      "target": "https://example.com",
      "description": "Navegar para o site"
    },
    {
      "action": "click",
      "target": ".btn-primary",
      "description": "Clicar no botão principal"
    }
  ],
  "options": {
    "headless": false,
    "stopOnError": true
  }
}
```

**Parâmetros de Opções**
| Campo | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| headless | Boolean | false | Executar navegador em modo invisível |
| stopOnError | Boolean | true | Parar execução ao encontrar erro |
| timeout | Number | 30000 | Timeout em ms para cada comando |

**Resposta de Sucesso (200)**
```json
{
  "success": true,
  "message": "Automação executada: 2/2 comandos bem-sucedidos",
  "data": {
    "execution": {
      "successfulCommands": 2,
      "executedCommands": 2,
      "failedCommands": 0,
      "executionTimeMs": 5432
    },
    "summary": {
      "totalCommandsSent": 2,
      "totalExecuted": 2,
      "successful": 2,
      "failed": 0,
      "notExecuted": 0,
      "executionTime": "5432ms"
    }
  }
}
```

#### `POST /api/execute-single`

Executa um único comando de automação.

**Headers**
```
Content-Type: application/json
```

**Corpo da Requisição**
```json
{
  "action": "navigate",
  "target": "https://github.com",
  "value": null,
  "options": {
    "headless": true
  }
}
```

**Resposta de Sucesso (200)**
```json
{
  "success": true,
  "message": "Comando executado com sucesso",
  "data": {
    "command": {
      "id": "single_cmd",
      "action": "navigate",
      "target": "https://github.com",
      "description": "Comando único: navigate"
    },
    "result": {
      "success": true,
      "executionTime": 1234
    }
  }
}
```

#### `POST /api/browser/init`

Inicializa uma instância do navegador.

**Headers**
```
Content-Type: application/json
```

**Corpo da Requisição (Opcional)**
```json
{
  "options": {
    "headless": false,
    "width": 1280,
    "height": 720
  }
}
```

**Resposta de Sucesso (200)**
```json
{
  "success": true,
  "message": "Browser inicializado com sucesso",
  "data": {
    "browserVersion": "Chrome/120.0.0.0",
    "headless": false
  }
}
```

#### `POST /api/browser/close`

Fecha a instância do navegador.

**Resposta de Sucesso (200)**
```json
{
  "success": true,
  "message": "Browser fechado com sucesso"
}
```

#### `GET /api/status`

Retorna o status atual do sistema de automação.

**Resposta de Sucesso (200)**
```json
{
  "success": true,
  "message": "Status da automação",
  "data": {
    "running": false,
    "browserActive": true,
    "pageActive": true,
    "timestamp": "2025-01-30T12:00:00.000Z"
  }
}
```

---

## 📊 Códigos de Status

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 400 | Requisição inválida |
| 408 | Timeout |
| 413 | Arquivo muito grande |
| 415 | Tipo de mídia não suportado |
| 500 | Erro interno do servidor |
| 503 | Serviço indisponível |

---

## 💻 Exemplos de Uso

### cURL

#### Transcrever Áudio
```bash
curl -X POST http://localhost:5000/api/transcribe \
  -F "audio=@/caminho/para/audio.mp3"
```

#### Executar Comandos
```bash
curl -X POST http://localhost:5000/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "commands": [
      {
        "action": "navigate",
        "target": "https://github.com"
      }
    ]
  }'
```

### JavaScript (Fetch API)

#### Upload de Áudio
```javascript
const formData = new FormData();
formData.append('audio', audioFile);

const response = await fetch('http://localhost:5000/api/transcribe', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result.data.transcription);
```

#### Parse de Texto
```javascript
const response = await fetch('http://localhost:5000/api/parse', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: 'Navegue para o Google e faça uma pesquisa'
  })
});

const result = await response.json();
console.log(result.data.commands);
```

### Python (Requests)

#### Status da API
```python
import requests

response = requests.get('http://localhost:5000/api/health')
print(response.json())
```

#### Executar Automação
```python
import requests

commands = [
    {
        "action": "navigate",
        "target": "https://example.com"
    }
]

response = requests.post(
    'http://localhost:5000/api/execute',
    json={"commands": commands}
)

print(response.json())
```

---

## 🔒 Considerações de Segurança

1. **Validação de Entrada**: Todos os inputs são validados antes do processamento
2. **Limites de Taxa**: Recomenda-se implementar rate limiting em produção
3. **Timeout**: Comandos de automação têm timeout configurável para evitar execuções infinitas
4. **Sanitização**: URLs e seletores são sanitizados antes da execução

---

## 📝 Notas

- A API usa módulos ES6 (`type: "module"`)
- Todos os timestamps estão em formato ISO 8601
- Respostas sempre incluem campo `success` (boolean)
- Em caso de erro, sempre há campos `error` e `message`

---

**Última atualização**: Janeiro 2025  
**Versão da API**: 1.0.0