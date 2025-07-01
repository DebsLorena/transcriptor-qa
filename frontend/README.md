# Sistema de comandos com automatização

Sistema web que converte comandos de voz ou texto em ações automatizadas de navegador.

## Arquitetura

```
Frontend (Next.js) → API Backend → Automação Browser
```

## Funcionalidades

**Entrada de Comandos**
- 🎤 **Modo Áudio**: Upload de arquivo de áudio (MP3, WAV, M4A)
- ⌨️ **Modo Texto**: Digite comandos em linguagem natural

**Processamento**
1. Transcrição de áudio em texto (quando aplicável)
2. Interpretação de comandos em linguagem natural
3. Execução automatizada no navegador

**Comandos Suportados**
- `navigate` - Navegar para sites
- `click` - Clicar em elementos
- `type` - Digitar texto
- `search` - Fazer buscas
- `screenshot` - Capturar tela
- `scroll` - Rolar página
- `wait` - Aguardar tempo
- `extract` - Extrair dados

## Exemplo de Uso

```
"Abrir o Google e buscar por inteligência artificial"
↓
1. navigate → google.com
2. type → "inteligência artificial"
3. click → botão buscar
```

## Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Comunicação**: Axios
- **UI**: React Icons, React Hot Toast


