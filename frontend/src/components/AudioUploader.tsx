'use client';

import { useState, useRef } from 'react';
import { FiUpload, FiMic, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '@/services/api';
import { Command } from '@/types';

interface AudioUploaderProps {
  onTranscription: (text: string) => void;
  setCommands: React.Dispatch<React.SetStateAction<Command[]>>;
  setLogs: React.Dispatch<React.SetStateAction<string[]>>;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
}

export default function AudioUploader({
  onTranscription,
  setCommands,
  setLogs,
  isProcessing,
  setIsProcessing
}: AudioUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [transcribedText, setTranscribedText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/m4a'];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error('Please select a valid audio file');
        return;
      }
      setFile(selectedFile);
      toast.success('File selected');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setIsProcessing(true);
    setLogs(['Uploading file...']);

    try {
      const formData = new FormData();
      formData.append('audio', file);

      const transcribeResponse = await api.post('/transcribe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const text = transcribeResponse.data.data.transcription.text;
      setTranscribedText(text);
      onTranscription(text);
      setLogs(prev => [...prev, `Transcription: "${text}"`]);

      setLogs(prev => [...prev, 'Interpreting commands...']);
      const parseResponse = await api.post('/parse', { text });

      const commands = parseResponse.data.data.parsing.commands;
      setCommands(commands);
      setLogs(prev => [...prev, `${commands.length} commands identified`]);

      toast.success('Audio processed successfully');
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Processing error');
      setLogs(prev => [...prev, 'Processing failed']);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-zinc-800 rounded-xl p-8 border border-zinc-700">
      <h2 className="text-lg font-light text-zinc-100 mb-6 flex items-center gap-3">
        <span className="text-zinc-400">
          <FiMic size={20} />
        </span>
        Audio Upload
      </h2>

      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border border-dashed border-zinc-600 rounded-lg p-16 text-center cursor-pointer 
                   hover:border-zinc-500 hover:bg-zinc-800/50 transition-all duration-200"
      >
        <span className="text-zinc-500">
          <FiUpload size={40} />
        </span>
        <p className="text-zinc-300 text-sm mb-1">
          {file ? file.name : 'Click to select or drag a file'}
        </p>
        <p className="text-xs text-zinc-500">MP3, WAV, M4A (max 10MB)</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Selected File */}
      {file && (
        <div className="mt-4 p-4 bg-zinc-700/50 rounded-lg flex items-center justify-between">
          <span className="text-sm text-zinc-300">{file.name}</span>
          <button
            onClick={() => setFile(null)}
            className="text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>
      )}

      {/* Transcribed Text */}
      {transcribedText && (
        <div className="mt-4 p-4 bg-zinc-700/30 rounded-lg border border-zinc-700">
          <p className="text-xs text-zinc-500 mb-2">Transcription</p>
          <p className="text-sm text-zinc-200">{transcribedText}</p>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file || isProcessing}
        className={`w-full mt-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${!file || isProcessing
          ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
          : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-100'
          }`}
      >
        {isProcessing ? 'Processing...' : 'Process Audio'}
      </button>
    </div>
  );
}