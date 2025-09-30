import React, { useEffect, useRef } from 'react';
import { StageContainer } from './common/StageContainer';
import { Stage3State, FormField, Stage } from '../types';
import { LoadingSpinner } from './common/LoadingSpinner';
import { PromptJourney } from './common/PromptJourney';

interface Stage3Props {
    state: Stage3State;
    onFormChange: (formState: Record<string, string>) => void;
    onExecute: () => void;
    onComplete: () => void;
    isLoading: boolean;
    stage1Prompt?: string;
    stage2Prompt?: string;
    stage3FinalPrompt?: string;
    currentStage: Stage;
}

const renderField = (field: FormField, value: string, onChange: (name: string, value: string) => void) => {
    const commonProps = {
        id: field.name,
        name: field.name,
        value: value || '',
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => onChange(field.name, e.target.value),
        className: "mt-1 block w-full bg-gray-700/50 border-gray-600 rounded-md shadow-sm p-2 focus:ring-cyan-500 focus:border-cyan-500"
    };

    switch (field.type) {
        case 'textarea':
            return <textarea {...commonProps} placeholder={field.placeholder} rows={3} />;
        case 'select':
            return (
                <select {...commonProps}>
                    {field.placeholder && <option value="">{field.placeholder}</option>}
                    {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            );
        case 'text':
        default:
            return <input type="text" {...commonProps} placeholder={field.placeholder} />;
    }
};

const Stage3: React.FC<Stage3Props> = ({ state, onFormChange, onExecute, isLoading, onComplete, stage1Prompt, stage2Prompt, stage3FinalPrompt, currentStage }) => {
    const { appData, formState, response, isComplete } = state;
    const responseEndRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        responseEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [response]);


    const handleFieldChange = (name: string, value: string) => {
        onFormChange({ ...formState, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onExecute();
    };

    const isButtonDisabled = isLoading || (appData && Object.values(formState).some(v => v === ''));

    return (
        <StageContainer
            title="3. Materializando em Aplicativos"
            description="A IA extraiu os parâmetros do seu prompt e gerou o app abaixo. Esta é a evolução final: a IA integrada, trabalhando nos bastidores."
        >
             <PromptJourney
                stage1Prompt={stage1Prompt}
                stage2Prompt={stage2Prompt}
                stage3Prompt={stage3FinalPrompt}
                currentStage={currentStage}
            />

            {!appData ? (
                 <div className="text-center p-8 text-gray-500">
                    Aguardando a geração da interface do aplicativo a partir do Estágio 2...
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-8">
                    {/* App Panel */}
                    <div className="p-6 bg-gray-800/50 border border-cyan-700/30 rounded-lg shadow-2xl shadow-cyan-900/20">
                        <h3 className="text-2xl font-bold text-center text-cyan-300 mb-1">{appData.appName}</h3>
                        <p className="text-center text-gray-400 mb-6">{appData.appDescription}</p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {appData.fields.map(field => (
                                <div key={field.name}>
                                    <label htmlFor={field.name} className="block text-sm font-medium text-cyan-300">{field.label}</label>
                                    {renderField(field, formState[field.name], handleFieldChange)}
                                </div>
                            ))}
                            <button type="submit" disabled={isButtonDisabled} className="w-full bg-cyan-600 text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-500 disabled:bg-gray-600 transition duration-200">
                                {isLoading ? 'Gerando...' : appData.buttonText}
                            </button>
                        </form>
                    </div>

                    {/* Response Panel */}
                    <div className="flex flex-col bg-gray-800/50 border border-cyan-700/30 rounded-lg shadow-2xl shadow-cyan-900/20 min-h-[400px]">
                        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar min-h-0">
                            {isLoading && !response && (
                                <div className="flex flex-col items-center justify-center h-full">
                                    <LoadingSpinner />
                                    <p className="text-cyan-300 mt-2">Executando...</p>
                                </div>
                            )}
                            {!isLoading && !response && <p className="text-gray-500 text-center my-auto">O resultado do aplicativo aparecerá aqui.</p>}
                            {response && (
                                <div className="prose prose-invert max-w-none text-gray-200 whitespace-pre-wrap">{response}</div>
                            )}
                            <div ref={responseEndRef} />
                        </div>
                        {isComplete && !isLoading && (
                            <div className="p-4 border-t border-cyan-700/30 text-center">
                                <button onClick={onComplete} className="bg-blue-600 text-white font-bold py-2 px-8 rounded-md hover:bg-blue-500 transition duration-200 animate-fade-in">
                                    Continuar para o Estágio 4 &rarr;
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </StageContainer>
    );
};

export default Stage3;
