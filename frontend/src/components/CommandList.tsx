// src/components/CommandList.tsx
'use client';

import { useState } from 'react';
import { FiPlay, FiTrash2, FiCode, FiEye, FiEyeOff } from 'react-icons/fi';
import api from '@/services/api';
import toast from 'react-hot-toast';

interface Command {
  id?: string;
  action: string;
  target?: string;
  value?: string;
  description?: string;
  priority?: number;
}

interface CommandListProps {
  commands: Command[];
  onExecute?: () => void;
}

export default function CommandList({ commands, onExecute }: CommandListProps) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [executionResults, setExecutionResults] = useState<any>(null);

  const actionIcons: Record<string, string> = {
    navigate: '🌐',
    click: '👆',
    type: '⌨️',
    wait: '⏱️',
    scroll: '📜',
    screenshot: '📸',
    extract: '📊',
    search: '🔍'
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    setExecutionResults(null);

    try {
      const response = await api.post('/execute', {
        commands,
        options: {
          headless: false,
          stopOnError: true
        }
      });

      setExecutionResults(response.data);
      if (response.data.data?.summary?.notExecuted > 0) {
        toast(`Execução parcial: ${response.data.data.summary.notExecuted} comandos não foram executados`, {
          icon: '⚠️',
          style: {
            background: '#713200',
            color: '#fff',
          },
        });
      } else if (response.data.data?.summary?.failed > 0) {
        toast.error(`Execução com falhas: ${response.data.data.summary.failed} comandos falharam`);
      } else {
        toast.success('Todos os comandos foram executados com sucesso!');
      }

      if (onExecute) onExecute();
    } catch (error: any) {
      console.error('Erro:', error);
      toast.error(error.response?.data?.message || 'Erro ao executar comandos');
    } finally {
      setIsExecuting(false);
    }
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      navigate: 'text-blue-400',
      click: 'text-green-400',
      type: 'text-yellow-400',
      wait: 'text-gray-400',
      scroll: 'text-purple-400',
      screenshot: 'text-pink-400',
      extract: 'text-orange-400',
      search: 'text-cyan-400'
    };
    return colors[action] || 'text-gray-400';
  };

  const getExecutionStatusColor = () => {
    if (!executionResults?.data?.summary) return 'bg-gray-900/30 border-gray-700';

    const { successful, failed, notExecuted } = executionResults.data.summary;

    if (notExecuted > 0) return 'bg-yellow-900/30 border-yellow-700';
    if (failed > 0) return 'bg-red-900/30 border-red-700';
    if (successful === commands.length) return 'bg-green-900/30 border-green-700';
    return 'bg-gray-900/30 border-gray-700';
  };


  return (
    <div className="mt-8 bg-gray-800 rounded-lg p-8 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <span className="text-green-500">
            <FiCode />
          </span>
          Comandos Gerados
        </h2>
        <button
          onClick={() => setShowJson(!showJson)}
          className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
        >
          {showJson ? <FiEyeOff /> : <FiEye />}
          {showJson ? 'Ocultar' : 'Ver'} JSON
        </button>
      </div>

      {/* Commands List */}
      <div className="space-y-3 mb-6">
        {commands.map((command, index) => (
          <div
            key={command.id || index}
            className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <span className="text-2xl">
              {actionIcons[command.action] || '🔧'}
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`font-mono text-sm ${getActionColor(command.action)}`}>
                  {command.action}
                </span>
                {command.target && (
                  <span className="text-gray-400 text-sm">
                    → {command.target}
                  </span>
                )}
              </div>
              {command.description && (
                <p className="text-sm text-gray-300 mt-1">
                  {command.description}
                </p>
              )}
              {command.value && (
                <p className="text-sm text-gray-400 mt-1">
                  Valor: "{command.value}"
                </p>
              )}
            </div>
            <span className="text-xs text-gray-500">
              #{index + 1}
            </span>
          </div>
        ))}
      </div>

      {/* JSON View */}
      {showJson && (
        <div className="mb-6 p-4 bg-gray-900 rounded-lg overflow-x-auto">
          <pre className="text-xs text-gray-300">
            {JSON.stringify(commands, null, 2)}
          </pre>
        </div>
      )}

      {/* Execution Results */}
      {executionResults && executionResults.data?.summary && (
        <div className={`mb-6 p-4 rounded-lg ${getExecutionStatusColor()}`}>
          <p className="text-sm mb-2 font-semibold">{executionResults.message}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-300">
            <div>
              <p className="text-gray-400">Total Enviados:</p>
              <p className="font-mono text-lg">{executionResults.data.summary.totalCommandsSent}</p>
            </div>
            <div>
              <p className="text-gray-400">✅ Sucesso:</p>
              <p className="font-mono text-lg text-green-400">{executionResults.data.summary.successful}</p>
            </div>
            <div>
              <p className="text-gray-400">❌ Falhas:</p>
              <p className="font-mono text-lg text-red-400">{executionResults.data.summary.failed}</p>
            </div>
            <div>
              <p className="text-gray-400">⏭️ Não Executados:</p>
              <p className="font-mono text-lg text-yellow-400">{executionResults.data.summary.notExecuted}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-700">
            <p className="text-xs text-gray-400">
              ⏱️ Tempo de execução: {executionResults.data.summary.executionTime}
            </p>
            {executionResults.data.summary.notExecuted > 0 && (
              <p className="text-xs text-yellow-400 mt-1">
                ⚠️ A execução foi interrompida antes de processar todos os comandos
              </p>
            )}
          </div>
        </div>
      )}

      {/* Execute Button */}
      <button
        onClick={handleExecute}
        disabled={isExecuting || commands.length === 0}
        className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${isExecuting || commands.length === 0
          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
          : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
      >
        <FiPlay />
        {isExecuting ? 'Executando...' : `Executar ${commands.length} Comandos`}
      </button>
    </div>
  );
}