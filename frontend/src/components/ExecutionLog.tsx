// src/components/ExecutionLog.tsx
'use client';

import { useEffect, useRef } from 'react';
import { FiTerminal, FiTrash2 } from 'react-icons/fi';

interface ExecutionLogProps {
  logs: string[];
  onClear?: () => void;
}

export default function ExecutionLog({ logs, onClear }: ExecutionLogProps) {
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll para o final quando novos logs aparecem
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLogColor = (log: string) => {
    if (log.includes('✅')) return 'text-green-400';
    if (log.includes('❌')) return 'text-red-400';
    if (log.includes('🔵')) return 'text-blue-400';
    if (log.includes('⚠️')) return 'text-yellow-400';
    if (log.includes('📤')) return 'text-purple-400';
    if (log.includes('🧠')) return 'text-cyan-400';
    return 'text-gray-300';
  };

  const formatTimestamp = () => {
    return new Date().toLocaleTimeString('pt-BR');
  };

  return (
    <div className="mt-8 bg-gray-900 rounded-lg p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FiTrash2 color="gray" size={14} />
          Logs de Execução
        </h3>
        {onClear && logs.length > 0 && (
          <button
            onClick={onClear}
            className="text-sm text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1"
          >
            <FiTrash2 size={14} />
            Limpar
          </button>
        )}
      </div>

      <div className="bg-black rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
        {logs.length === 0 ? (
          <div className="text-gray-600 text-center py-8">
            Nenhum log ainda...
          </div>
        ) : (
          <div className="space-y-1">
            {logs.map((log, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="text-gray-600 text-xs whitespace-nowrap">
                  [{formatTimestamp()}]
                </span>
                <span className={getLogColor(log)}>
                  {log}
                </span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>{logs.length} logs</span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Sistema ativo
        </span>
      </div>
    </div>
  );
}