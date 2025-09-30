import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface TransitionScreenProps {
  title: string;
  message: string;
  promptToIA: string;
}

export const TransitionScreen: React.FC<TransitionScreenProps> = ({ title, message, promptToIA }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[500px] text-center animate-fade-in">
      <LoadingSpinner />
      <h3 className="text-2xl font-bold text-cyan-400 mt-6">{title}</h3>
      <p className="text-gray-400 mt-2 max-w-md">{message}</p>

      <div className="mt-8 w-full max-w-2xl">
        <p className="text-sm text-gray-500 text-left mb-2">Enviando para a IA:</p>
        <div className="bg-gray-900/70 border border-gray-700 rounded-lg p-4 text-left max-h-60 overflow-y-auto custom-scrollbar">
          <pre className="whitespace-pre-wrap">
            <code className="font-mono text-sm text-cyan-200/80">
              {promptToIA}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};