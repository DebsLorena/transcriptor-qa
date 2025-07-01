// src/components/TextInput.tsx
'use client';

import { useState } from 'react';
import { FiSend, FiFileText } from 'react-icons/fi';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { Command } from '@/types';

interface TextInputProps {
  setCommands: React.Dispatch<React.SetStateAction<Command[]>>;
  setLogs: React.Dispatch<React.SetStateAction<string[]>>;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
}

export default function TextInput({
  setCommands,
  setLogs,
  isProcessing,
  setIsProcessing
}: TextInputProps) {
  const [text, setText] = useState('');
  const [parsedCommands, setParsedCommands] = useState<any[]>([]);

  const examples = [
    "Abrir o Google e buscar por inteligência artificial",
    "Ir para o YouTube e procurar música relaxante",
    "Navegar para github.com",
    "Preencher o formulário com meus dados",
    "Fazer screenshot da página"
  ];

  const handleParse = async () => {
    if (!text.trim()) {
      toast.error('Digite um comando primeiro');
      return;
    }

    setIsProcessing(true);
    setLogs(['📝 Processando texto...']);

    try {
      setLogs(prev => [...prev, '🧠 Interpretando comandos...']);
      const response = await api.post('/parse', { text });

      const commands = response.data.data.parsing.commands;
      setParsedCommands(commands);
      setCommands(commands);

      setLogs(prev => [...prev, `✅ ${commands.length} comandos identificados`]);
      toast.success('Comandos interpretados com sucesso!');
    } catch (error: any) {
      console.error('Erro:', error);
      toast.error(error.response?.data?.message || 'Erro ao processar texto');
      setLogs(prev => [...prev, '❌ Erro no processamento']);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExample = (example: string) => {
    setText(example);
    toast.success('Exemplo carregado!');
  };

  return (
    <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <FiFileText color="#7A0BC0" />
        Entrada de Texto
      </h2>
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite seu comando em linguagem natural..."
          className="w-full h-32 p-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
          disabled={isProcessing}
        />
        <div className="absolute bottom-2 right-2 text-sm text-gray-500">
          {text.length} caracteres
        </div>
      </div>
      <div className="mt-6">
        <p className="text-sm text-gray-400 mb-3">Exemplos de comandos:</p>
        <div className="flex flex-wrap gap-2">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExample(example)}
              className="text-xs px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300 hover:text-white transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {parsedCommands.length > 0 && (
        <div className="mt-6 p-4 bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-400 mb-2">Comandos interpretados:</p>
          <div className="space-y-1">
            {parsedCommands.map((cmd, index) => (
              <div key={index} className="text-sm text-white">
                {index + 1}. {cmd.description || `${cmd.action} ${cmd.target || ''}`}
              </div>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={handleParse}
        disabled={!text.trim() || isProcessing}
        className={`w-full mt-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${!text.trim() || isProcessing
          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
          : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
      >
        <FiSend />
        {isProcessing ? 'Processando...' : 'Interpretar Comando'}
      </button>
    </div>
  );
}