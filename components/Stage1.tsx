
import React, { useRef, useEffect } from 'react';
import { StageContainer } from './common/StageContainer';
import { Stage1State } from '../types';

interface Stage1Props {
    state: Stage1State;
    onPromptChange: (prompt: string) => void;
    onExecute: () => void;
    onComplete: () => void;
    isLoading: boolean;
}

const Stage1: React.FC<Stage1Props> = ({ state, onPromptChange, onExecute, onComplete, isLoading }) => {
    const { prompt, response, isComplete } = state;
    const responseEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        responseEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [response]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onExecute();
    };
    
    return (
        <StageContainer
            title="1. O Início: Fazendo Perguntas"
            description="Em 2022, a interação era simples. Você fazia uma pergunta direta em uma caixa de texto e recebia uma resposta. Comece a jornada aqui."
        >
            <div className="flex flex-col h-[400px] bg-gray-800/50 border border-cyan-700/30 rounded-lg shadow-2xl shadow-cyan-900/20">
                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                    {response && (
                        <div className="prose prose-invert max-w-none text-gray-200 whitespace-pre-wrap">{response}</div>
                    )}
                     {isLoading && !response && (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                        </div>
                    )}
                    <div ref={responseEndRef} />
                </div>
                <div className="p-4 border-t border-cyan-700/30">
                    <form onSubmit={handleSubmit} className="flex gap-4">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => onPromptChange(e.target.value)}
                            placeholder="Peça algo... Ex: 'uma receita de lasanha' ou 'um poema sobre a lua'"
                            disabled={isLoading}
                            className="flex-1 bg-gray-700/50 border border-gray-600 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-200"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !prompt}
                            className="bg-cyan-600 text-white font-bold py-2 px-6 rounded-md hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                'Enviar'
                            )}
                        </button>
                    </form>
                    {isComplete && (
                        <div className="mt-4 text-center">
                            <button onClick={onComplete} className="bg-blue-600 text-white font-bold py-2 px-8 rounded-md hover:bg-blue-500 transition duration-200 animate-fade-in">
                                Continuar para o Estágio 2 &rarr;
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </StageContainer>
    );
};

export default Stage1;
