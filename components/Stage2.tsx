
import React, { useRef, useEffect } from 'react';
import { StageContainer } from './common/StageContainer';
import { Stage2State } from '../types';

interface Stage2Props {
    state: Stage2State;
    onVariableChange: (value: string) => void;
    onExecute: () => void;
    onComplete: () => void;
    isLoading: boolean;
}

const Stage2: React.FC<Stage2Props> = ({ state, onVariableChange, onExecute, onComplete, isLoading }) => {
    const { data, variableValue, generatedPrompt, response, isComplete } = state;
    const { promptTemplate, variableLabel } = data;
    const responseEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        responseEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [response]);

    const highlightTemplate = (template: string) => {
        const parts = template.split(/(\{[^}]+\})/g);
        return parts.map((part, index) => 
            /\{[^}]+\}/.test(part)
                ? <span key={index} className="bg-cyan-500/20 text-cyan-300 font-mono rounded-md px-1">{part}</span>
                : part
        );
    };

    return (
        <StageContainer
            title="2. Empacotando Prompts: Instruções Repetitivas"
            description="A IA analisou seu pedido e o transformou em um 'template'. Agora, em vez de reescrever tudo, você só precisa mudar a parte variável."
        >
            <div className="grid md:grid-cols-2 gap-8">
                {/* Input Panel */}
                <div className="space-y-6 p-6 bg-gray-800/50 border border-cyan-700/30 rounded-lg shadow-2xl shadow-cyan-900/20 flex flex-col">
                    <div>
                        <label className="block text-sm font-medium text-cyan-300">Template do Prompt</label>
                        <p className="mt-1 block w-full bg-gray-900/50 border border-gray-700 rounded-md p-3 text-gray-300">
                           {highlightTemplate(promptTemplate)}
                        </p>
                    </div>
                    <div>
                        <label htmlFor="variableInput" className="block text-sm font-medium text-cyan-300">{variableLabel}</label>
                        <input 
                            id="variableInput" 
                            type="text" 
                            value={variableValue} 
                            onChange={(e) => onVariableChange(e.target.value)} 
                            className="mt-1 block w-full bg-gray-700/50 border-gray-600 rounded-md shadow-sm p-2 focus:ring-cyan-500 focus:border-cyan-500"
                        />
                    </div>
                     <p className="text-xs text-gray-500 mt-auto pt-2">O prompt à direita é atualizado automaticamente conforme você digita.</p>
                </div>

                {/* Output Panel */}
                <div className="flex flex-col h-[400px] bg-gray-800/50 border border-cyan-700/30 rounded-lg shadow-2xl shadow-cyan-900/20">
                    <div className="p-4 border-b border-cyan-700/30">
                        <h3 className="text-lg font-semibold text-cyan-300">Prompt Gerado</h3>
                        <p className="text-gray-400 text-sm mt-2 h-20 overflow-y-auto custom-scrollbar">{generatedPrompt}</p>
                        <button onClick={onExecute} disabled={!generatedPrompt || isLoading} className="mt-3 w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center">
                            {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Executar Prompt'}
                        </button>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                       {response && <div className="prose prose-invert max-w-none text-gray-200 whitespace-pre-wrap">{response}</div>}
                       {!response && !isLoading && <p className="text-gray-500">A resposta da IA aparecerá aqui.</p>}
                       {isLoading && !response && <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div></div>}
                       {isComplete && (
                            <div className="mt-4 text-center">
                                <button onClick={onComplete} className="bg-blue-600 text-white font-bold py-2 px-8 rounded-md hover:bg-blue-500 transition duration-200 animate-fade-in">
                                    Continuar para o Estágio 3 &rarr;
                                </button>
                            </div>
                        )}
                       <div ref={responseEndRef} />
                    </div>
                </div>
            </div>
        </StageContainer>
    );
};

export default Stage2;
