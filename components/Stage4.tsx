
import React, { useState, useEffect } from 'react';
import { StageContainer } from './common/StageContainer';
import { SpecialistTask, AgentIconType } from '../types';
import { orchestrateMission } from '../services/geminiService';
import { OrchestratorIcon, SearchIcon, LogisticsIcon, BudgetIcon, WriterIcon, CheckCircleIcon } from './icons/Icons';

type Status = 'idle' | 'orchestrating' | 'processing' | 'complete';

const agentIcons: Record<AgentIconType, React.FC<React.SVGProps<SVGSVGElement>>> = {
    search: SearchIcon,
    logistics: LogisticsIcon,
    budget: BudgetIcon,
    writer: WriterIcon,
};

const SpecialistAgentCard: React.FC<{ task: SpecialistTask; isComplete: boolean; delay: number }> = ({ task, isComplete, delay }) => {
    const Icon = agentIcons[task.agentIcon] || SearchIcon;
    const animationStyle = { animationDelay: `${delay}ms` };

    return (
        <div className="bg-gray-800/60 p-4 rounded-lg border border-cyan-700/30 flex flex-col gap-3 animate-fade-in" style={animationStyle}>
            <div className="flex items-center gap-3">
                <Icon className="w-8 h-8 text-cyan-400 flex-shrink-0" />
                <div>
                    <h4 className="font-bold text-white">{task.agentName}</h4>
                    <p className="text-xs text-gray-400">{task.taskDescription}</p>
                </div>
                <div className="ml-auto flex-shrink-0">
                    {isComplete ? (
                         <CheckCircleIcon className="w-6 h-6 text-green-400" />
                    ) : (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-400"></div>
                    )}
                </div>
            </div>
            {isComplete && (
                <div className="bg-gray-900/50 p-3 rounded-md border border-gray-700 animate-fade-in">
                    <p className="text-sm text-gray-300"><strong className="text-cyan-300">Resultado:</strong> {task.result}</p>
                </div>
            )}
        </div>
    );
};


const Stage4: React.FC<{ onRestart: () => void }> = ({ onRestart }) => {
    const [mission, setMission] = useState('');
    const [status, setStatus] = useState<Status>('idle');
    const [tasks, setTasks] = useState<SpecialistTask[]>([]);
    const [finalReport, setFinalReport] = useState('');
    const [error, setError] = useState('');

    const handleDelegate = async () => {
        if (!mission.trim()) return;
        setStatus('orchestrating');
        setError('');
        setTasks([]);
        setFinalReport('');

        try {
            const result = await orchestrateMission(mission);
            setTasks(result.tasks);
            setFinalReport(result.finalReport);

            setTimeout(() => {
                setStatus('processing');
                setTimeout(() => {
                    setStatus('complete');
                }, (result.tasks.length * 500) + 1000); // Wait for cards to finish their "work"
            }, 2000); // Time for orchestrator animation

        } catch (e) {
            console.error(e);
            setError('Desculpe, não foi possível orquestrar essa missão. Tente uma tarefa diferente ou verifique sua chave de API.');
            setStatus('idle');
        }
    };

    const handleReset = () => {
        setStatus('idle');
        setMission('');
        setTasks([]);
        setFinalReport('');
        setError('');
    };

    return (
        <StageContainer
            title="4. O Futuro: A IA como Agente"
            description="A interação evolui de dar uma tarefa para delegar uma responsabilidade. Descreva uma missão complexa e veja um agente orquestrador de IA quebrar a tarefa, delegar a especialistas e consolidar a solução."
        >
            <div className="space-y-6">
                <form onSubmit={(e) => { e.preventDefault(); handleDelegate(); }} className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        value={mission}
                        onChange={(e) => setMission(e.target.value)}
                        placeholder="Delegue uma missão complexa... Ex: 'planeje uma viagem de 3 dias para a Chapada Diamantina com foco em trilhas'"
                        disabled={status !== 'idle'}
                        className="flex-1 bg-gray-700/50 border border-gray-600 rounded-md px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-200 disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={status !== 'idle' || !mission.trim()}
                        className="bg-cyan-600 text-white font-bold py-3 px-6 rounded-md hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center"
                    >
                         {status === 'orchestrating' || status === 'processing' ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                <span>Orquestrando...</span>
                            </>
                         ) : (
                            'Delegar Missão'
                         )}
                    </button>
                </form>

                {error && <p className="text-center text-red-400">{error}</p>}

                <div className="min-h-[300px] p-4 bg-gray-800/30 border border-cyan-800/20 rounded-lg">
                    {status === 'idle' && <p className="text-center text-gray-500 h-full flex items-center justify-center">O painel de orquestração aparecerá aqui.</p>}
                    
                    {status === 'orchestrating' && (
                        <div className="flex flex-col items-center justify-center h-full animate-fade-in text-center">
                            <OrchestratorIcon className="w-16 h-16 text-cyan-400 animate-pulse" />
                            <h3 className="text-xl font-bold text-white mt-4">Agente Orquestrador Ativado</h3>
                            <p className="text-gray-400">Analisando a missão e montando a equipe de especialistas...</p>
                        </div>
                    )}

                    {(status === 'processing' || status === 'complete') && (
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-cyan-300 mb-2">Painel de Orquestração:</h3>
                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                {tasks.map((task, index) => (
                                    <SpecialistAgentCard key={index} task={task} isComplete={status === 'complete'} delay={index * 200} />
                                ))}
                            </div>
                        </div>
                    )}

                    {status === 'complete' && (
                        <div className="mt-6 animate-fade-in" style={{ animationDelay: '500ms' }}>
                            <h3 className="text-xl font-bold text-cyan-300">Relatório Final da Missão:</h3>
                            <div className="mt-2 p-4 bg-gray-900/70 border border-gray-700 rounded-lg prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap">
                                {finalReport}
                            </div>
                            <div className="text-center mt-6">
                                <button
                                    onClick={handleReset}
                                    className="bg-blue-600 text-white font-bold py-2 px-8 rounded-md hover:bg-blue-500 transition duration-200"
                                >
                                    Delegar Outra Missão
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                {status === 'complete' && (
                     <div className="text-center mt-6">
                        <button
                            onClick={onRestart}
                            className="text-sm text-cyan-400 hover:text-cyan-200"
                        >
                            &larr; Recomeçar toda a jornada
                        </button>
                    </div>
                )}
            </div>
        </StageContainer>
    );
};

export default Stage4;
