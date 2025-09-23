import React, { useRef, useEffect, useState } from 'react';
import { StageContainer } from './common/StageContainer';
import { Stage1State } from '../types';

interface Stage1Props {
    state: Stage1State;
    onPromptChange: (prompt: string) => void;
    onExecute: () => void;
    onComplete: () => void;
    isLoading: boolean;
}

const allPossiblePrompts = [
    "Crie um poema sobre a chuva",
    "Resuma o conceito de buracos negros em termos simples",
    "Sugira 3 nomes para uma cafeteria com tema de gatos",
    "Escreva um roteiro curto para um comercial de carro voador",
    "Qual a receita de um bolo de chocolate vegano?",
    "Crie um plano de treino de 3 dias para iniciantes",
    "Descreva uma cidade futurista subaquática",
    "Gere uma lista de tópicos para um blog de viagens",
    "Escreva um e-mail formal pedindo um dia de folga",
    "Invente um super-herói cujo poder seja a jardinagem"
];

const Stage1: React.FC<Stage1Props> = ({ state, onPromptChange, onExecute, onComplete, isLoading }) => {
    const { prompt, response, isComplete } = state;
    const responseEndRef = useRef<HTMLDivElement>(null);
    const [examplePrompts, setExamplePrompts] = useState<string[]>([]);

    useEffect(() => {
        // Shuffle the array and pick the first 3
        const shuffled = [...allPossiblePrompts].sort(() => 0.5 - Math.random());
        setExamplePrompts(shuffled.slice(0, 3));
    }, []); // Empty dependency array ensures this runs only once on mount

    useEffect(() => {
        responseEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [response]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onExecute();
    };

    const handleExampleClick = (examplePrompt: string) => {
        onPromptChange(examplePrompt);
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

                    <div className="mt-3 text-center">
                        <div className="flex flex-wrap gap-2 justify-center items-center">
                             <span className="text-xs text-gray-500 mr-2">Ou tente:</span>
                            {examplePrompts.map((example) => (
                                <button
                                    key={example}
                                    onClick={() => handleExampleClick(example)}
                                    disabled={isLoading}
                                    className="text-xs bg-gray-700/50 border border-gray-600 text-gray-400 px-3 py-1 rounded-full hover:bg-gray-700 hover:border-cyan-600 hover:text-cyan-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {example}
                                </button>
                            ))}
                        </div>
                    </div>

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