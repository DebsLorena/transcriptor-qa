'use client';

import { useState } from 'react';
import AudioUploader from '@/components/AudioUploader';
import { Toaster } from 'react-hot-toast';
import TextInput from '@/components/TextInput';
import CommandList from '@/components/CommandList';
import ExecutionLog from '@/components/ExecutionLog';
import { Command } from '@/types';
export default function Home() {
  const [modo, setModo] = useState<'audio' | 'texto'>('audio');
  const [comandos, setComandos] = useState<Command[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [processando, setProcessando] = useState(false);

  const limparLogs = () => setLogs([]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 font-sans antialiased">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#f5f5f5',
            border: '1px solid #333',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#a3a3a3',
              secondary: '#1a1a1a',
            },
          },
          error: {
            iconTheme: {
              primary: '#737373',
              secondary: '#1a1a1a',
            },
          },
        }}
      />

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Cabeçalho */}
        <header className="text-center mb-16 animate-fadeIn">
          <h1 className="text-4xl font-light tracking-tight mb-2">
            Sistema de Reconhecimento de Voz
          </h1>
          <p className="text-neutral-400 text-sm font-light">
            Converta comandos de voz em ações automatizadas
          </p>
        </header>

        {/* Alternador de modo */}
        <div className="flex justify-center mb-12 animate-fadeIn">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-1 flex gap-1 shadow-sm backdrop-blur-sm">
            <button
              onClick={() => setModo('audio')}
              className={`px-6 py-2 rounded-md text-sm transition-all duration-200 ${modo === 'audio'
                ? 'bg-neutral-800 text-white shadow'
                : 'text-neutral-400 hover:text-white'
                }`}
            >
              Áudio
            </button>
            <button
              onClick={() => setModo('texto')}
              className={`px-6 py-2 rounded-md text-sm transition-all duration-200 ${modo === 'texto'
                ? 'bg-neutral-800 text-white shadow'
                : 'text-neutral-400 hover:text-white'
                }`}
            >
              Texto
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
          {modo === 'audio' ? (
            <AudioUploader
              onTranscription={(texto) => console.log('Transcrição:', texto)}
              setCommands={setComandos}
              setLogs={setLogs}
              isProcessing={processando}
              setIsProcessing={setProcessando}
            />
          ) : (
            <TextInput
              setCommands={setComandos}
              setLogs={setLogs}
              isProcessing={processando}
              setIsProcessing={setProcessando}
            />
          )}

          {comandos.length > 0 && (
            <CommandList
              commands={comandos}
              onExecute={() => console.log('Executar comandos')}
            />
          )}

          {logs.length > 0 && <ExecutionLog logs={logs} onClear={limparLogs} />}
        </div>
      </div>
    </main>
  );
}
